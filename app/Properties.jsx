/* Properties list (tabs, filters, table, grid) — window.MTAProperties */
(function () {
  const h = React.createElement;
  const { Icons, StatusBadge } = window.MTAUI;
  const { Card, Button, Input, Select, Checkbox, Pagination } = window.ModtateDesignSystem_410f4d;
  const M = window.MTA;

  const PAGE_SIZE = 8;
  const thBase = { textAlign: 'left', fontWeight: 600, color: 'var(--gray-400)', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', padding: '10px 12px', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' };

  // ── derive enriched + filtered list ──────────────────────────
  function enrich(role, overrides, deletedIds) {
    const myCodes = M.MY_STAFF_CODES[M.ROLE_CONFIG[role].name] || [];
    return M.PROPERTIES.filter(raw => !(deletedIds || []).includes(raw.id)).map(raw => {
      const p = { ...raw, ...(overrides[raw.id] || {}) };
      const canSeeContact = role !== '業務' || myCodes.includes(p.staff);
      const photos = (overrides[raw.id] && overrides[raw.id]._photos) || M.photosFor(p);
      const category = M.STORE_TYPES.includes(p.type) ? 'store' : 'office';
      const buildingType = p.buildingType || (category === 'store' ? M.FILTERS.buildingType[M.hashId(p.id) % M.FILTERS.buildingType.length] : '電梯大樓');
      const storeType = p.storeType || (category === 'store' ? M.FILTERS.storeType[M.hashId(p.id) % M.FILTERS.storeType.length] : '');
      const propClass = p.propClass || (category === 'office' ? (M.hashId(p.id) % 3 === 0 ? '住辦' : '純辦') : '');
      return { ...p, photos, canSeeContact, category, buildingType, storeType, propClass };
    });
  }
  // area value for the selected basis (derive when base data lacks it)
  function areaValue(p, basis) {
    const num = (v) => { const n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; };
    const usable = Number(p.area) || 0;
    if (basis === '權狀坪數') return p.registeredArea ? num(p.registeredArea) : Math.round(usable * 1.3 * 10) / 10;
    if (basis === '主建物坪數') return p.mainArea ? num(p.mainArea) : Math.round(usable * 0.85 * 10) / 10;
    return usable; // 可使用坪數
  }
  function applyFilters(list, f) {
    return list.filter(p => {
      if (f.status && f.status !== 'all' && p.status !== f.status) return false;
      if (f.search) { const q = f.search.toLowerCase(); if (!p.name.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q) && !(p.mrt || '').toLowerCase().includes(q) && !(p.id || '').toLowerCase().includes(q)) return false; }
      if (f.city && !(p.address || '').includes(f.city)) return false;
      if (f.districts.length) { const m = p.address.match(/[市縣](.{2,4}區)/); if (!f.districts.includes(m ? m[1] : '')) return false; }
      if (f.rent.length && !f.rent.some(r => { const [lo, hi] = M.RENT_RANGES[r]; return p.rent >= lo && p.rent < hi; })) return false;
      if (f.rentMin && p.rent < Number(f.rentMin) * 10000) return false;
      if (f.rentMax && p.rent > Number(f.rentMax) * 10000) return false;
      if (f.area.length) { const av = areaValue(p, f.areaBasis); if (!f.area.some(r => { const [lo, hi] = M.AREA_RANGES[r]; return av >= lo && av < hi; })) return false; }
      if (f.areaMin || f.areaMax) { const av = areaValue(p, f.areaBasis); if (f.areaMin && av < Number(f.areaMin)) return false; if (f.areaMax && av > Number(f.areaMax)) return false; }
      if (f.buildingType && f.buildingType.length && !f.buildingType.includes(p.buildingType)) return false;
      if (f.propClass && f.propClass.length && !f.propClass.includes(p.propClass)) return false;
      if (f.storeType && f.storeType.length && !f.storeType.includes(p.storeType)) return false;
      if (f.floor.length) { const fl = parseInt(p.floor) || 0; if (!f.floor.some(r => { const [lo, hi] = M.FLOOR_RANGES[r]; return fl >= lo && fl <= hi; })) return false; }
      if (f.source.length) { const sr = (p.contactRole || '').replace(/\s.*/, ''); if (!f.source.some(s => sr.includes(s))) return false; }
      return true;
    });
  }

  // ── filter row ───────────────────────────────────────────────
  // 手動範圍輸入（最低 - 最高 + 單位）
  function RangeFields({ minVal, maxVal, onMin, onMax, unit }) {
    const inp = { width: 76, padding: '6px 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 13, fontFamily: 'var(--font-mono)', outline: 'none', color: 'var(--text-primary)' };
    return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8 } },
      h('input', { type: 'number', placeholder: '最低', value: minVal, onChange: (e) => onMin(e.target.value), style: inp }),
      h('span', { style: { color: 'var(--gray-400)' } }, '-'),
      h('input', { type: 'number', placeholder: '最高', value: maxVal, onChange: (e) => onMax(e.target.value), style: inp }),
      h('span', { style: { fontSize: 13, color: 'var(--gray-600)' } }, unit));
  }
  function FilterRow({ label, labelNode, options, selected, onToggle, onClear, suffix }) {
    return h('div', { style: { display: 'flex', alignItems: 'flex-start', padding: '11px 22px', borderBottom: '1px solid var(--border-subtle)', gap: 16 } },
      labelNode
        ? h('div', { style: { width: 150, flexShrink: 0 } }, labelNode)
        : h('div', { style: { width: 44, flexShrink: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', paddingTop: 1 } }, label),
      h('div', { style: { flex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px 22px', alignItems: 'center', paddingTop: 1 } },
        h('span', { onClick: onClear, style: { fontSize: 13, cursor: 'pointer', fontWeight: !selected.length ? 600 : 500, color: !selected.length ? 'var(--text-primary)' : 'var(--gray-600)' } }, '不限'),
        options.map(opt => h(Checkbox, { key: opt, label: opt, checked: selected.includes(opt), onChange: () => onToggle(opt), style: { fontSize: 13 } })),
        suffix || null));
  }

  // ── table row ────────────────────────────────────────────────
  function TableRow({ p, onOpen, onView, onDelete, canManage }) {
    const [hover, setHover] = React.useState(false);
    const td = { padding: '13px 12px', borderBottom: '1px solid var(--border-default)', verticalAlign: 'top' };
    const closed = p.status === 'closed';
    return h('tr', { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: { background: hover ? 'var(--surface-sunken)' : 'transparent' } },
      h('td', { style: { ...td, paddingLeft: 22, fontFamily: 'var(--font-mono)', color: 'var(--gray-400)', fontSize: 11, whiteSpace: 'nowrap' } }, p.id),
      h('td', { style: { ...td, minWidth: 180 } },
        h('div', { onClick: onOpen, style: { fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' } }, p.name),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 2 } }, p.address)),
      h('td', { style: { ...td, whiteSpace: 'nowrap' } },
        h('div', { style: { color: 'var(--text-primary)', fontWeight: 600 } }, p.category === 'store' ? p.storeType : (p.propClass || p.type)),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 1 } }, p.floor)),
      h('td', { style: { ...td, whiteSpace: 'nowrap' } }, (() => {
        const num = (v) => { const n = parseFloat(String(v || '').replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; };
        const reg = num(p.registeredArea) || Math.round((Number(p.area) || 0) * 1.3 * 10) / 10;
        const main = num(p.mainArea) || Math.round((Number(p.area) || 0) * 0.85 * 10) / 10;
        const acc = num(p.accessoryArea) || Math.max(0, Math.round((reg - main) * 10) / 10);
        const sub = [['主', main], ['附', acc], ['使用', Number(p.area) || 0]];
        return h('div', null,
          h('div', { style: { fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' } }, reg + ' 坪', h('span', { style: { fontSize: 11, fontWeight: 500, color: 'var(--gray-400)', marginLeft: 4 } }, '權狀')),
          h('div', { style: { fontSize: 11, color: 'var(--gray-400)', marginTop: 2 } }, sub.map(x => x[0] + ' ' + x[1]).join(' · ')));
      })()),
      h('td', { style: { ...td, whiteSpace: 'nowrap' } },
        h('div', { style: { fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' } }, M.fmt(p.rent), h('span', { style: { fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-sans)', color: 'var(--gray-400)', marginLeft: 4 } }, p.tax)),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 1 } }, '管理費 ' + p.mgmt)),
      h('td', { style: { ...td, fontSize: 12 } },
        h('div', { style: { color: 'var(--gray-600)' } }, p.ac), h('div', { style: { color: 'var(--gray-400)', marginTop: 2 } }, p.parking)),
      h('td', { style: { ...td, fontSize: 12, color: 'var(--gray-600)' } }, p.mrt ? h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 4 } }, h(Icons.mrt, { size: 13 }), h('span', { style: { fontWeight: 500, color: 'var(--text-primary)' } }, p.mrt)) : null),
      h('td', { style: { ...td, minWidth: 120 } }, p.canSeeContact
        ? h('div', null,
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
              h('div', { style: { fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 } }, p.contactName),
              (p.contacts && p.contacts.length > 1) && h('span', { style: { fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', background: 'var(--primary-100)', border: '1px solid var(--border-default)', borderRadius: 999, padding: '0 7px', lineHeight: '17px' } }, '+' + (p.contacts.length - 1))),
            h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 1 } }, p.contactRole), h('div', { style: { fontSize: 12, color: 'var(--gray-600)', fontFamily: 'var(--font-mono)', marginTop: 1 } }, p.phone))
        : h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--gray-400)' } }, h(Icons.lock, { size: 12 }), '僅承辦業務可見')),
      h('td', { style: { ...td, whiteSpace: 'nowrap' } },
        h('div', { style: { fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' } }, M.staffName(p.staff)),
        h('div', { style: { fontSize: 11, color: 'var(--gray-400)', marginTop: 3, fontFamily: 'var(--font-mono)' } }, p.created)),
      h('td', { style: td }, h(StatusBadge, { kind: 'prop', status: p.status })),
      h('td', { style: { ...td, paddingRight: 22, textAlign: 'right' } },
        h('div', { style: { display: 'flex', gap: 6, justifyContent: 'flex-end' } },
          h('button', { onClick: onView, style: ghostBtn }, '檢視'),
          canManage && h('button', { onClick: onDelete, style: { ...ghostBtn, borderColor: 'var(--error-200)', color: 'var(--error-500)' } }, '刪除'))));
  }
  const ghostBtn = { padding: '5px 11px', border: '1px solid var(--border-default)', borderRadius: 999, background: 'var(--surface-card)', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' };

  // ── grid card ────────────────────────────────────────────────
  function GridCard({ p, onOpen, onView, onDelete, canManage }) {
    const closed = p.status === 'closed';
    return h(Card, { interactive: true, padding: 0, onClick: onOpen, style: { overflow: 'hidden' } },
      h('div', { style: { position: 'relative', aspectRatio: '16/10', background: 'var(--gray-100)', overflow: 'hidden' } },
        h('img', { src: p.photos[0], alt: p.name, loading: 'lazy', style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
        h('div', { style: { position: 'absolute', top: 10, left: 10 } }, h(StatusBadge, { kind: 'prop', status: p.status })),
        h('span', { style: { position: 'absolute', top: 10, right: 10, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.45)', padding: '2px 8px', borderRadius: 999 } }, p.id)),
      h('div', { style: { padding: '14px 16px 16px' } },
        h('div', { style: { display: 'flex', alignItems: 'baseline', gap: 6 } },
          h('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' } }, M.fmt(p.rent)),
          h('span', { style: { fontSize: 12, color: 'var(--gray-400)' } }, '/ 月')),
        h('div', { style: { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginTop: 6 } }, p.name),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, p.address),
        h('div', { style: { display: 'flex', gap: 14, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--gray-600)' } },
          spec(Icons.ruler, p.area + ' 坪'), spec(Icons.floors, p.floor), spec(Icons.mrt, p.mrt)),
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 13 } },
          h('div', { style: { fontSize: 12, color: 'var(--gray-600)' } }, '承辦：', h('span', { style: { fontWeight: 600, color: 'var(--text-primary)' } }, M.staffName(p.staff))),
          h('div', { style: { display: 'flex', gap: 6 } },
            canManage && h('button', { onClick: (e) => { e.stopPropagation(); onDelete(); }, style: { ...ghostBtn, borderColor: 'var(--error-200)', color: 'var(--error-500)' } }, '刪除'),
            h('button', { onClick: (e) => { e.stopPropagation(); onView(); }, style: ghostBtn }, '檢視')))));
  }
  const spec = (Icon, txt) => h('span', { style: { display: 'flex', alignItems: 'center', gap: 4 } }, h(Icon, { size: 14, stroke: 1.4 }), txt);

  // ── main ─────────────────────────────────────────────────────
  function Properties({ role, overrides, deletedIds, onOpenDetail, onEdit, onDelete, onAdd, filterStyle }) {
    const canManage = role === '老闆';
    const [confirmDel, setConfirmDel] = React.useState(null);
    const [category, setCategory] = React.useState('office');
    const [viewMode, setViewMode] = React.useState('table');
    const [expanded, setExpanded] = React.useState(filterStyle !== 'pills');
    const [page, setPage] = React.useState(1);
    const [f, setF] = React.useState({ search: '', status: 'all', sort: '最新上架', city: '台北市', districts: [], rent: [], rentMin: '', rentMax: '', area: [], areaMin: '', areaMax: '', areaBasis: '可使用坪數', propClass: [], buildingType: [], storeType: [], floor: [], decoration: [], source: [] });
    const setArr = (key, val) => setF(s => ({ ...s, [key]: s[key].includes(val) ? s[key].filter(x => x !== val) : [...s[key], val] }));
    const clear = (key) => setF(s => ({ ...s, [key]: [] }));
    React.useEffect(() => setPage(1), [category, f]);

    const all = enrich(role, overrides, deletedIds);
    const officeCount = all.filter(p => p.category === 'office').length;
    const storeCount = all.filter(p => p.category === 'store').length;
    const inCat = all.filter(p => p.category === category);
    const filtered = applyFilters(inCat, f);
    const sorted = [...filtered].sort((a, b) => {
      if (f.sort === '租金低到高') return a.rent - b.rent;
      if (f.sort === '租金高到低') return b.rent - a.rent;
      return String(b.created).localeCompare(String(a.created)); // 最新上架
    });
    const hasAnyFilter = !!(f.search || (f.status && f.status !== 'all') || f.districts.length || f.rent.length || f.rentMin || f.rentMax || f.area.length || f.areaMin || f.areaMax || f.buildingType.length || f.storeType.length || f.floor.length || f.decoration.length || f.source.length);
    const adminNeedsSearch = role === '行政' && !hasAnyFilter;
    const visible = adminNeedsSearch ? [] : sorted;
    const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
    const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const hasFilters = hasAnyFilter;
    const canAdd = role !== '行政';

    const tab = (key, label, count, Icon) => {
      const on = category === key;
      return h('button', { onClick: () => setCategory(key), style: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', border: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, background: on ? 'var(--color-dark)' : '#fff', color: on ? '#fff' : 'var(--gray-500)', boxShadow: on ? '0 2px 8px rgba(17,24,39,0.18)' : 'inset 0 0 0 1px var(--border-default)' } },
        h(Icon, { size: 18, stroke: 1.6 }), label,
        h('span', { style: { fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', padding: '1px 8px', borderRadius: 999, background: on ? 'rgba(255,255,255,0.22)' : 'var(--primary-100)', color: on ? '#fff' : 'var(--gray-400)' } }, count));
    };
    const viewBtn = (mode, Icon, title) => { const on = viewMode === mode; return h('button', { onClick: () => setViewMode(mode), title, style: { width: 34, height: 32, border: 'none', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#fff' : 'transparent', color: on ? 'var(--text-primary)' : 'var(--gray-400)', boxShadow: on ? '0 1px 2px rgba(0,0,0,0.08)' : 'none' } }, h(Icon, { size: 16, stroke: 1.6 })); };

    return h(React.Fragment, null, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 } },
        h('h1', { style: { fontSize: 22, fontWeight: 700 } }, '物件管理'),
        h('div', { style: { display: 'flex', gap: 10 } },
          h(Button, { variant: 'outline', size: 'sm', iconLeft: h(Icons.export, { size: 14 }) }, '匯出 Excel'),
          canAdd && h(Button, { variant: 'primary', size: 'sm', iconLeft: h(Icons.plus, { size: 14, stroke: 2 }), onClick: () => onAdd(category) }, '新增物件'))),
      // tabs
      h('div', { style: { display: 'flex', gap: 10 } },
        tab('office', '出租辦公', officeCount, Icons.building), tab('store', '出租店面', storeCount, Icons.building)),
      h(Card, { padding: 0, style: { overflow: filterStyle === 'pills' ? 'visible' : 'hidden' } },
        filterStyle === 'pills'
        ? h('div', { style: { padding: '14px 22px', borderBottom: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 12 } },
            h('div', { style: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' } },
              h('div', { style: { flex: 1, minWidth: 220, maxWidth: 360 } }, h(Input, { icon: h(Icons.search, { size: 15 }), placeholder: '搜尋編號、物件名稱、地址或捷運站…', value: f.search, onChange: (e) => setF(s => ({ ...s, search: e.target.value })) })),
              h('div', { style: { width: 150 } }, h(Select, { options: [{ value: 'all', label: '全部狀態' }, { value: 'listing', label: '招租中' }, { value: 'negotiating', label: '洽談中' }, { value: 'deposited', label: '已收定' }, { value: 'preparing', label: '準備簽約' }, { value: 'signed', label: '已簽約出租' }], value: f.status, onChange: (v) => setF(s => ({ ...s, status: v })) })),
              h('span', { style: { fontSize: 12, color: 'var(--gray-400)', marginLeft: 'auto' } }, `找到 ${visible.length} 筆 / 共 ${all.length} 筆`),
              hasFilters && h('button', { onClick: () => setF({ search: '', status: 'all', sort: '最新上架', city: '台北市', districts: [], rent: [], rentMin: '', rentMax: '', area: [], areaMin: '', areaMax: '', areaBasis: '可使用坪數', propClass: [], buildingType: [], storeType: [], floor: [], decoration: [], source: [] }), style: { padding: '7px 14px', border: '1px solid var(--border-default)', borderRadius: 999, background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--error-500)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' } }, h(Icons.close, { size: 12 }), '清空條件'),
              h('div', { style: { display: 'flex', gap: 2, background: 'var(--primary-100)', borderRadius: 9, padding: 3 } }, viewBtn('table', Icons.listView, '列表檢視'), viewBtn('grid', Icons.gridView, '卡片檢視'))),
            h(window.MTAPillFilters, { f, setF, setArr, clear, category, activeCount: [f.districts, f.rent, f.area, f.buildingType, f.storeType, f.floor, f.decoration, f.source].reduce((n, a) => n + a.length, 0), onOpenAllFilters: () => setExpanded(e => !e) }),
            false && h('div', { style: { borderTop: '1px solid var(--border-subtle)', margin: '4px -22px 0', borderBottom: 'none' } },
              h(FilterRow, { label: '位置', options: M.FILTERS.districts, selected: f.districts, onToggle: (v) => setArr('districts', v), onClear: () => clear('districts') }),
              h(FilterRow, { label: '租金', suffix: h(RangeFields, { minVal: f.rentMin, maxVal: f.rentMax, onMin: (v) => setF(s2 => ({ ...s2, rentMin: v })), onMax: (v) => setF(s2 => ({ ...s2, rentMax: v })), unit: '萬' }), options: M.FILTERS.rent, selected: f.rent, onToggle: (v) => setArr('rent', v), onClear: () => clear('rent') }),
              h(FilterRow, { labelNode: h(Select, { options: ['可使用坪數', '權狀坪數', '主建物坪數'], value: f.areaBasis, onChange: (v) => setF(s => ({ ...s, areaBasis: v })) }), suffix: h(RangeFields, { minVal: f.areaMin, maxVal: f.areaMax, onMin: (v) => setF(s2 => ({ ...s2, areaMin: v })), onMax: (v) => setF(s2 => ({ ...s2, areaMax: v })), unit: '坪' }), options: M.FILTERS.area, selected: f.area, onToggle: (v) => setArr('area', v), onClear: () => clear('area') }),
              category === 'store' && h(FilterRow, { label: '店鋪類型', options: M.FILTERS.storeType, selected: f.storeType, onToggle: (v) => setArr('storeType', v), onClear: () => clear('storeType') }),
              category === 'office' && h(FilterRow, { label: '類別', options: M.FILTERS.propClass, selected: f.propClass, onToggle: (v) => setArr('propClass', v), onClear: () => clear('propClass') }),
              h(FilterRow, { label: '型態', options: M.FILTERS.buildingType, selected: f.buildingType, onToggle: (v) => setArr('buildingType', v), onClear: () => clear('buildingType') }),
              h(FilterRow, { label: '樓層', options: M.FILTERS.floor, selected: f.floor, onToggle: (v) => setArr('floor', v), onClear: () => clear('floor') }),
              h(FilterRow, { label: '裝潢', options: M.FILTERS.decoration, selected: f.decoration, onToggle: (v) => setArr('decoration', v), onClear: () => clear('decoration') })))
        : h(React.Fragment, null,
        // search bar
        h('div', { style: { display: 'flex', gap: 10, padding: '14px 22px', borderBottom: '1px solid var(--border-default)', alignItems: 'center', flexWrap: 'wrap' } },
          h('div', { style: { flex: 1, minWidth: 220, maxWidth: 360 } }, h(Input, { icon: h(Icons.search, { size: 15 }), placeholder: '搜尋編號、物件名稱、地址或捷運站…', value: f.search, onChange: (e) => setF(s => ({ ...s, search: e.target.value })) })),
          h('div', { style: { width: 150 } }, h(Select, { options: [{ value: 'all', label: '全部狀態' }, { value: 'listing', label: '招租中' }, { value: 'negotiating', label: '洽談中' }, { value: 'deposited', label: '已收定' }, { value: 'preparing', label: '準備簽約' }, { value: 'signed', label: '已簽約出租' }], value: f.status, onChange: (v) => setF(s => ({ ...s, status: v })) })),
          h('span', { style: { fontSize: 12, color: 'var(--gray-400)', marginLeft: 'auto' } }, `找到 ${visible.length} 筆 / 共 ${all.length} 筆`),
          hasFilters && h('button', { onClick: () => setF({ search: '', status: 'all', sort: '最新上架', city: '台北市', districts: [], rent: [], rentMin: '', rentMax: '', area: [], areaMin: '', areaMax: '', areaBasis: '可使用坪數', propClass: [], buildingType: [], storeType: [], floor: [], decoration: [], source: [] }), style: { padding: '7px 14px', border: '1px solid var(--border-default)', borderRadius: 999, background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--error-500)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' } }, h(Icons.close, { size: 12 }), '清空條件'),
          h('button', { onClick: () => setExpanded(e => !e), style: { padding: '7px 14px', border: '1px solid var(--border-default)', borderRadius: 999, background: 'var(--surface-card)', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' } }, h(expanded ? Icons.chevronDown : Icons.chevronRight, { size: 12 }), expanded ? '收起篩選' : '展開篩選'),
          h('div', { style: { display: 'flex', gap: 2, background: 'var(--primary-100)', borderRadius: 9, padding: 3 } }, viewBtn('table', Icons.listView, '列表檢視'), viewBtn('grid', Icons.gridView, '卡片檢視'))),
        // advanced filters
        expanded && h('div', { style: { borderBottom: '1px solid var(--border-default)' } },
          h('div', { style: { display: 'flex', alignItems: 'center', padding: '11px 22px', borderBottom: '1px solid var(--border-subtle)', gap: 16 } },
            h('div', { style: { width: 44, flexShrink: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' } }, '縣市'),
            h('div', { style: { display: 'flex', gap: 22, alignItems: 'center' } },
              ['台北市', '新北市'].map(c => h('span', { key: c, onClick: () => setF(s => ({ ...s, city: c, districts: [] })), style: { fontSize: 13, cursor: 'pointer', fontWeight: f.city === c ? 600 : 500, color: f.city === c ? 'var(--text-primary)' : 'var(--gray-600)' } }, c)))),
          h(FilterRow, { label: '位置', options: M.FILTERS.districts, selected: f.districts, onToggle: (v) => setArr('districts', v), onClear: () => clear('districts') }),
          h(FilterRow, { label: '租金', suffix: h(RangeFields, { minVal: f.rentMin, maxVal: f.rentMax, onMin: (v) => setF(s2 => ({ ...s2, rentMin: v })), onMax: (v) => setF(s2 => ({ ...s2, rentMax: v })), unit: '萬' }), options: M.FILTERS.rent, selected: f.rent, onToggle: (v) => setArr('rent', v), onClear: () => clear('rent') }),
          h(FilterRow, { labelNode: h(Select, { options: ['可使用坪數', '權狀坪數', '主建物坪數'], value: f.areaBasis, onChange: (v) => setF(s => ({ ...s, areaBasis: v })) }), suffix: h(RangeFields, { minVal: f.areaMin, maxVal: f.areaMax, onMin: (v) => setF(s2 => ({ ...s2, areaMin: v })), onMax: (v) => setF(s2 => ({ ...s2, areaMax: v })), unit: '坪' }), options: M.FILTERS.area, selected: f.area, onToggle: (v) => setArr('area', v), onClear: () => clear('area') }),
          category === 'store' && h(FilterRow, { label: '店鋪類型', options: M.FILTERS.storeType, selected: f.storeType, onToggle: (v) => setArr('storeType', v), onClear: () => clear('storeType') }),
          category === 'office' && h(FilterRow, { label: '類別', options: M.FILTERS.propClass, selected: f.propClass, onToggle: (v) => setArr('propClass', v), onClear: () => clear('propClass') }),
          h(FilterRow, { label: '型態', options: M.FILTERS.buildingType, selected: f.buildingType, onToggle: (v) => setArr('buildingType', v), onClear: () => clear('buildingType') }),
          h(FilterRow, { label: '樓層', options: M.FILTERS.floor, selected: f.floor, onToggle: (v) => setArr('floor', v), onClear: () => clear('floor') }),
          h('div', { style: { padding: 0, borderBottom: '1px solid var(--border-subtle)' } }, h(FilterRowLast, { label: '裝潢', options: M.FILTERS.decoration, selected: f.decoration, onToggle: (v) => setArr('decoration', v), onClear: () => clear('decoration') })),
          h(SortRow, { value: f.sort, onChange: (v) => setF(s => ({ ...s, sort: v })) }))),
        // body
        adminNeedsSearch ? h(EmptySearch) :
          viewMode === 'table'
            ? h('div', { style: { overflowX: 'auto' } }, h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 1200 } },
              h('thead', null, h('tr', { style: { background: 'var(--surface-sunken)' } },
                ['編號', '物件名稱 / 地址', '類型 / 樓層', '坪數', '月租 / 管理費', '冷氣 / 車位', '捷運站', '聯絡人', '承辦業務', '狀態', ''].map((t, i) => h('th', { key: i, style: { ...thBase, ...(i === 0 ? { paddingLeft: 22 } : {}) } }, t)))),
              h('tbody', null, pageItems.map(p => h(TableRow, { key: p.id, p, canManage, onOpen: () => onOpenDetail(p.id, 'summary'), onView: () => onOpenDetail(p.id, 'full'), onDelete: () => setConfirmDel(p) })))))
            : h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18, padding: 22 } }, pageItems.map(p => h(GridCard, { key: p.id, p, canManage, onOpen: () => onOpenDetail(p.id, 'summary'), onView: () => onOpenDetail(p.id, 'full'), onDelete: () => setConfirmDel(p) }))),
        // footer
        !adminNeedsSearch && h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderTop: '1px solid var(--border-default)' } },
          h('span', { style: { fontSize: 12, color: 'var(--gray-400)' } }, `找到 ${visible.length} 筆 / 共 ${all.length} 筆`),
          h(Pagination, { total: totalPages, page, onChange: setPage })))),
      confirmDel && h(ConfirmDeleteProp, { p: confirmDel, onClose: () => setConfirmDel(null), onConfirm: () => { onDelete(confirmDel); setConfirmDel(null); } }));
  }

  function ConfirmDeleteProp({ p, onClose, onConfirm }) {
    return h('div', { onClick: onClose, style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 } },
      h('div', { onClick: (e) => e.stopPropagation(), style: { background: 'var(--surface-card)', borderRadius: 'var(--radius-2xl)', width: '100%', maxWidth: 420, boxShadow: '0 20px 50px rgba(0,0,0,0.25)', padding: 28 } },
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 } },
          h('div', { style: { width: 52, height: 52, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--error-100)', color: 'var(--error-500)' } }, h(Icons.close, { size: 24, stroke: 2 })),
          h('h2', { style: { fontSize: 19, fontWeight: 600, color: 'var(--text-primary)' } }, '刪除物件'),
          h('div', { style: { fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 } }, '確定要刪除物件 ', h('strong', null, p.name, '（', p.id, '）'), ' 嗎？此動作無法復原。')),
        h('div', { style: { display: 'flex', gap: 10, marginTop: 26 } },
          h(Button, { variant: 'outline', onClick: onClose, style: { flex: 1 } }, '取消'),
          h('button', { onClick: onConfirm, style: { flex: 1, padding: '11px 22px', border: 'none', borderRadius: 999, background: 'var(--error-500)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, '確定刪除'))));
  }
  // last filter row without bottom border
  function FilterRowLast(props) {
    return h('div', { style: { display: 'flex', alignItems: 'flex-start', padding: '11px 22px', gap: 16 } },
      h('div', { style: { width: 44, flexShrink: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', paddingTop: 1 } }, props.label),
      h('div', { style: { flex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px 22px', alignItems: 'center' } },
        h('span', { onClick: props.onClear, style: { fontSize: 13, cursor: 'pointer', fontWeight: !props.selected.length ? 600 : 500, color: !props.selected.length ? 'var(--text-primary)' : 'var(--gray-600)' } }, '不限'),
        props.options.map(opt => h(Checkbox, { key: opt, label: opt, checked: props.selected.includes(opt), onChange: () => props.onToggle(opt) }))));
  }
  // sort row — single choice
  function SortRow({ value, onChange }) {
    const opts = ['最新上架', '租金低到高', '租金高到低'];
    return h('div', { style: { display: 'flex', alignItems: 'flex-start', padding: '11px 22px', gap: 16 } },
      h('div', { style: { width: 44, flexShrink: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', paddingTop: 1 } }, '排序'),
      h('div', { style: { flex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px 22px', alignItems: 'center' } },
        opts.map(opt => h('span', { key: opt, onClick: () => onChange(opt), style: { fontSize: 13, cursor: 'pointer', fontWeight: value === opt ? 600 : 500, color: value === opt ? 'var(--text-primary)' : 'var(--gray-600)' } }, opt))));
  }
  function EmptySearch() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '70px 20px', textAlign: 'center' } },
      h('div', { style: { width: 64, height: 64, borderRadius: 999, background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: 'var(--gray-400)' } }, h(Icons.search, { size: 28 })),
      h('div', { style: { fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' } }, '請輸入搜尋條件以查看物件'),
      h('div', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 6, maxWidth: 340 } }, '行政帳號需透過搜尋或套用篩選條件來檢視物件資料，以保護物件隱私。'));
  }

  window.MTAProperties = Properties;
})();
