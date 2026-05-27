const MARKET_REFERENCE = {
  'toyota': { base: 420000, retention: 0.91 },
  'volkswagen': { base: 400000, retention: 0.88 },
  'volvo': { base: 500000, retention: 0.89 },
  'bmw': { base: 550000, retention: 0.86 },
  'audi': { base: 520000, retention: 0.87 },
  'mercedes-benz': { base: 580000, retention: 0.87 },
  'ford': { base: 380000, retention: 0.85 },
  'nissan': { base: 360000, retention: 0.86 },
  'hyundai': { base: 370000, retention: 0.88 },
  'kia': { base: 380000, retention: 0.89 },
  'tesla': { base: 450000, retention: 0.88 },
  'peugeot': { base: 350000, retention: 0.83 },
  'skoda': { base: 380000, retention: 0.87 },
  'mazda': { base: 390000, retention: 0.87 },
  'honda': { base: 380000, retention: 0.89 },
  'subaru': { base: 420000, retention: 0.86 },
  'suzuki': { base: 300000, retention: 0.86 },
  'renault': { base: 350000, retention: 0.83 },
  'opel': { base: 350000, retention: 0.84 },
  'seat': { base: 350000, retention: 0.85 },
  'citroen': { base: 340000, retention: 0.82 },
  'mitsubishi': { base: 380000, retention: 0.85 },
};

const POSITIVE_CONTEXT = /nylig\s+(skiftet|byttet|reparert|ordnet|gjort)|nettopp\s+(skiftet|byttet)|ny(e|tt)?\s+(registerreim|bremseskiver|bremser|clutch|turbo|batteri|dekk)|skiftet\s+(nylig|nettopp)|alt\s+(er\s+)?fikset|reparert|ingen\s+(feil|problemer|rust)|uten\s+(rust|feil)/i;

const RISK_KEYWORDS = [
  { pattern: /selges\s+som\s+den\s+er/i, weight: 30, label: 'Selges som den er' },
  { pattern: /ikke\s+eu\s*-?\s*godkjent/i, weight: 35, label: 'Ikke EU-godkjent' },
  { pattern: /eu.{0,5}(utgått|utløpt|ikke\s+bestått)/i, weight: 30, label: 'EU utgått' },
  { pattern: /motorlys|motorlampe|varsellys/i, weight: 25, label: 'Motorlys' },
  { pattern: /røyklukt|røyk\s*lukt|sigarett/i, weight: 15, label: 'Røyklukt' },
  { pattern: /rust(skade|hull|ete)/i, weight: 20, label: 'Rust', contextSensitive: true },
  { pattern: /bulk(er|ete|skade)/i, weight: 10, label: 'Bulker' },
  { pattern: /lakk(skade|ering\s*behov)/i, weight: 10, label: 'Lakkskade' },
  { pattern: /olje(lekkasje|forbruk)/i, weight: 25, label: 'Oljeproblemer' },
  { pattern: /gir(kasse)?\s*(problem|feil|hakk|slur)/i, weight: 30, label: 'Girkasseproblemer' },
  { pattern: /brems(er?|e)\s*(slitt|bytte|dårlig)/i, weight: 15, label: 'Bremser slitt', contextSensitive: true },
  { pattern: /reparasjon\s*(nødvendig|trengs|behov)/i, weight: 20, label: 'Reparasjon nødvendig' },
  { pattern: /ikke\s*(startet|start|gått)/i, weight: 40, label: 'Starter ikke' },
  { pattern: /vrak|kondemnert|totalsk/i, weight: 50, label: 'Mulig vrak' },
  { pattern: /clutch\s*(slitt|bytte|problem)/i, weight: 20, label: 'Clutch-problem', contextSensitive: true },
  { pattern: /turbo\s*(feil|problem|ødelagt)/i, weight: 25, label: 'Turbo-problem', contextSensitive: true },
  { pattern: /registerreim|timing\s*belt/i, weight: 15, label: 'Registerreim', contextSensitive: true },
  { pattern: /feil\s*(kode|melding)/i, weight: 15, label: 'Feilkode' },
  { pattern: /AC\s*(virker\s*ikke|feil|problem)/i, weight: 10, label: 'AC-problem' },
  { pattern: /vannlekkasje|vann\s*inn/i, weight: 20, label: 'Vannlekkasje' },
];

const REPAIR_COST_RANGES = {
  'Selges som den er': [5000, 25000],
  'Ikke EU-godkjent': [8000, 35000],
  'EU utgått': [5000, 20000],
  'Motorlys': [3000, 40000],
  'Røyklukt': [2000, 8000],
  'Rust': [5000, 30000],
  'Bulker': [2000, 15000],
  'Lakkskade': [3000, 20000],
  'Oljeproblemer': [5000, 30000],
  'Girkasseproblemer': [15000, 60000],
  'Bremser slitt': [3000, 12000],
  'Reparasjon nødvendig': [5000, 30000],
  'Starter ikke': [5000, 50000],
  'Mulig vrak': [20000, 80000],
  'Clutch-problem': [8000, 25000],
  'Turbo-problem': [10000, 40000],
  'Registerreim': [5000, 15000],
  'Feilkode': [1000, 15000],
  'AC-problem': [3000, 15000],
  'Vannlekkasje': [3000, 20000],
};

function extractBrand(title) {
  const titleLower = title.toLowerCase();
  for (const brand of Object.keys(MARKET_REFERENCE)) {
    if (titleLower.includes(brand)) return brand;
  }
  const words = titleLower.split(/\s+/);
  if (words.length > 0) {
    for (const brand of Object.keys(MARKET_REFERENCE)) {
      if (brand.startsWith(words[0]) || words[0].startsWith(brand.split('-')[0])) return brand;
    }
  }
  return null;
}

function estimateMarketValue(listing) {
  const brand = extractBrand(listing.title);
  const ref = brand ? MARKET_REFERENCE[brand] : { base: 250000, retention: 0.82 };
  const currentYear = new Date().getFullYear();
  const age = listing.year ? currentYear - listing.year : 5;

  let value = ref.base;

  if (age <= 1) value *= 0.82;
  else if (age <= 3) value *= 0.82 * Math.pow(ref.retention, age - 1);
  else if (age <= 6) value *= 0.82 * Math.pow(ref.retention, 2) * Math.pow(0.93, age - 3);
  else value *= 0.82 * Math.pow(ref.retention, 2) * Math.pow(0.93, 3) * Math.pow(0.91, age - 6);

  const avgMileagePerYear = 15000;
  const expectedMileage = age * avgMileagePerYear;
  if (listing.mileage > 0) {
    const mileageDiff = listing.mileage - expectedMileage;
    const mileageAdjustment = 1 - (mileageDiff / expectedMileage) * 0.15;
    value *= Math.max(0.5, Math.min(1.3, mileageAdjustment));
  }

  if (/elektrisk|electric/i.test(listing.fuel)) value *= 1.05;
  else if (/diesel/i.test(listing.fuel)) value *= 0.92;

  if (/automat/i.test(listing.transmission)) value *= 1.05;

  return Math.round(Math.max(10000, value));
}

function getSurroundingContext(text, pattern, windowSize) {
  const match = text.match(pattern);
  if (!match) return '';
  const idx = match.index;
  const start = Math.max(0, idx - windowSize);
  const end = Math.min(text.length, idx + match[0].length + windowSize);
  return text.substring(start, end);
}

function detectRisks(description) {
  if (!description) return { score: 0, flags: [], estimatedRepairMin: 0, estimatedRepairMax: 0 };

  const flags = [];
  let score = 0;
  let repairMin = 0;
  let repairMax = 0;

  for (const kw of RISK_KEYWORDS) {
    if (kw.pattern.test(description)) {
      if (kw.contextSensitive) {
        const context = getSurroundingContext(description, kw.pattern, 60);
        if (POSITIVE_CONTEXT.test(context)) continue;
      }
      flags.push(kw.label);
      score += kw.weight;
      const costs = REPAIR_COST_RANGES[kw.label] || [2000, 15000];
      repairMin += costs[0];
      repairMax += costs[1];
    }
  }

  return {
    score: Math.min(100, score),
    flags,
    estimatedRepairMin: repairMin,
    estimatedRepairMax: repairMax,
  };
}

const { generateRecommendation, getBrandReliability, getModelIssues } = require('./car-knowledge');

function analyzeListing(listing) {
  const marketValue = estimateMarketValue(listing);
  const risk = detectRisks(listing.description || '');
  const brand = extractBrand(listing.title) || 'ukjent';
  const priceDiff = marketValue - listing.price;
  const priceDiffPercent = listing.price > 0 ? Math.round((priceDiff / listing.price) * 100) : 0;

  // Factor in model-specific known issues to repair cost
  const modelIssues = getModelIssues(brand, listing.title, listing.year);
  const modelRiskCost = modelIssues
    .filter(i => i.severity === 'high' || i.severity === 'medium')
    .reduce((sum, i) => sum + (i.repairCost[0] + i.repairCost[1]) / 2 * (i.severity === 'high' ? 0.4 : 0.15), 0);

  const avgRepairCost = Math.round((risk.estimatedRepairMin + risk.estimatedRepairMax) / 2 + modelRiskCost);
  const resaleValue = Math.round(marketValue * 0.95);
  const estimatedProfit = resaleValue - listing.price - avgRepairCost;

  let profitMin = resaleValue - listing.price - risk.estimatedRepairMax - Math.round(modelRiskCost * 1.5);
  let profitMax = resaleValue - listing.price - risk.estimatedRepairMin;
  if (risk.flags.length === 0 && modelIssues.filter(i => i.severity === 'high').length === 0) {
    profitMin = resaleValue - listing.price - 3000;
    profitMax = resaleValue - listing.price;
  }

  const reliability = getBrandReliability(brand);

  let ranking;
  if (risk.score >= 40 || estimatedProfit < -10000) {
    ranking = 'avoid';
  } else if (risk.score >= 20 || estimatedProfit < 5000) {
    ranking = 'risky';
  } else {
    ranking = 'good';
  }

  if (priceDiffPercent > 25 && risk.score < 20) ranking = 'good';
  if (risk.score >= 50) ranking = 'avoid';
  // Downgrade if brand is unreliable and has known high-severity issues
  if (reliability.tier === 'D' && ranking === 'good') ranking = 'risky';
  if (modelIssues.filter(i => i.severity === 'high').length >= 2 && ranking === 'good') ranking = 'risky';

  const result = {
    ...listing,
    brand,
    marketValue,
    priceDiff,
    priceDiffPercent,
    risk,
    resaleValue,
    estimatedRepairCost: avgRepairCost,
    estimatedProfit,
    profitRange: { min: profitMin, max: profitMax },
    ranking,
    reliability: { score: reliability.score, tier: reliability.tier },
  };

  const reco = generateRecommendation(result);
  result.recommendation = reco.recommendation;
  result.modelIssues = reco.modelIssues.map(i => ({ issue: i.issue, severity: i.severity }));

  return result;
}

function analyzeListings(listings) {
  return listings.map(analyzeListing).sort((a, b) => {
    const rankOrder = { good: 0, risky: 1, avoid: 2 };
    if (rankOrder[a.ranking] !== rankOrder[b.ranking]) {
      return rankOrder[a.ranking] - rankOrder[b.ranking];
    }
    return b.estimatedProfit - a.estimatedProfit;
  });
}

function analyzeManualInput(input) {
  const listing = {
    id: 'manual-' + Date.now(),
    title: input.title || `${input.brand || ''} ${input.model || ''}`.trim() || 'Ukjent bil',
    price: parseInt(input.price) || 0,
    year: parseInt(input.year) || 0,
    mileage: parseInt(input.mileage) || 0,
    fuel: input.fuel || '',
    transmission: input.transmission || '',
    description: input.description || '',
    location: input.location || '',
    link: input.link || '',
    image: '',
    source: 'manual',
  };
  return analyzeListing(listing);
}

module.exports = { analyzeListings, analyzeManualInput, estimateMarketValue, detectRisks };
