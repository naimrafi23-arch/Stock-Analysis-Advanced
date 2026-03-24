// ═══════════════════════════════════════════════
//  MARKET HEATMAP
// ═══════════════════════════════════════════════

const Heatmap = {
  render() {
    const sorted = [...App.stocks].sort((a, b) => b.value - a.value).slice(0, CONFIG.HEATMAP_COUNT);
    const maxPct = Math.max(...sorted.map(s => Math.abs(s.pct)), 1);

    document.getElementById('hmc').innerHTML = `<div class="hmg">${
      sorted.map(s => {
        const intensity = Math.min(1, Math.abs(s.pct) / maxPct);
        const bg = s.pct > 0 ?
          `rgba(0,229,160,${0.15 + intensity * 0.6})` :
          s.pct < 0 ?
          `rgba(255,59,107,${0.15 + intensity * 0.6})` :
          'rgba(90,112,144,0.2)';
        return `<div class="hmc" style="background:${bg}" onclick="document.getElementById('sinp').value='${s.code}';document.querySelector('[data-t=search]').click()">
          <div class="hcd">${s.code}</div>
          <div class="hcp">${s.pct > 0 ? '+' : ''}${s.pct.toFixed(1)}%</div>
        </div>`;
      }).join('')
    }</div>`;
  }
};
