// ─── Embedded & Pre-processed Data (from Stack Overflow CSV, 65K+ rows) ───
const RAW_DATA = {
  "python":      { "2022": 442.13, "2023": 321.67, "2024": 311.65 },
  "javascript":  { "2022": 234.92, "2023": 193.50, "2024": 162.12 },
  "reactjs":     { "2022": 137.00, "2023": 123.53, "2024": 108.85 },
  "c#":          { "2022": 133.73, "2023": 107.82, "2024": 105.20 },
  "java":        { "2022": 120.00, "2023": 110.48, "2024": 108.85 },
  "r":           { "2022": 101.67, "2023": 88.45,  "2024": 98.58  },
  "flutter":     { "2022": 83.53,  "2023": 75.42,  "2024": 84.70  },
  "typescript":  { "2022": 81.90,  "2023": 92.85,  "2024": 64.35  },
  "html":        { "2022": 81.42,  "2023": 70.25,  "2024": 75.93  },
  "c++":         { "2022": 68.18,  "2023": 67.15,  "2024": 73.38  },
  "css":         { "2022": 70.58,  "2023": 69.67,  "2024": 66.72  },
  "android":     { "2022": 66.70,  "2023": 63.93,  "2024": 76.08  },
  "sql":         { "2022": 83.02,  "2023": 47.70,  "2024": 72.52  },
  "pandas":      { "2022": 86.58,  "2023": 45.47,  "2024": 40.72  },
  "php":         { "2022": 54.15,  "2023": 57.95,  "2024": 55.37  },
  "angular":     { "2022": 55.27,  "2023": 41.35,  "2024": 58.77  },
  "node.js":     { "2022": 58.02,  "2023": 38.63,  "2024": 43.02  },
  "excel":       { "2022": 34.17,  "2023": 41.92,  "2024": 52.43  },
  "python-3.x":  { "2022": 47.02,  "2023": 42.40,  "2024": 31.33  },
  "c":           { "2022": 35.17,  "2023": 35.83,  "2024": 41.03  }
};

const YEARS = ['2022', '2023', '2024'];

// Color palette — bold, distinct
const PALETTE = [
  '#38bdf8','#818cf8','#34d399','#fb923c','#f472b6',
  '#a78bfa','#fbbf24','#22d3ee','#86efac','#e879f9',
  '#60a5fa','#4ade80','#facc15','#f87171','#c084fc',
  '#67e8f9','#a3e635','#ff8c42','#9ca3af','#e2e8f0'
];

// ─── State ───
let currentChart = 'line';
let currentTopN   = 10;
let currentYear   = 'all';
let mainChartInst = null;
let deltaChartInst = null;

// ─── Helpers ───
function getTopN(n) {
  return Object.entries(RAW_DATA)
    .map(([lang, d]) => ({ lang, total: d['2022'] + d['2023'] + d['2024'], ...d }))
    .sort((a, b) => b.total - a.total)
    .slice(0, n);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getChartData(type, topN, year) {
  const langs = getTopN(topN);

  if (type === 'line') {
    const years = year === 'all' ? YEARS : [year];
    return {
      labels: years,
      datasets: langs.map((d, i) => ({
        label: capitalize(d.lang),
        data: years.map(y => d[y]),
        borderColor: PALETTE[i],
        backgroundColor: PALETTE[i] + '22',
        borderWidth: 2.5,
        pointRadius: 5, pointHoverRadius: 8,
        fill: false, tension: 0.35
      }))
    };
  }

  if (type === 'bar') {
    const years = year === 'all' ? YEARS : [year];
    return {
      labels: langs.map(d => capitalize(d.lang)),
      datasets: years.map((y, i) => ({
        label: y,
        data: langs.map(d => d[y]),
        backgroundColor: PALETTE[i * 3] + 'cc',
        borderColor: PALETTE[i * 3],
        borderWidth: 1, borderRadius: 4
      }))
    };
  }

  if (type === 'radar') {
    const years = year === 'all' ? YEARS : [year];
    const top8 = langs.slice(0, 8);
    return {
      labels: top8.map(d => capitalize(d.lang)),
      datasets: years.map((y, i) => ({
        label: y,
        data: top8.map(d => d[y]),
        borderColor: PALETTE[i * 3],
        backgroundColor: PALETTE[i * 3] + '33',
        pointBackgroundColor: PALETTE[i * 3],
        borderWidth: 2
      }))
    };
  }
}

function getChartOptions(type) {
  const base = {
    responsive: true,
    maintainAspectRatio: true,
    animation: { duration: 700, easing: 'easeInOutQuart' },
    plugins: {
      legend: {
        position: type === 'line' ? 'right' : 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 11 },
          boxWidth: 12, padding: 14,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#0f1624',
        borderColor: 'rgba(56,189,248,0.3)',
        borderWidth: 1,
        titleColor: '#38bdf8',
        bodyColor: '#e2e8f0',
        titleFont: { family: 'JetBrains Mono', size: 12 },
        bodyFont:  { family: 'JetBrains Mono', size: 11 },
        padding: 12, cornerRadius: 8,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y !== undefined ? ctx.parsed.y.toFixed(1) : ctx.parsed.r.toFixed(1)} pts`
        }
      }
    }
  };

  if (type === 'line' || type === 'bar') {
    base.scales = {
      x: {
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 11 } },
        grid:  { color: 'rgba(56,189,248,0.05)' }
      },
      y: {
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } },
        grid:  { color: 'rgba(56,189,248,0.07)' },
        title: {
          display: true,
          text: 'Normalized Activity Score',
          color: '#475569',
          font: { family: 'JetBrains Mono', size: 10 }
        }
      }
    };
  }
  if (type === 'radar') {
    base.scales = {
      r: {
        ticks:   { color: '#475569', backdropColor: 'transparent', font: { size: 9 } },
        grid:    { color: 'rgba(56,189,248,0.1)' },
        pointLabels: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 10 } }
      }
    };
    base.plugins.legend.position = 'top';
  }
  return base;
}

// ─── Render main chart ───
function renderMainChart() {
  const canvas = document.getElementById('mainChart');
  const ctx = canvas.getContext('2d');

  if (mainChartInst) mainChartInst.destroy();

  // Height control
  canvas.parentElement.style.height =
    currentChart === 'radar' ? '420px' :
    currentChart === 'line'  ? '420px' : '380px';

  const data = getChartData(currentChart, currentTopN, currentYear);
  mainChartInst = new Chart(ctx, {
    type: currentChart === 'line' ? 'line' : currentChart === 'bar' ? 'bar' : 'radar',
    data,
    options: getChartOptions(currentChart)
  });

  // Update title
  const titles = {
    line:  'Programming Language Popularity Trend (2022–2024)',
    bar:   'Language Activity Score Comparison by Year',
    radar: 'Top 8 Languages – Multi-year Radar Analysis'
  };
  document.getElementById('mainChartTitle').textContent = titles[currentChart];
}

// ─── Delta chart (YoY change 2023→2024) ───
function renderDeltaChart() {
  const canvas = document.getElementById('deltaChart');
  const ctx = canvas.getContext('2d');
  if (deltaChartInst) deltaChartInst.destroy();

  const langs = getTopN(currentTopN);
  const deltas = langs.map(d => parseFloat((d['2024'] - d['2023']).toFixed(1)));
  const labels = langs.map(d => capitalize(d.lang));
  const colors = deltas.map(v => v >= 0 ? '#34d399cc' : '#f87171cc');
  const borders= deltas.map(v => v >= 0 ? '#34d399' : '#f87171');

  deltaChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '2023→2024 Δ',
        data: deltas,
        backgroundColor: colors,
        borderColor: borders,
        borderWidth: 1, borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      animation: { duration: 600, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f1624', borderColor: 'rgba(56,189,248,0.3)', borderWidth: 1,
          titleColor: '#38bdf8', bodyColor: '#e2e8f0',
          titleFont: { family: 'JetBrains Mono', size: 11 },
          bodyFont:  { family: 'JetBrains Mono', size: 10 },
          padding: 10, cornerRadius: 8,
          callbacks: {
            label: ctx => ` ${ctx.parsed.x >= 0 ? '+' : ''}${ctx.parsed.x} pts`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } },
          grid:  { color: 'rgba(56,189,248,0.05)' }
        },
        y: {
          ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 10 } },
          grid:  { display: false }
        }
      }
    }
  });
}

// ─── Rank table ───
function renderRankTable() {
  const langs = getTopN(20);
  const max = langs[0]['2024'];
  const el = document.getElementById('rankTable');

  const top10 = getTopN(10);
  const rankForDelta = lang => {
    const d = RAW_DATA[lang.lang];
    const delta = d['2024'] - d['2023'];
    if (Math.abs(delta) < 2) return '<span class="rank-trend trend-flat">→ flat</span>';
    return delta > 0
      ? `<span class="rank-trend trend-up">↑ +${delta.toFixed(0)}</span>`
      : `<span class="rank-trend trend-down">↓ ${delta.toFixed(0)}</span>`;
  };

  el.innerHTML = top10.map((d, i) => `
    <div class="rank-row">
      <span class="rank-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="rank-lang">${capitalize(d.lang)}</span>
      <div class="rank-bar-wrap">
        <div class="rank-bar-fill" style="width:${(d['2024'] / max * 100).toFixed(1)}%"></div>
      </div>
      <span class="rank-score">${d['2024'].toFixed(0)}</span>
      ${rankForDelta(d)}
    </div>
  `).join('');
}

// ─── Init & event listeners ───
function init() {
  renderMainChart();
  renderDeltaChart();
  renderRankTable();

  // Chart type tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentChart = btn.dataset.chart;
      renderMainChart();
    });
  });

  // Top N filter
  document.getElementById('topN').addEventListener('change', e => {
    currentTopN = parseInt(e.target.value);
    renderMainChart();
    renderDeltaChart();
    renderRankTable();
  });

  // Year filter
  document.getElementById('yearFilter').addEventListener('change', e => {
    currentYear = e.target.value;
    renderMainChart();
  });
}

document.addEventListener('DOMContentLoaded', init);
