const express = require('express');
const path = require('path');
const fs = require('fs');
const { analyzeListings, analyzeManualInput } = require('./analyzer');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.get('/api/search', async (req, res) => {
  const params = req.query;
  console.log('Search request:', params);
  try {
    const { scrapeFinn } = require('./scraper');
    const listings = await scrapeFinn(params);
    console.log(`Scrape returned ${listings.length} listings`);
    if (!listings || listings.length === 0) {
      return res.json({
        source: 'none',
        note: 'Ingen resultater fra FINN.no. Bruk bookmarklet-metoden: gå til Oppsett-fanen for instruksjoner.',
        listings: [],
      });
    }
    const analyzed = analyzeListings(listings);
    res.json({ source: 'finn', count: analyzed.length, listings: analyzed });
  } catch (err) {
    console.error('Scrape error:', err.message);
    res.json({
      source: 'error',
      note: 'Kunne ikke scrape FINN.no. Bruk bookmarklet i stedet — se Oppsett-fanen.',
      listings: [],
    });
  }
});

app.post('/results', (req, res) => {
  try {
    const raw = req.body.listings;
    if (!raw) return res.status(400).send('Ingen data mottatt');

    const listings = JSON.parse(raw);
    console.log(`Bookmarklet sent ${listings.length} listings for analysis`);
    const analyzed = analyzeListings(listings);

    const template = fs.readFileSync(path.join(__dirname, 'public', 'results.html'), 'utf-8');
    const html = template.replace(
      'window.__BILDEAL_DATA__ || []',
      JSON.stringify(analyzed)
    );
    res.send(html);
  } catch (err) {
    console.error('Results error:', err.message);
    res.status(500).send('Analysefeil: ' + err.message);
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
  console.log(`\nBilDeal Car Analyzer running at http://localhost:${PORT}\n`);
  console.log('How to use:');
  console.log('  1. Open http://localhost:3000 in your browser');
  console.log('  2. Go to the "Oppsett" tab and drag the bookmarklet to your bookmarks bar');
  console.log('  3. Search for cars on FINN.no');
  console.log('  4. Click the bookmarklet — results open in a new tab!\n');
});
