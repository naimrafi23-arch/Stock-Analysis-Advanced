// ═══════════════════════════════════════════════
//  COMPOSITE SCORING & TOP 30 SELECTION
// ═══════════════════════════════════════════════

const Scoring = {
  scoreStock(stock) {
    let score = 0;

    // Signal quality
    if (stock.signal === 'BUY') score += stock.strength * 1.6;
    else if (stock.signal === 'SELL') score += stock.strength * 1.3;
    else score += stock.strength * 0.4;

    // Signal extremity
    score += Math.abs(stock.bp - 50) * 0.9;

    // Volume activity
    if (stock.volR > 1.5) score += stock.volR * 9;

    // Price movement
    score += Math.abs(stock.pct) * 6;

    // Trade activity
    if (stock.trade > 100) score += Math.min(22, stock.trade / 45);

    // Value traded
    if (stock.value > 10) score += Math.min(28, stock.value / 4);

    // Known stock bonus
    if (SECTORS[stock.code]) score += 22;

    // Zero change penalty
    if (stock.chg === 0) score -= 25;

    // Pattern bonus
    if (stock.patterns.length > 2) score += stock.patterns.length * 3;

    // BB Squeeze bonus (breakout potential)
    if (stock.bbSq) score += 8;

    // Good risk/reward bonus
    if (parseFloat(stock.rr) > 2) score += 10;

    return Math.round(score * 10) / 10;
  },

  analyzeAll(rawStocks) {
    Utils.clearCache();
    const analyzed = rawStocks
      .map(s => {
        const result = Analysis.analyze(s);
        if (!result) return null;
        result.score = this.scoreStock(result);
        return result;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    return analyzed;
  },

  selectTop30(stocks) {
    const top30 = [];
    const sectorCount = {};

    // First pass: pick by score with sector diversity
    for (const stock of stocks) {
      if (top30.length >= CONFIG.TOP30_COUNT) break;
      const sec = stock.sec;
      if ((sectorCount[sec] || 0) >= CONFIG.MAX_SECTOR) continue;
      top30.push(stock);
      sectorCount[sec] = (sectorCount[sec] || 0) + 1;
    }

    // Fill remaining without sector limit
    if (top30.length < CONFIG.TOP30_COUNT) {
      const existing = new Set(top30.map(s => s.code));
      for (const stock of stocks) {
        if (top30.length >= CONFIG.TOP30_COUNT) break;
        if (!existing.has(stock.code)) top30.push(stock);
      }
    }

    // Sort: BUY first, then SELL, then HOLD by strength
    const order = { BUY: 0, SELL: 1, HOLD: 2 };
    top30.sort((a, b) => order[a.signal] - order[b.signal] || b.strength - a.strength);

    return {
      stocks: top30,
      sectors: Object.keys(sectorCount).length,
      buy: top30.filter(s => s.signal === 'BUY').length,
      sell: top30.filter(s => s.signal === 'SELL').length,
      hold: top30.filter(s => s.signal === 'HOLD').length
    };
  }
};
