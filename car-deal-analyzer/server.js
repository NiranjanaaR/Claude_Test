const express = require('express');
const path = require('path');
const { scrapeFinn } = require('./scraper');
const { analyzeListings } = require('./analyzer');
const { getMockListings } = require('./mock-data');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/search', async (req, res) => {
  const params = req.query;
  try {
    let listings = await scrapeFinn(params);
    if (!listings || listings.length === 0) {
      listings = getMockListings(params);
      const analyzed = analyzeListings(listings);
      return res.json({ source: 'mock', note: 'FINN.no var utilgjengelig — viser eksempeldata', listings: analyzed });
    }
    const analyzed = analyzeListings(listings);
    res.json({ source: 'finn', listings: analyzed });
  } catch (err) {
    console.error('Scrape error:', err.message);
    const listings = getMockListings(params);
    const analyzed = analyzeListings(listings);
    res.json({ source: 'mock', note: 'Kunne ikke nå FINN.no — viser eksempeldata', listings: analyzed });
  }
});

app.listen(PORT, () => {
  console.log(`Car Deal Analyzer running at http://localhost:${PORT}`);
});
