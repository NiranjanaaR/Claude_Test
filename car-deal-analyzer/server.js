const express = require('express');
const path = require('path');
const { scrapeFinn, scrapeListingDetail } = require('./scraper');
const { analyzeListings, analyzeManualInput } = require('./analyzer');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/search', async (req, res) => {
  const params = req.query;
  console.log('Search request:', params);
  try {
    const listings = await scrapeFinn(params);
    console.log(`Scrape returned ${listings.length} listings`);
    if (!listings || listings.length === 0) {
      return res.json({
        source: 'none',
        note: 'Ingen resultater fra FINN.no. FINN.no kan blokkere forespørselen. Sjekk terminalen for detaljer. Bruk "Manuell analyse"-fanen i mellomtiden.',
        listings: [],
      });
    }
    const analyzed = analyzeListings(listings);
    res.json({ source: 'finn', count: analyzed.length, listings: analyzed });
  } catch (err) {
    console.error('Scrape error:', err.message);
    console.error(err.stack);
    res.json({
      source: 'error',
      note: `Feil ved henting fra FINN.no: ${err.message}. Bruk "Manuell analyse"-fanen.`,
      listings: [],
    });
  }
});

app.get('/api/detail', async (req, res) => {
  const { url } = req.query;
  if (!url || !url.includes('finn.no')) {
    return res.status(400).json({ error: 'Ugyldig FINN.no URL' });
  }
  try {
    const detail = await scrapeListingDetail(url);
    res.json(detail);
  } catch (err) {
    res.json({ description: '', euDate: '' });
  }
});

app.post('/api/analyze', (req, res) => {
  try {
    const result = analyzeManualInput(req.body);
    res.json(result);
  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ error: 'Analysefeil' });
  }
});

app.listen(PORT, () => {
  console.log(`Car Deal Analyzer running at http://localhost:${PORT}`);
  console.log('');
  console.log('Tips:');
  console.log('  - If FINN.no blocks scraping, try visible browser mode:');
  console.log('    HEADLESS=false node server.js');
  console.log('  - The "Manuell analyse" tab always works regardless');
});
