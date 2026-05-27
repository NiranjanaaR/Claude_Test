document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const searchForm = document.getElementById('search-form');
  const manualForm = document.getElementById('manual-form');
  const resultsEl = document.getElementById('results');
  const summaryEl = document.getElementById('summary');
  const statusBar = document.getElementById('status-bar');
  const resultFilters = document.getElementById('result-filters');
  const filterRanking = document.getElementById('filter-ranking');
  const filterMinProfit = document.getElementById('filter-min-profit');
  const filterMaxRisk = document.getElementById('filter-max-risk');

  let allListings = [];

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`${tab.dataset.tab}-panel`).classList.add('active');
    });
  });

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const params = new URLSearchParams();
    for (const [key, value] of formData) {
      if (value) params.set(key, value);
    }

    showStatus('loading', '<span class="spinner"></span> Åpner FINN.no i bakgrunnen og henter annonser... (kan ta 15-30 sek første gang)');
    resultsEl.innerHTML = '';
    summaryEl.classList.add('hidden');
    resultFilters.classList.add('hidden');

    try {
      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.note) {
        showStatus('info', data.note);
      } else if (data.listings.length > 0) {
        showStatus('success', `Fant ${data.listings.length} annonser fra FINN.no — analysert og rangert!`);
      }

      if (data.listings.length === 0 && !data.note) {
        showStatus('info', 'Ingen resultater funnet. Prøv bredere søkefiltre.');
      }

      allListings = data.listings;
      renderResults(allListings);
    } catch (err) {
      showStatus('error', 'Noe gikk galt. Sjekk at serveren kjører og prøv igjen.');
    }
  });

  manualForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(manualForm);
    const body = {};
    for (const [key, value] of formData) {
      body[key] = value;
    }

    if (!body.price) {
      showStatus('error', 'Pris er påkrevd for analyse.');
      return;
    }

    showStatus('loading', '<span class="spinner"></span> Analyserer bil...');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (result.error) {
        showStatus('error', result.error);
        return;
      }

      showStatus('success', 'Analyse fullført!');
      allListings = [result];
      renderResults(allListings);
    } catch (err) {
      showStatus('error', 'Analysefeil. Sjekk at serveren kjører.');
    }
  });

  [filterRanking, filterMinProfit, filterMaxRisk].forEach(el => {
    el.addEventListener('input', () => applyResultFilters());
  });

  function applyResultFilters() {
    const ranking = filterRanking.value;
    const minProfit = parseInt(filterMinProfit.value) || -Infinity;
    const maxRisk = parseInt(filterMaxRisk.value);

    const filtered = allListings.filter(l => {
      if (ranking && l.ranking !== ranking) return false;
      if (l.estimatedProfit < minProfit) return false;
      if (!isNaN(maxRisk) && l.risk.score > maxRisk) return false;
      return true;
    });

    renderCards(filtered);
    updateSummary(filtered);
  }

  function renderResults(listings) {
    if (listings.length > 1) {
      resultFilters.classList.remove('hidden');
    }
    updateSummary(listings);
    summaryEl.classList.remove('hidden');
    renderCards(listings);
  }

  function updateSummary(listings) {
    document.getElementById('count-good').textContent = listings.filter(l => l.ranking === 'good').length;
    document.getElementById('count-risky').textContent = listings.filter(l => l.ranking === 'risky').length;
    document.getElementById('count-avoid').textContent = listings.filter(l => l.ranking === 'avoid').length;
    document.getElementById('count-total').textContent = listings.length;
  }

  function renderCards(listings) {
    if (listings.length === 0) {
      resultsEl.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1">
          <h3>Ingen resultater</h3>
          <p>Prøv å justere filtrene eller søk på nytt.</p>
        </div>`;
      return;
    }

    resultsEl.innerHTML = listings.map(l => buildCard(l)).join('');
  }

  function buildCard(l) {
    const rankingLabels = { good: 'Godt Kjøp', risky: 'Risikabelt', avoid: 'Unngå' };
    const rankingLabel = rankingLabels[l.ranking] || l.ranking;

    const specs = [];
    if (l.year) specs.push(`${l.year}`);
    if (l.mileage) specs.push(`${formatNum(l.mileage)} km`);
    if (l.fuel) specs.push(l.fuel);
    if (l.transmission) specs.push(l.transmission);

    const riskLevel = l.risk.score < 20 ? 'low' : l.risk.score < 40 ? 'medium' : 'high';
    const profitClass = l.estimatedProfit >= 0 ? 'profit' : 'loss';

    const riskFlagsHtml = l.risk.flags.length > 0
      ? `<div class="risk-flags">${l.risk.flags.map(f => `<span class="risk-flag">${f}</span>`).join('')}</div>`
      : '<div style="font-size:0.8rem;color:var(--good)">Ingen risikofaktorer funnet</div>';

    const repairHtml = l.risk.estimatedRepairMin > 0
      ? `<div class="repair-estimate">Estimert reparasjon: <strong>${formatKr(l.risk.estimatedRepairMin)} – ${formatKr(l.risk.estimatedRepairMax)}</strong></div>`
      : '';

    const linkHtml = l.link
      ? `<a href="${escapeHtml(l.link)}" target="_blank" rel="noopener">Se på FINN.no &rarr;</a>`
      : '<span style="color:var(--text-light);font-size:0.8rem">Manuell analyse</span>';

    return `
      <div class="car-card ranking-${l.ranking}">
        <div class="card-header">
          <div class="card-title">${escapeHtml(l.title)}</div>
          <span class="badge badge-${l.ranking}">${rankingLabel}</span>
        </div>
        <div class="card-body">
          <div class="card-specs">
            ${specs.map(s => `<span class="spec-tag">${escapeHtml(s)}</span>`).join('')}
          </div>
          <div class="price-grid">
            <div class="price-item asking">
              <div class="price-label">Prisantydning</div>
              <div class="price-value">${formatKr(l.price)}</div>
            </div>
            <div class="price-item market">
              <div class="price-label">Markedsverdi</div>
              <div class="price-value">${formatKr(l.marketValue)}</div>
            </div>
            <div class="price-item ${profitClass}">
              <div class="price-label">Est. fortjeneste</div>
              <div class="price-value">${l.estimatedProfit >= 0 ? '+' : ''}${formatKr(l.estimatedProfit)}</div>
            </div>
            <div class="price-item">
              <div class="price-label">Fortjeneste-spenn</div>
              <div class="price-value" style="font-size:0.85rem">${formatKr(l.profitRange.min)} til ${formatKr(l.profitRange.max)}</div>
            </div>
          </div>
          <div class="risk-section">
            <div class="price-label" style="margin-bottom:0.3rem">Risikoscore: ${l.risk.score}/100</div>
            <div class="risk-bar-container">
              <div class="risk-bar ${riskLevel}" style="width:${Math.max(2, l.risk.score)}%"></div>
            </div>
            ${riskFlagsHtml}
          </div>
          ${repairHtml}
        </div>
        <div class="card-footer">
          ${linkHtml}
          ${l.location ? `<span class="location">${escapeHtml(l.location)}</span>` : ''}
        </div>
      </div>`;
  }

  function showStatus(type, message) {
    statusBar.className = `status-bar ${type}`;
    statusBar.innerHTML = message;
    statusBar.classList.remove('hidden');
  }

  function formatKr(num) {
    if (num === undefined || num === null) return 'N/A';
    return num.toLocaleString('nb-NO') + ' kr';
  }

  function formatNum(num) {
    return num.toLocaleString('nb-NO');
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
