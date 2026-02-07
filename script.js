// Global helper functions for interactive features

document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  initMapMarkers();
  initRevenueChart();
  initAircraftHotspots();
  initProjectToggles();
  initResponsiveRevenueChart();
});

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    let prefix = '';
    let suffix = '';

    const text = counter.textContent.trim();
    if (text.startsWith('$')) prefix = '$';
    if (text.endsWith('%')) suffix = '%';

    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = prefix + value.toLocaleString() + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

// Map marker initialization
function initMapMarkers() {
  const mapContainer = document.querySelector('.map-container');
  const tooltip = document.getElementById('mapTooltip');
  if (!mapContainer || !tooltip) return;

  const locations = [
    {
      name: 'New York (JFK)',
      description:
        'Duty Maintenance Manager at British Airways Engineering JFK; manages largest overseas line station generating $3.5M annually.',
      x: 0.27,
      y: 0.38
    },
    {
      name: 'London (Heathrow)',
      description:
        'Performance Recovery Team operations at LHR; led time-critical recovery operations.',
      x: 0.45,
      y: 0.30
    },
    {
      name: 'Reykjavik (Iceland)',
      description:
        'Licensed Aircraft Engineer for Icelandair; managed line and base maintenance.',
      x: 0.42,
      y: 0.25
    },
    {
      name: 'Geneva (Switzerland)',
      description:
        'Home Base; expanding global operations perspective.',
      x: 0.47,
      y: 0.33
    }
  ];

  locations.forEach(loc => {
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.style.left = (loc.x * 100) + '%';
    marker.style.top = (loc.y * 100) + '%';

    marker.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
      tooltip.innerHTML = '<strong>' + loc.name + '</strong><br>' + loc.description;

      const rect = mapContainer.getBoundingClientRect();
      tooltip.style.left = (loc.x * rect.width + 20) + 'px';
      tooltip.style.top = (loc.y * rect.height + 20) + 'px';
    });

    marker.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    mapContainer.appendChild(marker);
  });
}

// Revenue bar chart initialization
function initRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;

  // Size to container
  canvas.width = canvas.offsetWidth;
  canvas.height = 300;

  const labels = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  const values = [1.0, 1.5, 2.0, 2.6, 3.0, 3.5, 4.0];
  const colors = ['#0078D4', '#107C10', '#FFB900', '#003087', '#0078D4', '#107C10', '#FFB900'];

  drawBarChart('revenueChart', labels, values, colors);
}

// Redraw chart on resize for crisp layout
function initResponsiveRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;

  let resizeTimer = null;

  window.addEventListener('resize', () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      initRevenueChart();
    }, 150);
  });
}

// Draw a simple bar chart on a canvas (dark theme labels)
function drawBarChart(canvasId, labels, values, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const maxVal = Math.max(...values);
  const barWidth = (width * 0.8) / values.length;
  const barGap = (width * 0.2) / (values.length + 1);

  ctx.clearRect(0, 0, width, height);

  // Subtle dark panel fill so the chart reads as a component
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  ctx.fillRect(0, 0, width, height);

  // Typography
  ctx.font = '12px Segoe UI, sans-serif';
  ctx.textBaseline = 'alphabetic';

  // Optional: a faint baseline for alignment
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(0, height - 18);
  ctx.lineTo(width, height - 18);
  ctx.stroke();

  values.forEach((val, i) => {
    const barHeight = (val / maxVal) * (height * 0.62);
    const x = barGap + i * (barWidth + barGap);
    const y = height - barHeight - 28;

    // Bars
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y, barWidth, barHeight);

    // Value label above bar (white)
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    const valueLabel = val + 'M';
    ctx.fillText(
      valueLabel,
      x + barWidth / 2 - ctx.measureText(valueLabel).width / 2,
      y - 8
    );

    // X-axis label (slightly muted white)
    ctx.fillStyle = 'rgba(255,255,255,0.70)';
    const label = labels[i];
    ctx.fillText(
      label,
      x + barWidth / 2 - ctx.measureText(label).width / 2,
      height - 6
    );
  });
}

// Modal functions (available globally)
function openModal(id) {
  const modal = document.getElementById('modal' + capitalize(id));
  if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
  const modal = document.getElementById('modal' + capitalize(id));
  if (modal) modal.style.display = 'none';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Aircraft hotspot initialization
function initAircraftHotspots() {
  const container = document.querySelector('.aircraft-container');
  const tooltip = document.getElementById('aircraftTooltip');
  if (!container || !tooltip) return;

  const hotspots = [
    { name: 'B777 / GE90', description: 'Type rating B777 with GE90 engine', x: 0.25, y: 0.55 },
    { name: 'B787 / GEnx', description: 'Type rating B787 with GEnx engine', x: 0.75, y: 0.50 },
    { name: 'A330 / Trent', description: 'A330 with Trent 7000', x: 0.45, y: 0.65 },
    { name: 'B757 / RB211', description: 'B757 with RB211 engine', x: 0.60, y: 0.30 }
  ];

  hotspots.forEach(hs => {
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.style.left = (hs.x * 100) + '%';
    marker.style.top = (hs.y * 100) + '%';

    marker.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
      tooltip.innerHTML = '<strong>' + hs.name + '</strong><br>' + hs.description;

      const rect = container.getBoundingClientRect();
      tooltip.style.left = (hs.x * rect.width + 20) + 'px';
      tooltip.style.top = (hs.y * rect.height) + 'px';
    });

    marker.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    container.appendChild(marker);
  });
}

// Project card toggle initialization
function initProjectToggles() {
  const toggles = document.querySelectorAll('.project-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const details = btn.nextElementSibling;
      if (!details) return;

      details.style.display = (details.style.display === 'block') ? 'none' : 'block';
    });
  });
}
