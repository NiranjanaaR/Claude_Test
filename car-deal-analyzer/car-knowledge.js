// Expert knowledge base for Norwegian used car market
// Reliability, known issues, and model-specific advice

const BRAND_RELIABILITY = {
  'toyota':        { score: 95, tier: 'A', note: 'Svært pålitelig. Lave vedlikeholdskostnader. Holder verdien godt.' },
  'honda':         { score: 90, tier: 'A', note: 'Veldig pålitelig. Gode motorer. Rimelige deler.' },
  'mazda':         { score: 88, tier: 'A', note: 'Pålitelig og morsom å kjøre. Bra rustbeskyttelse fra ~2015.' },
  'kia':           { score: 87, tier: 'A', note: 'God garanti (7 år). Moderne og pålitelig. Stigende popularitet.' },
  'hyundai':       { score: 86, tier: 'A', note: 'Søstermerk til Kia. God garanti. Bra verdi for pengene.' },
  'suzuki':        { score: 85, tier: 'A', note: 'Enkle, pålitelige biler. Lave driftskostnader.' },
  'subaru':        { score: 83, tier: 'B', note: 'Robust firehjulsdrift. Kan ha toppakning-problemer på boxer-motorer.' },
  'volvo':         { score: 82, tier: 'B', note: 'Trygg og solid. Kan være dyr å reparere. Elektronikk-feil etter 2015.' },
  'skoda':         { score: 82, tier: 'B', note: 'VW-teknikk til lavere pris. God plass. Pålitelig.' },
  'volkswagen':    { score: 78, tier: 'B', note: 'Populær men kan ha DSG-girkasse og turbo-problemer. Dyre deler.' },
  'ford':          { score: 76, tier: 'B', note: 'OK pålitelighet. PowerShift-girkasse (tørrclutch DCT) bør unngås.' },
  'tesla':         { score: 75, tier: 'B', note: 'Lave driftskostnader. Byggekvalitet varierer. Panel-gap og lakkproblemer.' },
  'seat':          { score: 75, tier: 'B', note: 'VW-plattform. Sporty, rimelig. Samme problemer som VW.' },
  'nissan':        { score: 74, tier: 'C', note: 'CVT-girkasse kan være problematisk. Leaf-batteri taper seg.' },
  'mitsubishi':    { score: 73, tier: 'C', note: 'Enkel teknikk. Outlander PHEV er populær. Rust kan forekomme.' },
  'bmw':           { score: 70, tier: 'C', note: 'Dyre å vedlikeholde. Kjøreglede. Oljelekkasjer og elektronikkfeil vanlig.' },
  'audi':          { score: 70, tier: 'C', note: 'Premium men kostbare reparasjoner. Oljeforbuk og DSG-problemer.' },
  'mercedes-benz': { score: 68, tier: 'C', note: 'Premium. Elektronikk-intensive. Svært dyre verkstedreparasjoner.' },
  'peugeot':       { score: 62, tier: 'D', note: 'Kjent for elektronikkproblemer. Billige å kjøpe, dyre å eie.' },
  'citroen':       { score: 60, tier: 'D', note: 'Komfortable men upålitelige. Elektronikk og hydraulikk-problemer.' },
  'renault':       { score: 60, tier: 'D', note: 'Billig i innkjøp. Elektronikkfeil. Turbo-problemer på dCi-motorer.' },
  'opel':          { score: 65, tier: 'C', note: 'Variabel kvalitet. Eldre modeller kan ha rust. Rimelige deler.' },
};

const MODEL_KNOWN_ISSUES = [
  { brand: 'volkswagen', models: ['golf', 'passat', 'tiguan'], engines: ['1.4 tsi', 'tsi'], yearRange: [2007, 2014],
    issue: 'TSI-motor: Kjent for timing-kjede strekk og oljeforbuk', severity: 'high', repairCost: [15000, 35000] },
  { brand: 'volkswagen', models: ['golf', 'passat', 'touran', 'caddy'], engines: ['1.6 tdi', '2.0 tdi', 'tdi'], yearRange: [2008, 2015],
    issue: 'TDI dieselgate-motor. Sjekk om software-oppdatering er gjort. Kan ha EGR/DPF-problemer', severity: 'medium', repairCost: [8000, 25000] },
  { brand: 'volkswagen', models: ['golf', 'passat', 'tiguan', 'touran'], engines: ['dsg', 'dct'], yearRange: [2003, 2015],
    issue: 'DSG tørr-clutch (7-trinns) girkasse kan rykke og slippe. Dyr å reparere.', severity: 'high', repairCost: [20000, 50000] },
  { brand: 'bmw', models: ['320d', '120d', '520d', 'x1', 'x3'], engines: ['n47', '2.0d'], yearRange: [2007, 2014],
    issue: 'N47 dieselmotor: Timing-kjede bak i motoren. Kjent svakhet, dyr reparasjon.', severity: 'high', repairCost: [25000, 60000] },
  { brand: 'bmw', models: ['320i', '328i', '528i'], engines: ['n20', 'n26'], yearRange: [2011, 2016],
    issue: 'N20 motor: Timing-kjede kan strekke seg. Oljelekkasje fra ventildeksel.', severity: 'medium', repairCost: [15000, 40000] },
  { brand: 'ford', models: ['focus', 'fiesta', 'b-max', 'ecosport'], engines: ['powershift', 'dct'], yearRange: [2011, 2019],
    issue: 'PowerShift DCT tørrclutch: Rykkete giring, clutch-slitasje. Mange tilbakekallinger.', severity: 'high', repairCost: [20000, 45000] },
  { brand: 'ford', models: ['focus', 'mondeo', 'kuga', 's-max'], engines: ['1.0 ecoboost'], yearRange: [2012, 2020],
    issue: 'EcoBoost 1.0: Kjølevæske-lekkasje og degas-hose kan forårsake overoppheting.', severity: 'medium', repairCost: [5000, 20000] },
  { brand: 'nissan', models: ['qashqai', 'juke', 'x-trail'], engines: ['1.2 dig-t', '1.6 dig-t'], yearRange: [2014, 2019],
    issue: 'DIG-T turbo-motor: Kjent for timing-kjede strekk ved lav km.', severity: 'medium', repairCost: [12000, 30000] },
  { brand: 'nissan', models: ['leaf'], engines: [], yearRange: [2011, 2017],
    issue: 'Tidlige Leaf: Batteridegrading kan være betydelig. Sjekk SOH (State of Health).', severity: 'medium', repairCost: [30000, 80000] },
  { brand: 'volvo', models: ['v40', 'v60', 's60', 'xc60', 'xc90'], engines: ['d4', 'd5', '2.0d'], yearRange: [2014, 2019],
    issue: 'D4/D5 motor: Kjent for injektor-problemer og DPF-feil. Dyrt å fikse.', severity: 'medium', repairCost: [10000, 35000] },
  { brand: 'audi', models: ['a4', 'a5', 'a6', 'q5'], engines: ['2.0 tfsi', 'tfsi'], yearRange: [2008, 2013],
    issue: '2.0 TFSI: Høyt oljeforbruk pga stempelringer. Kan trenge motoroverhalning.', severity: 'high', repairCost: [20000, 50000] },
  { brand: 'peugeot', models: ['308', '3008', '5008', '208'], engines: ['1.2 puretech'], yearRange: [2013, 2020],
    issue: 'PureTech 1.2: Timing-belte kan gi seg for tidlig. Oljeforbuk.', severity: 'high', repairCost: [10000, 30000] },
  { brand: 'renault', models: ['kadjar', 'megane', 'scenic', 'captur'], engines: ['1.2 tce', '1.3 tce'], yearRange: [2015, 2021],
    issue: 'TCe turbo: Oljeforbuk, varmeveksler-lekkasje. Dyre reparasjoner.', severity: 'medium', repairCost: [8000, 25000] },
  { brand: 'mercedes-benz', models: ['a-klasse', 'b-klasse', 'cla'], engines: ['dct', '7g-dct'], yearRange: [2013, 2019],
    issue: '7G-DCT girkasse: Vibrasjoner og rykkete giring. Dyr å skifte.', severity: 'medium', repairCost: [15000, 40000] },
  { brand: 'tesla', models: ['model 3', 'model y'], engines: [], yearRange: [2017, 2021],
    issue: 'Tidlig produksjon: Panelgap, lakkproblemer, vindstøy. Sjekk byggekvalitet.', severity: 'low', repairCost: [5000, 20000] },
  { brand: 'toyota', models: ['auris', 'corolla', 'avensis'], engines: ['1.6', '1.8'], yearRange: [2007, 2018],
    issue: 'Generelt svært pålitelig. Minimal risiko. Kan ha litt rust i hjulbuer.', severity: 'info', repairCost: [0, 5000] },
  { brand: 'hyundai', models: ['tucson', 'santa fe', 'kona'], engines: ['theta ii', '2.0', '2.4'], yearRange: [2011, 2019],
    issue: 'Theta II motor (noen markeder): Motorhavari-risiko. Sjekk om tilbakekalling er utført.', severity: 'medium', repairCost: [15000, 60000] },
];

const MILEAGE_WARNINGS = [
  { threshold: 300000, message: 'Svært høy kilometerstand. Forvent slitasje på de fleste komponenter.' },
  { threshold: 200000, message: 'Høy kilometerstand. Registerreim, clutch og fjæring bør være sjekket/skiftet.' },
  { threshold: 150000, message: 'Moderat kilometerstand. Service-historikk er viktig å verifisere.' },
];

const AGE_WARNINGS = [
  { threshold: 15, message: 'Gammel bil. Rust, slanger, pakninger og gummideler kan være slitt.' },
  { threshold: 10, message: 'Begynnende alder. Sjekk understellet for rust og slitasje.' },
];

function getModelIssues(brand, title, year) {
  if (!brand) return [];
  const titleLower = (title || '').toLowerCase();
  const brandLower = brand.toLowerCase();

  return MODEL_KNOWN_ISSUES.filter(issue => {
    if (issue.brand !== brandLower) return false;
    if (year && (year < issue.yearRange[0] || year > issue.yearRange[1])) return false;
    const modelMatch = issue.models.length === 0 || issue.models.some(m => titleLower.includes(m));
    if (!modelMatch) return false;
    // Model match is sufficient; engine is a bonus signal but not required
    return true;
  });
}

function getBrandReliability(brand) {
  if (!brand) return { score: 70, tier: 'C', note: 'Ukjent merke — ingen pålitelighetsdata tilgjengelig.' };
  return BRAND_RELIABILITY[brand.toLowerCase()] || { score: 70, tier: 'C', note: 'Ukjent merke.' };
}

function generateRecommendation(listing) {
  const { brand, title, price, year, mileage, ranking, estimatedProfit, risk, marketValue } = listing;
  const reliability = getBrandReliability(brand);
  const issues = getModelIssues(brand, title, year);
  const currentYear = new Date().getFullYear();
  const age = year ? currentYear - year : 0;
  const parts = [];

  // Price assessment
  if (price < marketValue * 0.7) {
    parts.push('Prisen er betydelig under markedsverdi — sjekk hvorfor selger priser så lavt.');
  } else if (price < marketValue * 0.85) {
    parts.push('Godt priset under markedsverdi.');
  } else if (price > marketValue * 1.1) {
    parts.push('Overpriset i forhold til markedet.');
  }

  // Reliability
  if (reliability.tier === 'A') {
    parts.push(reliability.note);
  } else if (reliability.tier === 'D') {
    parts.push('OBS: ' + reliability.note);
  }

  // Model-specific issues
  for (const issue of issues) {
    if (issue.severity === 'high') {
      parts.push('ADVARSEL: ' + issue.issue);
    } else if (issue.severity === 'medium') {
      parts.push('Merk: ' + issue.issue);
    } else if (issue.severity === 'info') {
      parts.push(issue.issue);
    }
  }

  // Mileage warnings
  if (mileage > 0) {
    for (const mw of MILEAGE_WARNINGS) {
      if (mileage >= mw.threshold) {
        parts.push(mw.message);
        break;
      }
    }
  }

  // Age warnings
  if (age > 0) {
    for (const aw of AGE_WARNINGS) {
      if (age >= aw.threshold) {
        parts.push(aw.message);
        break;
      }
    }
  }

  // Diesel advice
  if (/diesel/i.test(listing.fuel) && age > 8) {
    parts.push('Eldre diesel: DPF, EGR og turbo kan gi dyre reparasjoner. Passer best for langkjøring.');
  }

  // Final verdict
  if (ranking === 'good' && reliability.tier <= 'B' && issues.filter(i => i.severity === 'high').length === 0) {
    parts.push('Samlet vurdering: Lovende kjøp. Verifiser service-historikk og ta en grundig prøvekjøring.');
  } else if (ranking === 'good' && issues.filter(i => i.severity === 'high').length > 0) {
    parts.push('Samlet vurdering: Kan være et godt kjøp, men modellen har kjente svakheter. Inspiser nøye.');
  } else if (ranking === 'avoid') {
    parts.push('Samlet vurdering: Høy risiko. Kun aktuelt om du har billig tilgang til verksted.');
  }

  return {
    recommendation: parts.join(' '),
    reliability,
    modelIssues: issues,
  };
}

module.exports = { generateRecommendation, getBrandReliability, getModelIssues, BRAND_RELIABILITY, MODEL_KNOWN_ISSUES };
