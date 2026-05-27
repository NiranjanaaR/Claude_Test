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

function parseSearchResults(html) {
  const $ = cheerio.load(html);
  const listings = [];

  const scriptTags = $('script').toArray();
  for (const script of scriptTags) {
    const content = $(script).html() || '';
    if (content.includes('"docs"') && content.includes('"heading"')) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*"docs"\s*:\s*\[[\s\S]*\][\s\S]*\}/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          if (data.docs && Array.isArray(data.docs)) {
            for (const doc of data.docs) {
              const listing = extractFromJson(doc);
              if (listing) listings.push(listing);
            }
            if (listings.length > 0) return listings;
          }
        }
      } catch (e) { /* continue to HTML parsing */ }
    }
  }

  const nextDataScript = $('#__NEXT_DATA__');
  if (nextDataScript.length) {
    try {
      const nextData = JSON.parse(nextDataScript.html());
      const searchResult = findDeep(nextData, 'docs') || findDeep(nextData, 'ads');
      if (Array.isArray(searchResult)) {
        for (const doc of searchResult) {
          const listing = extractFromJson(doc);
          if (listing) listings.push(listing);
        }
        if (listings.length > 0) return listings;
      }
    } catch (e) { /* continue to HTML parsing */ }
  }

  $('article, [data-testid*="ad"], .ads__unit, .sf-search-ad, a[href*="/car/used/ad.html"]').each((_, el) => {
    const $el = $(el);
    const listing = extractFromHtml($, $el);
    if (listing && listing.title && listing.price > 0) {
      listings.push(listing);
    }
  });

  if (listings.length === 0) {
    $('a[href*="finnkode"]').each((_, el) => {
      const $el = $(el).closest('article, div, li');
      if ($el.length) {
        const listing = extractFromHtml($, $el);
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

function findDeep(obj, key) {
  if (!obj || typeof obj !== 'object') return null;
  if (obj[key]) return obj[key];
  for (const k of Object.keys(obj)) {
    const result = findDeep(obj[k], key);
    if (result) return result;
  }
  return null;
}

async function scrapeFinn(params) {
  const url = buildFinnUrl(params);
  console.log('Fetching FINN.no:', url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'nb-NO,nb;q=0.9,no;q=0.8,en;q=0.5',
        'Accept-Encoding': 'identity',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error('FINN.no returned status:', response.status);
      return [];
    }

    const html = await response.text();
    const listings = parseSearchResults(html);
    console.log(`Parsed ${listings.length} listings from FINN.no`);
    return listings;
  } catch (err) {
    clearTimeout(timeout);
    console.error('Failed to fetch FINN.no:', err.message);
    return [];
  }
}

async function scrapeListingDetail(url) {
  if (!url) return {};
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept-Language': 'nb-NO,nb;q=0.9',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return {};

    const html = await response.text();
    const $ = cheerio.load(html);
    const description = $('[class*="description"], [data-testid*="description"], .u-word-break').text().trim();
    const allText = $('body').text();
    const euMatch = allText.match(/EU.?(?:godkjent|kontroll).*?(\d{1,2}[.\/]\d{1,2}[.\/]\d{2,4}|\d{4})/i);
    const euDate = euMatch ? euMatch[1] : '';

    return { description, euDate };
  } catch (err) {
    clearTimeout(timeout);
    return {};
  }
}

module.exports = { scrapeFinn, scrapeListingDetail, buildFinnUrl, FINN_BRAND_CODES, FINN_FUEL_CODES };
