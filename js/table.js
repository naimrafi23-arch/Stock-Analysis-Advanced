// ═══════════════════════════════════════════════
//  TABLE RENDERER — Efficient with event delegation
// ═══════════════════════════════════════════════

const Table = {
  filter: 'all',
  sort: { col: 'pct', dir: 'desc' },
  page: 1,
  filtered: [],

  init() {
    // Event delegation for table clicks
    document.getElementById('ltb').closest('.tw').addEventListener('click', e => {
      const tr = e.target.closest('tr[data-c]');
      if (!tr || e.target.closest('a')) return;
      document.getElementById('sinp').value = tr.dataset.c;
      document.querySelector('[data-t=search]').click();
    });
  },

  setFilter(el, filter) {
    this.filter = filter;
    document.querySelectorAll('.ft').forEach(t => t.classList.remove('on'));
    el.classList.add('on');
    this.page = 1;
    this.apply();
  },

  setSort(col) {
    if (this.sort.col === col) {
      this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort.col = col;
      this.sort.dir = 'desc';
    }
    this.apply();
  },

  apply() {
    const q = (document.getElementById('lsrch')?.value || '').toUpperCase().trim();
    this.filtered = App.stocks.filter(s => {
      if (q && !s.code.includes(q)) return false;
      if (this.filter === 'pos' && s.chg <= 0) return false;
      if (this.filter === 'neg' && s.chg >= 0) return false;
      if (this.filter === 'sig' && s.signal === 'HOLD') return false;
      return true;
    });

    const { col, dir } = this.sort;
    const d = dir === 'asc' ? 1 : -1;
    this.filtered.sort((a, b) => {
      const av = col === 'code' ? a.code : a[col] || 0;
      const bv = col === 'code' ? b.code : b[col] || 0;
      return typeof av === 'string' ? d * av.localeCompare(bv) : d * (av - bv);
    });

    this.render();
  },

  render() {
    const total = this.filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / CONFIG.PAGE_SIZE));
    if (this.page > totalPages) this.page = totalPages;
    const start = (this.page - 1) * CONFIG.PAGE_SIZE;
    const page = this.filtered.slice(start, start + CONFIG.PAGE_SIZE);
    const maxPct = Math.max(...App.stocks.map(s => Math.abs(s.pct)), 0.01);

    // Build rows as string (fastest DOM method)
    document.getElementById('ltb').innerHTML = page.map((s, i) => {
      const cc = Utils.chgClass(s.chg);
      const barW = Math.round(Math.abs(s.pct) / maxPct * 100);
      return `<tr data-c="${s.code}">
        <td class="rn">${start + i + 1}</td>
        <td class="tc"><a href="https://www.dsebd.org/displayCompany.php?name=${s.code}" target="_blank" onclick="event.stopPropagation()">${s.code}</a></td>
        <td class="tp">${Utils.formatPrice(s.ltp)}</td>
        <td class="tchg ${cc}">${s.chg > 0 ? '+' : ''}${s.chg.toFixed(2)}</td>
        <td class="tchg ${cc}">${s.pct > 0 ? '+' : ''}${s.pct.toFixed(2)}%</td>
        <td class="tn" style="color:var(--muted2)">${Utils.formatVolume(s.volume)}</td>
        <td><span class="tsig ${s.signal}">${s.signal}</span></td>
        <td class="tn" style="color:${s.strength > 70 ? 'var(--green)' : s.strength > 50 ? 'var(--gold)' : 'var(--muted2)'}">${s.strength}%</td>
        <td class="bar"><div class="mb"><div class="mf ${s.chg < 0 ? 'r' : 'g'}" style="width:${barW}%"></div></div></td>
      </tr>`;
    }).join('');

    // Pagination
    document.getElementById('pinfo').textContent = `${start + 1}–${Math.min(start + CONFIG.PAGE_SIZE, total)} of ${total}`;
    let btns = `<button class="pb" onclick="Table.page--;Table.apply()" ${this.page <= 1 ? 'disabled' : ''}>←</button>`;
    for (let p = Math.max(1, this.page - 3); p <= Math.min(totalPages, this.page + 3); p++) {
      btns += `<button class="pb${p === this.page ? ' on' : ''}" onclick="Table.page=${p};Table.render()">${p}</button>`;
    }
    btns += `<button class="pb" onclick="Table.page++;Table.apply()" ${this.page >= totalPages ? 'disabled' : ''}>→</button>`;
    document.getElementById('pbts').innerHTML = btns;
  }
};
