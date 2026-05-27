(function() {
  var SERVER = 'http://localhost:3000';
  var MAX_CONCURRENT = 4;

  function showStatus(msg) {
    var overlay = document.getElementById('bildeal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bildeal-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#1e40af;color:white;padding:16px;text-align:center;font-family:sans-serif;font-size:16px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.3)';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = msg;
  }

  function extractYear(card) {
    var infoEls = card.querySelectorAll('[class*="key"], [class*="info"], [class*="detail"], [class*="label"], [class*="meta"], span, dd, li');
    for (var i = 0; i < infoEls.length; i++) {
      var t = infoEls[i].innerText.trim();
      if (/^\d{4}$/.test(t)) {
        var y = parseInt(t);
        if (y >= 1990 && y <= new Date().getFullYear() + 1) return y;
      }
      var m = t.match(/\b(19\d{2}|20[0-2]\d)\b/);
      if (m) {
        var yr = parseInt(m[1]);
        if (yr >= 1990 && yr <= new Date().getFullYear() + 1) return yr;
      }
    }
    var title = (card.querySelector('h2, h3') || {}).innerText || '';
    var tm = title.match(/\b(19\d{2}|20[0-2]\d)\b/);
    if (tm) return parseInt(tm[1]);
    return 0;
  }

  function extractMileage(card) {
    var text = card.innerText || '';
    var matches = text.match(/([\d\s]{1,10})\s*km\b/gi);
    if (!matches) return 0;
    for (var i = 0; i < matches.length; i++) {
      var num = parseInt(matches[i].replace(/\s/g, '').replace(/km/i, ''), 10);
      if (num >= 100 && num <= 999999) return num;
    }
    return 0;
  }

  function extractPrice(card) {
    var priceEls = card.querySelectorAll('[class*="rice"], [class*="Rice"], [class*="amount"], [class*="Amount"]');
    for (var i = 0; i < priceEls.length; i++) {
      var t = priceEls[i].innerText.trim();
      var num = parseInt(t.replace(/\s/g, '').replace(/[^\d]/g, ''), 10);
      if (num >= 1000 && num <= 9999999) return num;
    }
    var text = card.innerText || '';
    var m = text.match(/([\d\s]{3,})\s*kr\b/);
    if (m) {
      var num = parseInt(m[1].replace(/\s/g, ''), 10);
      if (num >= 1000) return num;
    }
    return 0;
  }

  function validateYear(year, mileage) {
    var currentYear = new Date().getFullYear();
    if (year > currentYear + 1) return 0;
    if (year > currentYear && mileage > 10000) return 0;
    if (mileage > 200000 && year > currentYear - 3) return Math.max(0, currentYear - Math.floor(mileage / 15000));
    if (mileage > 100000 && year > currentYear - 1) return Math.max(0, currentYear - Math.floor(mileage / 15000));
    return year;
  }

  function extractListings() {
    var listings = [];
    var adLinks = document.querySelectorAll('a[href*="/car/used/ad.html"], a[href*="finnkode"]');
    var seen = new Set();

    adLinks.forEach(function(link) {
      var href = link.href || '';
      if (seen.has(href)) return;
      seen.add(href);

      var card = link.closest('article') || link.closest('[class*="ad"]') || link.closest('[class*="Ad"]') || link;
      var text = card.innerText || '';

      var title = '';
      var headings = card.querySelectorAll('h2, h3, [class*="heading"], [class*="title"], [class*="Heading"], [class*="Title"]');
      if (headings.length > 0) {
        title = headings[0].innerText.trim();
      } else {
        var lines = text.split('\n').map(function(l) { return l.trim(); }).filter(Boolean);
        if (lines.length > 0) title = lines[0];
      }
      if (!title || title.length < 3) return;

      var price = extractPrice(card);
      var mileage = extractMileage(card);
      var year = extractYear(card);
      year = validateYear(year, mileage);

      var fuel = '';
      if (/\bdiesel\b/i.test(text)) fuel = 'Diesel';
      else if (/\bbensin\b/i.test(text)) fuel = 'Bensin';
      else if (/\belektrisk\b/i.test(text)) fuel = 'Elektrisk';
      else if (/\bhybrid\b/i.test(text)) fuel = 'Hybrid';

      var transmission = '';
      if (/\bautomat\b/i.test(text)) transmission = 'Automat';
      else if (/\bmanuell\b/i.test(text)) transmission = 'Manuell';

      var locationEls = card.querySelectorAll('[class*="ocation"], [class*="place"], [class*="area"]');
      var location = locationEls.length > 0 ? locationEls[0].innerText.trim() : '';

      if (price > 0) {
        listings.push({
          title: title, price: price, year: year, mileage: mileage,
          fuel: fuel, transmission: transmission, location: location,
          link: href, description: '', source: 'finn'
        });
      }
    });

    if (listings.length === 0) {
      var articles = document.querySelectorAll('article, [class*="result"], [class*="Result"]');
      articles.forEach(function(card) {
        var text = card.innerText || '';
        var linkEl = card.querySelector('a[href*="finn.no"]') || card.querySelector('a');
        var href = linkEl ? linkEl.href : '';
        var headings = card.querySelectorAll('h2, h3');
        var title = headings.length > 0 ? headings[0].innerText.trim() : '';
        if (!title) return;
        var price = extractPrice(card);
        var mileage = extractMileage(card);
        var year = extractYear(card);
        year = validateYear(year, mileage);
        if (price > 0) {
          listings.push({
            title: title, price: price, year: year, mileage: mileage,
            fuel: /\bdiesel\b/i.test(text)?'Diesel': /\bbensin\b/i.test(text)?'Bensin': /\belektrisk\b/i.test(text)?'Elektrisk': /\bhybrid\b/i.test(text)?'Hybrid':'',
            transmission: /\bautomat\b/i.test(text)?'Automat': /\bmanuell\b/i.test(text)?'Manuell':'',
            location: '', link: href, description: '', source: 'finn'
          });
        }
      });
    }

    return listings;
  }

  async function fetchDescription(url) {
    try {
      var resp = await fetch(url, { credentials: 'include' });
      if (!resp.ok) return '';
      var html = await resp.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');

      // Try various selectors for description
      var descEl = doc.querySelector('[class*="description" i]')
        || doc.querySelector('[data-testid*="description"]')
        || doc.querySelector('[class*="body" i][class*="text" i]')
        || doc.querySelector('.u-word-break');

      if (descEl) return descEl.innerText.trim();

      // Fallback: look for a large text block that looks like a description
      var paragraphs = doc.querySelectorAll('p, div');
      var best = '';
      for (var i = 0; i < paragraphs.length; i++) {
        var t = paragraphs[i].innerText.trim();
        if (t.length > best.length && t.length > 50 && t.length < 5000) {
          // Skip if it looks like navigation or boilerplate
          if (!/copyright|personvern|cookie|annonse.*vilkår/i.test(t)) {
            best = t;
          }
        }
      }
      return best;
    } catch (e) {
      return '';
    }
  }

  async function fetchAllDescriptions(listings) {
    var total = listings.length;
    var done = 0;

    // Process in batches of MAX_CONCURRENT
    for (var i = 0; i < listings.length; i += MAX_CONCURRENT) {
      var batch = listings.slice(i, i + MAX_CONCURRENT);
      var promises = batch.map(function(listing) {
        if (!listing.link) return Promise.resolve('');
        return fetchDescription(listing.link);
      });

      var results = await Promise.all(promises);
      for (var j = 0; j < results.length; j++) {
        listings[i + j].description = results[j];
      }

      done += batch.length;
      showStatus('BilDeal: Henter beskrivelser... ' + done + '/' + total
        + '<div style="background:rgba(255,255,255,0.2);height:6px;border-radius:3px;margin-top:8px;overflow:hidden">'
        + '<div style="background:white;height:100%;border-radius:3px;width:' + Math.round(done/total*100) + '%"></div></div>');
    }
  }

  // --- Main ---
  if (!window.location.hostname.includes('finn.no')) {
    alert('BilDeal: Åpne denne på en FINN.no bilsøk-side!');
    return;
  }

  showStatus('BilDeal: Henter bildata fra denne siden...');
  var listings = extractListings();

  if (listings.length === 0) {
    showStatus('BilDeal: Fant ingen annonser. Sørg for at du er på en søkeresultatside.');
    setTimeout(function() { var el = document.getElementById('bildeal-overlay'); if (el) el.remove(); }, 4000);
    return;
  }

  showStatus('BilDeal: Fant ' + listings.length + ' annonser! Henter beskrivelser fra hver annonse...');

  fetchAllDescriptions(listings).then(function() {
    var withDesc = listings.filter(function(l) { return l.description.length > 10; }).length;
    showStatus('BilDeal: ' + listings.length + ' annonser, ' + withDesc + ' med beskrivelser. Analyserer...');

    var form = document.createElement('form');
    form.method = 'POST';
    form.action = SERVER + '/results';
    form.target = '_blank';
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'listings';
    input.value = JSON.stringify(listings);
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    form.remove();

    setTimeout(function() { var el = document.getElementById('bildeal-overlay'); if (el) el.remove(); }, 3000);
  });
})();
