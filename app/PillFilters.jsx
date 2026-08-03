/* Airbnb-style pill filter bar — window.MTAPillFilters
   Horizontal row of filter pills; each opens a popover with that dimension's options. */
(function () {
  const h = React.createElement;
  const { Icons } = window.MTAUI;
  const { Checkbox, Select } = window.ModtateDesignSystem_410f4d;
  const M = window.MTA;

  const STATUS_OPTS = [['listing', '招租中'], ['negotiating', '洽談中'], ['deposited', '已收定'], ['preparing', '準備簽約'], ['signed', '已簽約出租']];

  function Pill({ label, count, open, active, onClick }) {
    const on = open || active;
    return h('button', { onClick, style: {
      display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 999,
      border: on ? '1.5px solid var(--color-dark)' : '1px solid var(--border-strong)',
      background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: on ? 600 : 500,
      color: 'var(--text-primary)', whiteSpace: 'nowrap', boxShadow: on ? '0 1px 4px rgba(17,24,39,0.10)' : 'none',
    } },
      label,
      count > 0 && h('span', { style: { fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--color-dark)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } }, count),
      h('span', { style: { display: 'flex', color: 'var(--gray-400)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 120ms ease' } }, h(Icons.chevronDown, { size: 13 })));
  }

  function Popover({ children, onClose, width }) {
    return h('div', { style: { position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 60, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-popover)', width: width || 320, overflow: 'hidden' } }, children);
  }

  function CheckPopover({ options, selected, onToggle, onClear, onClose, twoCol, rangeNode }) {
    return h('div', null,
      h('div', { style: { maxHeight: 280, overflowY: 'auto', padding: '14px 18px', display: twoCol ? 'grid' : 'flex', gridTemplateColumns: twoCol ? '1fr 1fr' : undefined, flexDirection: twoCol ? undefined : 'column', gap: '12px 16px' } },
        options.map(opt => h(Checkbox, { key: opt, label: opt, checked: selected.includes(opt), onChange: () => onToggle(opt) }))),
      rangeNode && h('div', { style: { padding: '4px 18px 14px', borderTop: '1px solid var(--border-subtle)' } }, h('div', { style: { fontSize: 12, color: 'var(--gray-500)', margin: '10px 0 8px' } }, '自訂範圍'), rangeNode),
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid var(--border-subtle)' } },
        h('button', { onClick: onClear, style: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', textDecoration: 'underline' } }, '清除'),
        h('button', { onClick: onClose, style: { padding: '8px 18px', border: 'none', borderRadius: 999, background: 'var(--color-dark)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 } }, '套用')));
  }

  // 範圍輸入（膠囊下拉用）
  function RangeMini({ minVal, maxVal, onMin, onMax, unit }) {
    const inp = { flex: 1, width: '100%', padding: '7px 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 13, fontFamily: 'var(--font-mono)', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box' };
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      h('input', { type: 'number', placeholder: '最低', value: minVal, onChange: (e) => onMin(e.target.value), style: inp }),
      h('span', { style: { color: 'var(--gray-400)' } }, '-'),
      h('input', { type: 'number', placeholder: '最高', value: maxVal, onChange: (e) => onMax(e.target.value), style: inp }),
      h('span', { style: { fontSize: 13, color: 'var(--gray-600)' } }, unit));
  }

  function PillFilters({ f, setF, setArr, clear, category, onOpenAllFilters, activeCount }) {
    const [openPill, setOpenPill] = React.useState(null);
    const toggle = (key) => setOpenPill(p => p === key ? null : key);
    const close = () => setOpenPill(null);
    const wrap = (key, label, count, body, forceActive) => h('div', { style: { position: 'relative' } },
      h(Pill, { label, count, open: openPill === key, active: count > 0 || forceActive, onClick: () => toggle(key) }),
      openPill === key && h(Popover, { width: key === 'districts' ? 360 : 300 }, body));

    const dims = [
      ['districts', '區域', f.districts, M.FILTERS.districts, true],
      ['rent', '租金', f.rent, M.FILTERS.rent, false],
      ['area', '坪數', f.area, M.FILTERS.area, false],
      category === 'store' ? ['storeType', '店鋪類型', f.storeType, M.FILTERS.storeType, false] : null,
      ['buildingType', '型態', f.buildingType, M.FILTERS.buildingType, false],
      ['floor', '樓層', f.floor, M.FILTERS.floor, false],
      ['decoration', '裝潢', f.decoration, M.FILTERS.decoration, false],
      ['source', '來源', f.source, M.FILTERS.source, false],
    ].filter(Boolean);

    return h('div', { style: { position: 'relative' } },
      openPill && h('div', { onClick: close, style: { position: 'fixed', inset: 0, zIndex: 50 } }),
      h('div', { style: { position: 'relative', zIndex: 55, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '2px 0 4px' } },
        // city pill (single-select)
        h('div', { style: { position: 'relative', flexShrink: 0 } },
          h(Pill, { label: f.city || '縣市', count: 0, open: openPill === 'city', active: false, onClick: () => toggle('city') }),
          openPill === 'city' && h(Popover, { width: 160 },
            h('div', { style: { padding: 8 } }, ['台北市', '新北市'].map(c => h('button', { key: c, onClick: () => { setF(s => ({ ...s, city: c, districts: [] })); close(); }, style: { width: '100%', textAlign: 'left', padding: '9px 12px', border: 'none', borderRadius: 'var(--radius-md)', background: f.city === c ? 'var(--primary-100)' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: f.city === c ? 600 : 500, color: 'var(--text-primary)' } }, c))))),
        // dimension pills
        dims.map(([key, label, sel, opts, twoCol]) => h('div', { key: key, style: { flexShrink: 0 } },
          wrap(key, label, sel.length, h(CheckPopover, { options: opts, selected: sel, onToggle: (v) => setArr(key, v), onClear: () => { clear(key); if (key === 'rent') setF(s => ({ ...s, rentMin: '', rentMax: '' })); if (key === 'area') setF(s => ({ ...s, areaMin: '', areaMax: '' })); }, onClose: close, twoCol,
            rangeNode: key === 'rent' ? h(RangeMini, { minVal: f.rentMin, maxVal: f.rentMax, onMin: (v) => setF(s => ({ ...s, rentMin: v })), onMax: (v) => setF(s => ({ ...s, rentMax: v })), unit: '萬' })
              : key === 'area' ? h(RangeMini, { minVal: f.areaMin, maxVal: f.areaMax, onMin: (v) => setF(s => ({ ...s, areaMin: v })), onMax: (v) => setF(s => ({ ...s, areaMax: v })), unit: '坪' }) : null }), key === 'rent' ? !!(f.rentMin || f.rentMax) : key === 'area' ? !!(f.areaMin || f.areaMax) : false))),
        // sort pill
        h('div', { style: { position: 'relative', flexShrink: 0 } },
          h(Pill, { label: '排序：' + f.sort, count: 0, open: openPill === 'sort', active: f.sort !== '最新上架', onClick: () => toggle('sort') }),
          openPill === 'sort' && h(Popover, { width: 180 },
            h('div', { style: { padding: 8 } }, ['最新上架', '租金低到高', '租金高到低'].map(opt => h('button', { key: opt, onClick: () => { setF(s => ({ ...s, sort: opt })); close(); }, style: { width: '100%', textAlign: 'left', padding: '9px 12px', border: 'none', borderRadius: 'var(--radius-md)', background: f.sort === opt ? 'var(--primary-100)' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: f.sort === opt ? 600 : 500, color: 'var(--text-primary)' } }, opt)))))));
  }

  window.MTAPillFilters = PillFilters;
})();
