// ═══════════════════════════════════════════════
//  DSE HTML PARSER
// ═══════════════════════════════════════════════

const Parser = {
  parseStocks(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const stocks = [];
    let table = null;

    // Find stock table by headers
    for (const t of doc.querySelectorAll('table')) {
      const ths = [...t.querySelectorAll('th')].map(h => h.textContent.toUpperCase());
      if (ths.some(h => h.includes('TRADING')) &&
          ths.some(h => h.includes('LTP') || h.includes('HIGH'))) {
        table = t;
        break;
      }
    }

    // Fallback: largest table
    if (!table) {
      for (const t of doc.querySelectorAll('table')) {
        if (t.querySelectorAll('tr').length > 20) { table = t; break; }
      }
    }

    if (!table) return stocks;

    const rows = table.querySelectorAll('tr');
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].querySelectorAll('td');
      if (cols.length < 5) continue;

      const link = cols[1]?.querySelector('a');
      const code = (link ? link.textContent : cols[1]?.textContent || '').trim().toUpperCase();
      if (!code || code.length > 20 || /^\d+$/.test(code)) continue;

      const n = Utils.cleanNumber;
      const ltp = n(cols[2]?.textContent);
      const high = n(cols[3]?.textContent);
      const low = n(cols[4]?.textContent);
      const ycp = n(cols[6]?.textContent);
      const chg = n(cols[7]?.textContent);
      const trade = n(cols[8]?.textContent);
      const value = n(cols[9]?.textContent);
      const volume = n(cols[10]?.textContent);

      if (ltp <= 0 && ycp <= 0) continue;

      stocks.push({
        code, ltp, high, low, ycp, chg,
        pct: ycp > 0 ? Math.round(((ltp - ycp) / ycp) * 10000) / 100 : 0,
        trade: ~~trade, value, volume: ~~volume
      });
    }

    return stocks;
  },

  parseDSEX(html) {
    try {
      const text = new DOMParser().parseFromString(html, 'text/html').body.textContent;
      const match = text.match(/DSEX[:\s]*([0-9,]+\.?\d*)/);
      if (match) {
        const val = parseFloat(match[1].replace(/,/g, ''));
        if (val > 3000 && val < 10000) return val;
      }
    } catch (e) {}
    return null;
  }
};
