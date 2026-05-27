const MARKET_REFERENCE = {
  'toyota':        { base: 420000, retention: 0.91 },
  'volkswagen':    { base: 400000, retention: 0.88 },
  'volvo':         { base: 500000, retention: 0.89 },
  'bmw':           { base: 550000, retention: 0.86 },
  'audi':          { base: 520000, retention: 0.87 },
  'mercedes-benz': { base: 580000, retention: 0.87 },
  'ford':          { base: 380000, retention: 0.85 },
  'nissan':        { base: 360000, retention: 0.86 },
  'hyundai':       { base: 370000, retention: 0.88 },
  'kia':           { base: 380000, retention: 0.89 },
  'tesla':         { base: 450000, retention: 0.88 },
  'peugeot':       { base: 350000, retention: 0.83 },
  'skoda':         { base: 380000, retention: 0.87 },
  'mazda':         { base: 390000, retention: 0.87 },
  'honda':         { base: 380000, retention: 0.89 },
  'subaru':        { base: 420000, retention: 0.86 },
  'suzuki':        { base: 300000, retention: 0.86 },
  'renault':       { base: 350000, retention: 0.83 },
  'opel':          { base: 350000, retention: 0.84 },
  'seat':          { base: 350000, retention: 0.85 },
  'citroen':       { base: 340000, retention: 0.82 },
  'mitsubishi':    { base: 380000, retention: 0.85 },
};

// Negative signals — things that lower the deal score
const NEGATIVE_SIGNALS = [
  { pattern: /selges\s+som\s+den\s+er/i, weight: -1.5, label: 'Selges som den er', repairCost: [5000, 25000] },
  { pattern: /ikke\s+eu\s*-?\s*godkjent/i, weight: -2.0, label: 'Ikke EU-godkjent', repairCost: [8000, 35000] },
  { pattern: /eu.{0,5}(utgått|utløpt|ikke\s+bestått)/i, weight: -1.5, label: 'EU utgått', repairCost: [5000, 20000] },
  { pattern: /motorlys|motorlampe|varsellys/i, weight: -1.5, label: 'Motorlys på', repairCost: [3000, 40000] },
  { pattern: /røyklukt|røyk\s*lukt|sigarett/i, weight: -0.5, label: 'Røyklukt', repairCost: [2000, 8000] },
  { pattern: /rust(skade|hull|ete)/i, weight: -1.0, label: 'Rustskade', repairCost: [5000, 30000], contextSensitive: true },
  { pattern: /bulk(er|ete|skade)/i, weight: -0.5, label: 'Bulker/skade', repairCost: [2000, 15000] },
  { pattern: /lakk(skade|ering\s*behov)/i, weight: -0.5, label: 'Lakkskade', repairCost: [3000, 20000] },
  { pattern: /olje(lekkasje|forbruk)/i, weight: -1.5, label: 'Oljeproblemer', repairCost: [5000, 30000] },
  { pattern: /gir(kasse)?\s*(problem|feil|hakk|slur)/i, weight: -2.0, label: 'Girkasseproblemer', repairCost: [15000, 60000] },
  { pattern: /brems(er?|e)\s*(slitt|bytte|dårlig)/i, weight: -0.8, label: 'Bremser slitt', repairCost: [3000, 12000], contextSensitive: true },
  { pattern: /reparasjon\s*(nødvendig|trengs|behov)/i, weight: -1.0, label: 'Trenger reparasjon', repairCost: [5000, 30000] },
  { pattern: /ikke\s*(startet|start|gått)/i, weight: -3.0, label: 'Starter ikke', repairCost: [5000, 50000] },
  { pattern: /vrak|kondemnert|totalsk/i, weight: -4.0, label: 'Mulig vrak', repairCost: [20000, 80000] },
  { pattern: /clutch\s*(slitt|bytte|problem)/i, weight: -1.0, label: 'Clutch-problem', repairCost: [8000, 25000], contextSensitive: true },
  { pattern: /turbo\s*(feil|problem|ødelagt)/i, weight: -1.5, label: 'Turbo-problem', repairCost: [10000, 40000], contextSensitive: true },
  { pattern: /feil\s*(kode|melding)/i, weight: -0.8, label: 'Feilkoder', repairCost: [1000, 15000] },
  { pattern: /AC\s*(virker\s*ikke|feil|problem)/i, weight: -0.5, label: 'AC virker ikke', repairCost: [3000, 15000] },
  { pattern: /vannlekkasje|vann\s*inn/i, weight: -1.0, label: 'Vannlekkasje', repairCost: [3000, 20000] },
  { pattern: /må\s+(repareres|fikses|ordnes)/i, weight: -1.0, label: 'Må repareres', repairCost: [5000, 25000] },
  { pattern: /høyt?\s+forbruk/i, weight: -0.3, label: 'Høyt forbruk', repairCost: [0, 0] },
  { pattern: /kollisjon|krasj|påkjør/i, weight: -2.0, label: 'Kollisjonsskade', repairCost: [10000, 60000] },
  { pattern: /skifte(s|r)?\s*(snart|bør)/i, weight: -0.5, label: 'Deler bør skiftes', repairCost: [3000, 15000] },
];

// Positive signals — things that raise the deal score
const POSITIVE_SIGNALS = [
  { pattern: /full\s*(service|service-?historikk|historikk)/i, weight: +1.0, label: 'Full servicehistorikk' },
  { pattern: /eu\s*(godkjent|kontroll).{0,15}(2026|2027|2028)/i, weight: +1.0, label: 'Nylig EU-godkjent' },
  { pattern: /én\s*eier|1\.?\s*eier|første\s*eier/i, weight: +0.8, label: 'Én eier' },
  { pattern: /garasje/i, weight: +0.3, label: 'Garasjelagret' },
  { pattern: /velholdt|vel\s*vedlikeholdt|godt\s*(vedlikeholdt|stell)/i, weight: +0.8, label: 'Velholdt' },
  { pattern: /ny(e|tt)?\s*(dekk|bremser|bremseskiver|batteri|registerreim|clutch|eksosanlegg)/i, weight: +0.5, label: 'Nye deler montert' },
  { pattern: /nylig\s+(skiftet|byttet|reparert|servet)/i, weight: +0.5, label: 'Nylig vedlikeholdt' },
  { pattern: /service\s*(bok|hefte)\s*(følger|medfølger|komplett)/i, weight: +0.8, label: 'Servicebok følger' },
  { pattern: /ingen\s*(feil|rust|problemer|merknader)/i, weight: +0.5, label: 'Ingen feil/problemer' },
  { pattern: /alt\s*(fungerer|virker|er\s*i\s*orden)/i, weight: +0.5, label: 'Alt fungerer' },
  { pattern: /lav(t)?\s*(km|kilometerstand|kjørelengde)/i, weight: +0.5, label: 'Lav kilometerstand' },
  { pattern: /ny\s*(eu|lakk|lakkering)/i, weight: +0.5, label: 'Ny EU/lakk' },
  { pattern: /selges\s*(pga|fordi|grunnet)\s*(ny\s*bil|oppgradering|flytt)/i, weight: +0.3, label: 'Selger kjøper ny bil' },
  { pattern: /rustfri|uten\s*rust|null\s*rust/i, weight: +0.8, label: 'Rustfri' },
  { pattern: /original|km-?stand\s*(stemmer|verifisert)/i, weight: +0.3, label: 'Original/verifisert stand' },
  { pattern: /DAB\+|ryggekamera|navi|cruise|automat|skinn/i, weight: +0.2, label: 'Godt utstyrt' },
];

const POSITIVE_CONTEXT = /nylig\s+(skiftet|byttet|reparert|ordnet|gjort)|nettopp\s+(skiftet|byttet)|ny(e|tt)?\s+(registerreim|bremseskiver|bremser|clutch|turbo|batteri|dekk)|skiftet\s+(nylig|nettopp)|alt\s+(er\s+)?fikset|reparert|ingen\s+(feil|problemer|rust)|uten\s+(rust|feil)/i;

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
  const ref = brand ? MARKET_REFERENCE[brand] : { base: 350000, retention: 0.85 };
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

function analyzeDescription(description) {
  const result = {
    negativeFlags: [],
    positiveFlags: [],
    descriptionScore: 0, // -5 to +5 range, 0 = neutral
    repairCostMin: 0,
    repairCostMax: 0,
    summary: '',
  };

  if (!description) {
    result.summary = 'Ingen beskrivelse tilgjengelig — kan ikke vurdere tilstand fra tekst.';
    return result;
  }

  let score = 0;

  // Check negative signals
  for (const sig of NEGATIVE_SIGNALS) {
    if (sig.pattern.test(description)) {
      if (sig.contextSensitive) {
        const context = getSurroundingContext(description, sig.pattern, 60);
        if (POSITIVE_CONTEXT.test(context)) continue;
      }
      result.negativeFlags.push(sig.label);
      score += sig.weight;
      result.repairCostMin += sig.repairCost[0];
      result.repairCostMax += sig.repairCost[1];
    }
  }

  // Check positive signals
  for (const sig of POSITIVE_SIGNALS) {
    if (sig.pattern.test(description)) {
      result.positiveFlags.push(sig.label);
      score += sig.weight;
    }
  }

  result.descriptionScore = Math.max(-5, Math.min(5, score));

  // Generate summary
  const parts = [];
  if (result.positiveFlags.length > 0 && result.negativeFlags.length === 0) {
    parts.push('Beskrivelsen gir et godt inntrykk.');
  } else if (result.negativeFlags.length > 0 && result.positiveFlags.length === 0) {
    parts.push('Beskrivelsen avslører flere bekymringer.');
  } else if (result.negativeFlags.length > 0 && result.positiveFlags.length > 0) {
    parts.push('Blandede signaler i beskrivelsen.');
  }

  if (result.positiveFlags.length > 0) {
    parts.push('Positivt: ' + result.positiveFlags.join(', ') + '.');
  }
  if (result.negativeFlags.length > 0) {
    parts.push('Negativt: ' + result.negativeFlags.join(', ') + '.');
  }
  if (!description || description.length < 20) {
    parts.push('Veldig kort beskrivelse — selger gir lite info, vær forsiktig.');
  }

  result.summary = parts.join(' ');
  return result;
}

function calculateDealScore(listing, marketValue, descAnalysis) {
  // Deal score from 1-10
  // Factors: price vs market, description signals, mileage, age
  let score = 5.0; // Start neutral

  // Price factor (biggest weight): how much below market value?
  const priceDiffPercent = (marketValue - listing.price) / marketValue;
  if (priceDiffPercent > 0.30) score += 2.5;
  else if (priceDiffPercent > 0.20) score += 2.0;
  else if (priceDiffPercent > 0.10) score += 1.5;
  else if (priceDiffPercent > 0.0) score += 0.5;
  else if (priceDiffPercent > -0.10) score -= 0.5;
  else if (priceDiffPercent > -0.20) score -= 1.5;
  else score -= 2.5;

  // Description factor
  score += descAnalysis.descriptionScore;

  // Mileage factor
  if (listing.mileage > 0) {
    const currentYear = new Date().getFullYear();
    const age = listing.year ? currentYear - listing.year : 5;
    const avgKmPerYear = listing.mileage / Math.max(1, age);
    if (avgKmPerYear < 10000) score += 0.3;
    else if (avgKmPerYear > 25000) score -= 0.5;
    if (listing.mileage > 250000) score -= 0.5;
  }

  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

function analyzeListing(listing) {
  const brand = extractBrand(listing.title) || 'ukjent';
  const marketValue = estimateMarketValue(listing);
  const descAnalysis = analyzeDescription(listing.description || '');
  const dealScore = calculateDealScore(listing, marketValue, descAnalysis);

  const priceDiff = marketValue - listing.price;
  const priceDiffPercent = listing.price > 0 ? Math.round((priceDiff / listing.price) * 100) : 0;

  const avgRepairCost = Math.round((descAnalysis.repairCostMin + descAnalysis.repairCostMax) / 2);
  const resaleValue = Math.round(marketValue * 0.95);
  const estimatedProfit = resaleValue - listing.price - avgRepairCost;

  let profitMin = resaleValue - listing.price - descAnalysis.repairCostMax;
  let profitMax = resaleValue - listing.price - descAnalysis.repairCostMin;
  if (descAnalysis.negativeFlags.length === 0) {
    profitMin = resaleValue - listing.price - 3000;
    profitMax = resaleValue - listing.price;
  }

  // Ranking based on deal score
  let ranking;
  if (dealScore >= 6.5) ranking = 'good';
  else if (dealScore >= 4.0) ranking = 'risky';
  else ranking = 'avoid';

  return {
    ...listing,
    brand,
    marketValue,
    priceDiff,
    priceDiffPercent,
    dealScore,
    descriptionAnalysis: {
      positiveFlags: descAnalysis.positiveFlags,
      negativeFlags: descAnalysis.negativeFlags,
      summary: descAnalysis.summary,
    },
    resaleValue,
    estimatedRepairCost: avgRepairCost,
    estimatedProfit,
    profitRange: { min: profitMin, max: profitMax },
    ranking,
  };
}

function analyzeListings(listings) {
  return listings.map(analyzeListing).sort((a, b) => {
    if (a.dealScore !== b.dealScore) return b.dealScore - a.dealScore;
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

module.exports = { analyzeListings, analyzeManualInput, estimateMarketValue, analyzeDescription };
