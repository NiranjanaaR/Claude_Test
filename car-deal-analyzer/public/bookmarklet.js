(function() {
  var SERVER = 'http://localhost:3000';

  function showStatus(msg) {
    var overlay = document.getElementById('bildeal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bildeal-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#1e40af;color:white;padding:16px;text-align:center;font-family:sans-serif;font-size:16px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.3)';
      document.body.appendChild(overlay);
    }
    overlay.textContent = msg;
  }

  function extractListings() {
    var listings = [];

    // Strategy 1: Find all ad links pointing to car ads
    var adLinks = document.querySelectorAll('a[href*="/car/used/ad.html"], a[href*="finnkode"]');
    var seen = new Set();

    adLinks.forEach(function(link) {
      var href = link.href || '';
      if (seen.has(href)) return;
      seen.add(href);

      // Walk up to find the card container
      var card = link.closest('article') || link.closest('[class*="ad"]') || link.closest('[class*="Ad"]') || link;

      var text = card.innerText || '';
      var lines = text.split('\n').map(function(l) { return l.trim(); }).filter(Boolean);

      var title = '';
      var headings = card.querySelectorAll('h2, h3, [class*="heading"], [class*="title"], [class*="Heading"], [class*="Title"]');
      if (headings.length > 0) {
        title = headings[0].innerText.trim();
      } else if (lines.length > 0) {
        title = lines[0];
      }

      if (!title || title.length < 3) return;

      var priceEl = card.querySelector('[class*="rice"], [class*="Rice"]');
      var priceText = priceEl ? priceEl.innerText : '';
      if (!priceText) {
        var priceMatch = text.match(/([\d\s]+)\s*kr/);
        if (priceMatch) priceText = priceMatch[0];
      }
      var price = parseInt((priceText || '').replace(/\s/g, '').replace(/[^\d]/g, ''), 10) || 0;

      var yearMatch = text.match(/\b(20[0-2]\d|19\d{2})\b/);
      var year = yearMatch ? parseInt(yearMatch[1]) : 0;

      var kmMatch = text.match(/([\d\s]+)\s*km/i);
      var mileage = kmMatch ? parseInt(kmMatch[1].replace(/\s/g, ''), 10) : 0;

      var fuel = '';
      if (/diesel/i.test(text)) fuel = 'Diesel';
      else if (/bensin/i.test(text)) fuel = 'Bensin';
      else if (/elektrisk/i.test(text)) fuel = 'Elektrisk';
      else if (/hybrid/i.test(text)) fuel = 'Hybrid';

      var transmission = '';
      if (/automat/i.test(text)) transmission = 'Automat';
      else if (/manuell/i.test(text)) transmission = 'Manuell';

      var locationEls = card.querySelectorAll('[class*="ocation"], [class*="place"]');
      var location = locationEls.length > 0 ? locationEls[0].innerText.trim() : '';

      if (price > 0 || year > 0) {
        listings.push({
          title: title,
          price: price,
          year: year,
          mileage: mileage,
          fuel: fuel,
          transmission: transmission,
          location: location,
          link: href,
          description: '',
          source: 'finn'
        });
      }
    });

    // Strategy 2: If no links found, try article elements
    if (listings.length === 0) {
      var articles = document.querySelectorAll('article, [class*="result"], [class*="Result"]');
      articles.forEach(function(card) {
        var text = card.innerText || '';
        var linkEl = card.querySelector('a[href*="finn.no"]') || card.querySelector('a');
        var href = linkEl ? linkEl.href : '';

        var headings = card.querySelectorAll('h2, h3');
        var title = headings.length > 0 ? headings[0].innerText.trim() : '';
        if (!title) return;

        var priceMatch = text.match(/([\d\s]{3,})\s*kr/);
        var price = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, ''), 10) : 0;

        var yearMatch = text.match(/\b(20[0-2]\d|19\d{2})\b/);
        var kmMatch = text.match(/([\d\s]+)\s*km/i);

        if (price > 0) {
          listings.push({
            title: title,
            price: price,
            year: yearMatch ? parseInt(yearMatch[1]) : 0,
            mileage: kmMatch ? parseInt(kmMatch[1].replace(/\s/g, ''), 10) : 0,
            fuel: /diesel/i.test(text) ? 'Diesel' : /bensin/i.test(text) ? 'Bensin' : /elektrisk/i.test(text) ? 'Elektrisk' : /hybrid/i.test(text) ? 'Hybrid' : '',
            transmission: /automat/i.test(text) ? 'Automat' : /manuell/i.test(text) ? 'Manuell' : '',
            location: '',
            link: href,
            description: '',
            source: 'finn'
          });
        }
      });
    }

    return listings;
  }

  // Check we're on FINN.no
  if (!window.location.hostname.includes('finn.no')) {
    alert('BilDeal: Åpne denne på en FINN.no bilsøk-side!');
    return;
  }

  showStatus('BilDeal: Henter bildata fra denne siden...');

  var listings = extractListings();

  if (listings.length === 0) {
    showStatus('BilDeal: Fant ingen annonser på denne siden. Sørg for at du er på en søkeresultatside.');
    setTimeout(function() {
      var el = document.getElementById('bildeal-overlay');
      if (el) el.remove();
    }, 4000);
    return;
  }

  showStatus('BilDeal: Fant ' + listings.length + ' annonser! Analyserer...');

  // Submit via form POST to open results in new tab
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

  setTimeout(function() {
    var el = document.getElementById('bildeal-overlay');
    if (el) el.remove();
  }, 3000);
})();
