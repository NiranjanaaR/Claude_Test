const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const FINN_BRAND_CODES = {
  'audi': '0.712', 'bmw': '0.714', 'citroen': '0.716', 'ford': '0.720',
  'honda': '0.723', 'hyundai': '0.725', 'kia': '0.728', 'mazda': '0.732',
  'mercedes-benz': '0.733', 'mitsubishi': '0.734', 'nissan': '0.736',
  'opel': '0.737', 'peugeot': '0.738', 'renault': '0.739', 'seat': '0.740',
  'skoda': '0.741', 'subaru': '0.742', 'suzuki': '0.743', 'tesla': '0.8054',
  'toyota': '0.744', 'volkswagen': '0.749', 'volvo': '0.748',
};

const FINN_FUEL_CODES = {
  'bensin': '1', 'diesel': '2', 'hybrid': '3', 'elektrisk': '4', 'pluginhybrid': '5',
};

const FINN_TRANSMISSION_CODES = {
  'manuell': '1', 'automat': '2',
};

let browserInstance = null;

async function getBrowser() {
  if (browserInstance && browserInstance.connected) return browserInstance;
  browserInstance = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-size=1920,1080',
    ],
  });
  return browserInstance;
}

function buildFinnUrl(params) {
  const base = 'https://www.finn.no/car/used/search.html';
  const query = new URLSearchParams();
  query.set('sort', 'PUBLISHED_DESC');

  if (params.brand) {
    const code = FINN_BRAND_CODES[params.brand.toLowerCase()];
    if (code) query.set('make', code);
  }
  if (params.price_from) query.set('price_from', params.price_from);
  if (params.price_to) query.set('price_to', params.price_to);
  if (params.year_from) query.set('year_from', params.year_from);
  if (params.year_to) query.set('year_to', params.year_to);
  if (params.mileage_to) query.set('mileage_to', params.mileage_to);
  if (params.fuel) {
    const code = FINN_FUEL_CODES[params.fuel.toLowerCase()];
    if (code) query.set('fuel', code);
  }
  if (params.transmission) {
    const code = FINN_TRANSMISSION_CODES[params.transmission.toLowerCase()];
    if (code) query.set('transmission', code);
  }
  if (params.page) query.set('page', params.page);

  return `${base}?${query.toString()}`;
}

async function scrapeFinn(params) {
  const url = buildFinnUrl(params);
  console.log('Fetching FINN.no with Puppeteer:', url);

  let browser;
  let page;
  try {
    browser = await getBrowser();
    page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'nb-NO,nb;q=0.9,no;q=0.8' });
    await page.setViewport({ width: 1920, height: 1080 });

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Accept cookies if a consent dialog appears
    try {
      const consentBtn = await page.waitForSelector(
        'button[title*="Godta"], button[title*="godta"], button[title*="Accept"], button:has-text("Godta alle"), [class*="consent"] button, #onetrust-accept-btn-handler',
        { timeout: 3000 }
      );
      if (consentBtn) await consentBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    } catch (_) { /* no consent dialog */ }

    await new Promise(r => setTimeout(r, 2000));

    // Try extracting data from the page's JavaScript context first
    const jsonListings = await page.evaluate(() => {
      const results = [];

      // Look for data in window/global state
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        const text = script.textContent || '';
        if (text.includes('"docs"') && text.includes('"heading"')) {
          try {
            const match = text.match(/"docs"\s*:\s*(\[[\s\S]*?\])\s*[,}]/);
            if (match) {
              const docs = JSON.parse(match[1]);
              for (const doc of docs) {
                if (doc.heading || doc.title) {
                  results.push(doc);
                }
              }
            }
          } catch (e) { /* continue */ }
        }
      }

      // Check __NEXT_DATA__
      const nextData = document.getElementById('__NEXT_DATA__');
      if (nextData && results.length === 0) {
        try {
          const data = JSON.parse(nextData.textContent);
          const findDocs = (obj) => {
            if (!obj || typeof obj !== 'object') return null;
            if (Array.isArray(obj.docs)) return obj.docs;
            for (const key of Object.keys(obj)) {
              const r = findDocs(obj[key]);
              if (r) return r;
            }
            return null;
          };
          const docs = findDocs(data);
          if (docs) results.push(...docs);
        } catch (e) { /* continue */ }
      }

      return results;
    });

    if (jsonListings && jsonListings.length > 0) {
      console.log(`Found ${jsonListings.length} listings via embedded JSON`);
      const parsed = jsonListings.map(extractFromJson).filter(Boolean);
      await page.close();
      return parsed;
    }

    // Fallback: scrape rendered HTML
    const html = await page.content();
    await page.close();

    const listings = parseSearchResults(html);
    console.log(`Parsed ${listings.length} listings from rendered HTML`);
    return listings;

  } catch (err) {
    console.error('Puppeteer scrape failed:', err.message);
    if (page) await page.close().catch(() => {});
    return [];
  }
}

async function scrapeListingDetail(listingUrl) {
  if (!listingUrl || !listingUrl.includes('finn.no')) return {};

  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );
    await page.goto(listingUrl, { waitUntil: 'networkidle2', timeout: 20000 });

    const detail = await page.evaluate(() => {
      const descEl = document.querySelector('[class*="description"], [data-testid*="description"]');
      const description = descEl ? descEl.innerText.trim() : '';
      const bodyText = document.body.innerText;
      const euMatch = bodyText.match(/EU.?(?:godkjent|kontroll).*?(\d{1,2}[./]\d{1,2}[./]\d{2,4}|\d{4})/i);
      return { description, euDate: euMatch ? euMatch[1] : '' };
    });

    await page.close();
    return detail;
  } catch (err) {
    if (page) await page.close().catch(() => {});
    return {};
  }
}

function parseSearchResults(html) {
  const $ = cheerio.load(html);
  const listings = [];

  $('article, [data-testid*="ad"], .sf-search-ad, [class*="AdCard"], [class*="ad-card"]').each((_, el) => {
    const $el = $(el);
    const listing = extractFromHtml($, $el);
    if (listing && listing.title && listing.price > 0) {
      listings.push(listing);
    }
  });

  if (listings.length === 0) {
    $('a[href*="/car/used/ad.html"], a[href*="finnkode"]').each((_, el) => {
      const $parent = $(el).closest('article, section, div[class]');
      if ($parent.length) {
        const listing = extractFromHtml($, $parent);
        if (listing && listing.title && listing.price > 0) {
          listings.push(listing);
        }
      }
    });
  }

  return listings;
}

function extractFromJson(doc) {
  if (!doc) return null;
  const title = doc.heading || doc.title || doc.ad_title || '';
  if (!title) return null;

  let price = doc.price?.amount || doc.price?.value || doc.price || 0;
  if (typeof price === 'string') price = parseInt(price.replace(/\D/g, ''), 10) || 0;
  if (typeof price === 'object') price = 0;

  const keys = doc.labels || doc.key_info || doc.keys || [];
  let year = doc.year || 0;
  let mileage = doc.mileage || 0;
  let fuel = doc.fuel || '';
  let transmission = doc.transmission || '';

  if (Array.isArray(keys)) {
    for (const k of keys) {
      const val = (typeof k === 'string' ? k : k.text || k.value || '').toString();
      if (/^\d{4}$/.test(val) && parseInt(val) >= 1990 && parseInt(val) <= 2027) {
        if (!year) year = parseInt(val);
      } else if (/\d+\s*km/i.test(val)) {
        if (!mileage) mileage = parseInt(val.replace(/\D/g, ''), 10);
      } else if (/bensin|diesel|elektr|hybrid|plugin/i.test(val)) {
        if (!fuel) fuel = val;
      } else if (/automat|manuell|auto\b/i.test(val)) {
        if (!transmission) transmission = val;
      }
    }
  }

  const link = doc.canonical_url || doc.ad_link || doc.url || '';
  const id = doc.id || doc.ad_id || doc.finnkode || '';
  const image = doc.image?.url || doc.image?.src || (doc.images && doc.images[0]?.url) || '';
  const location = doc.location || '';

  return {
    id: id.toString(),
    title,
    price,
    year: parseInt(year) || 0,
    mileage: parseInt(mileage) || 0,
    fuel,
    transmission,
    location: typeof location === 'string' ? location : (location.name || ''),
    link: link.startsWith('http') ? link : (link ? `https://www.finn.no${link}` : ''),
    image,
    source: 'finn',
  };
}

function extractFromHtml($, $el) {
  const title = $el.find('h2, h3, [class*="heading"], [class*="title"]').first().text().trim();
  const priceText = $el.find('[class*="price"], [class*="Price"]').first().text().trim();
  const price = parseInt(priceText.replace(/\D/g, ''), 10) || 0;

  const linkEl = $el.is('a') ? $el : $el.find('a[href*="/car/"], a[href*="finnkode"]').first();
  let link = linkEl.attr('href') || '';
  if (link && !link.startsWith('http')) link = `https://www.finn.no${link}`;

  const infoText = $el.text();
  const yearMatch = infoText.match(/\b(19|20)\d{2}\b/);
  const mileageMatch = infoText.match(/([\d\s]+)\s*km/i);
  const year = yearMatch ? parseInt(yearMatch[0]) : 0;
  const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/\s/g, ''), 10) : 0;

  let fuel = '';
  if (/diesel/i.test(infoText)) fuel = 'Diesel';
  else if (/bensin/i.test(infoText)) fuel = 'Bensin';
  else if (/elektrisk|electric/i.test(infoText)) fuel = 'Elektrisk';
  else if (/hybrid/i.test(infoText)) fuel = 'Hybrid';

  let transmission = '';
  if (/automat/i.test(infoText)) transmission = 'Automat';
  else if (/manuell/i.test(infoText)) transmission = 'Manuell';

  const img = $el.find('img').first().attr('src') || '';

  return { id: '', title, price, year, mileage, fuel, transmission, location: '', link, image: img, source: 'finn' };
}

async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close().catch(() => {});
    browserInstance = null;
  }
}

process.on('exit', () => { if (browserInstance) browserInstance.close().catch(() => {}); });
process.on('SIGINT', async () => { await closeBrowser(); process.exit(0); });

module.exports = { scrapeFinn, scrapeListingDetail, buildFinnUrl, closeBrowser, FINN_BRAND_CODES, FINN_FUEL_CODES };
