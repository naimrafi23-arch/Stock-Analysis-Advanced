// ═══════════════════════════════════════════════
//  CHART MANAGER — Efficient create/update
// ═══════════════════════════════════════════════

const Charts = {
  instances: {},

  upsert(id, config) {
    if (this.instances[id]) this.instances[id].destroy();
    const el = document.getElementById(id);
    if (!el) return null;
    this.instances[id] = new Chart(el, config);
    return this.instances[id];
  },

  destroy(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  destroyAll() {
    Object.keys(this.instances).forEach(id => this.destroy(id));
  },

  // ── Market Breadth Donut ──
  breadth(id, adv, dec, unc) {
    return this.upsert(id, {
      type: 'doughnut',
      data: {
        labels: [`▲${adv}`, `▼${dec}`, `=${unc}`],
        datasets: [{
          data: [adv, dec, unc],
          backgroundColor: ['#00e5a0', '#ff3b6b', '#5a7090'],
          borderColor: '#060810', borderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '60%',
        plugins: { legend: { position: 'bottom', labels: { padding: 10, font: { size: 8 } } } }
      }
    });
  },

  // ── Horizontal Bar Chart ──
  horizontalBar(id, labels, data, colors, max = null) {
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderRadius: 3
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(29,40,64,0.4)' }, ticks: { callback: v => v + '%' } },
          y: { grid: { display: false }, ticks: { font: { size: 8, weight: 'bold' } } }
        }
      }
    };
    if (max) config.options.scales.x.max = max;
    return this.upsert(id, config);
  },

  // ── Vertical Bar Chart ──
  verticalBar(id, labels, data, colors) {
    return this.upsert(id, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderRadius: 3
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(29,40,64,0.4)' }, ticks: { callback: v => v.toFixed(1) + '%' } },
          x: { grid: { display: false }, ticks: { font: { size: 7 }, maxRotation: 45 } }
        }
      }
    });
  },

  // ── Indicator Bar with zones ──
  indicatorBar(id, labels, data, colors) {
    return this.upsert(id, {
      type: 'bar',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 4 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { max: 100, grid: { color: 'rgba(29,40,64,0.3)' } }, x: { grid: { display: false } } }
      },
      plugins: [{
        id: 'zones',
        beforeDraw(chart) {
          const { ctx, chartArea: { left, right, top, bottom }, scales: { y } } = chart;
          const y30 = y.getPixelForValue(30), y70 = y.getPixelForValue(70);
          ctx.save();
          ctx.fillStyle = 'rgba(0,229,160,0.04)';
          ctx.fillRect(left, y30, right - left, bottom - y30);
          ctx.fillStyle = 'rgba(255,59,107,0.04)';
          ctx.fillRect(left, top, right - left, y70 - top);
          ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(0,229,160,0.25)';
          ctx.beginPath(); ctx.moveTo(left, y30); ctx.lineTo(right, y30); ctx.stroke();
          ctx.strokeStyle = 'rgba(255,59,107,0.25)';
          ctx.beginPath(); ctx.moveTo(left, y70); ctx.lineTo(right, y70); ctx.stroke();
          ctx.restore();
        }
      }]
    });
  },

  // ── Radar Chart ──
  radar(id, labels, data, color, bgColor) {
    return this.upsert(id, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: bgColor,
          borderColor: color,
          borderWidth: 2,
          pointRadius: 2,
          pointBackgroundColor: color
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            beginAtZero: true, max: 100,
            grid: { color: 'rgba(29,40,64,0.3)' },
            angleLines: { color: 'rgba(29,40,64,0.3)' },
            pointLabels: { font: { size: 7, weight: 'bold' } },
            ticks: { display: false }
          }
        }
      }
    });
  }
};
