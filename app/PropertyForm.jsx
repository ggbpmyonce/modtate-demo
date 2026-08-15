/* Property add + edit forms (shared full field set + photo editing)
   window.MTAAddProperty, window.MTAEditProperty */
(function () {
  const h = React.createElement;
  const { Icons } = window.MTAUI;
  const { Button, Card, Input, Select, Checkbox, RadioGroup } = window.ModtateDesignSystem_410f4d;
  const M = window.MTA;
  const O = M.FORM_OPTIONS;

  // ── layout helpers ───────────────────────────────────────────
  const FormCard = ({ title, sub, children }) => h(Card, { padding: 24, style: { borderRadius: 'var(--radius-xl)' } },
    h('h3', { style: { fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: sub ? 4 : 20 } }, title),
    sub && h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginBottom: 16 } }, sub),
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } }, children));
  const row2 = (a, b) => h('div', { className: 'mta-form-2col', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } }, a, b);
  const row3 = (a, b, c) => h('div', { className: 'mta-form-3col', style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 } }, a, b, c);
  const Lbl = ({ children, req }) => h('span', { style: { fontSize: 13, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 6, display: 'block' } }, children, req && h('span', { style: { color: 'var(--error-500)', marginLeft: 2 } }, '*'));
  const ensure = (list, v) => (v && !list.includes(v)) ? [v, ...list] : list;

  // 平均租金 = 租金 / 權狀坪數（自動計算，唯讀）
  function AvgRentField({ rent, registeredArea }) {
    const [tip, setTip] = React.useState(false);
    const r = Number(rent) || 0, a = Number(registeredArea) || 0;
    const avg = (r > 0 && a > 0) ? Math.round(r / a) : null;
    return h('div', null,
      h('span', { style: { fontSize: 13, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 } },
        '平均租金',
        h('span', { style: { position: 'relative', display: 'inline-flex' } },
          h('span', { onMouseEnter: () => setTip(true), onMouseLeave: () => setTip(false), style: { fontSize: 12, fontWeight: 600, color: 'var(--info-700)', cursor: 'help' } }, '(說明)'),
          tip && h('span', { style: { position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, width: 280, background: 'var(--color-dark)', color: '#fff', fontSize: 12, fontWeight: 400, lineHeight: 1.7, padding: '10px 12px', borderRadius: 'var(--radius-md)', zIndex: 50, boxShadow: 'var(--shadow-popover)' } },
            '平均租金根據您發佈的房源數據計算得出。', h('br'),
            h('strong', { style: { fontWeight: 600 } }, '平均租金 = 租金 / 權狀坪數'), h('br'),
            '備註：以上租金與權狀坪數，皆已扣除車位數據。'))),
      h('div', { style: { display: 'flex', alignItems: 'center', background: 'var(--surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', padding: '0 14px', height: 44 } },
        h('span', { style: { flex: 1, fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 600, color: avg != null ? 'var(--text-primary)' : 'var(--gray-400)' } }, avg != null ? M.fmt(avg) : '—'),
        h('span', { style: { fontSize: 13, color: 'var(--gray-500)' } }, '元/坪/月')),
      h('p', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 6 } }, a > 0 ? '依權狀坪數自動計算' : '填寫「權狀坪數」後自動計算'));
  }

  // 車位（有車位要另租）— 入口方式 + 可逐筆新增車位（平面/機械、各自價格）
  // 提供設備 — 全選；中央空調整併冷氣系統；店面另有專屬清單＋自訂設備
  const AC_OPTS = O.acSystem;
  const TK_OPTS = ['獨立衛生間', '公共衛生間'];
  function FacilitiesPicker({ f, set, toggle, list, isStore }) {
    const [adding, setAdding] = React.useState(false);
    const [newName, setNewName] = React.useState('');
    const items = list || O.facilities;
    const customs = f.customFacilities || [];
    const acOn = !!f.acSystem && f.acSystem !== '無冷氣';
    const hasTK = items.includes('獨立衛生間');
    const tkOn = TK_OPTS.some(o => f.facilities.includes(o));
    const plain = items.filter(x => x !== '中央空調' && x !== '獨立衛生間').concat(customs);
    const allOn = acOn && (!hasTK || tkOn) && plain.every(x => f.facilities.includes(x));
    const setAll = () => {
      if (allOn) { set('facilities', []); set('acSystem', '無冷氣'); }
      else { set('facilities', plain.concat(hasTK ? [f.toiletKind || TK_OPTS[0]] : [])); if (!acOn) set('acSystem', AC_OPTS[0]); }
    };
    const setTK = (v) => { set('toiletKind', v); if (tkOn) set('facilities', f.facilities.filter(x => !TK_OPTS.includes(x)).concat([v])); };
    const addCustom = () => { const n = newName.trim(); if (n && !customs.includes(n)) { set('customFacilities', customs.concat([n])); set('facilities', f.facilities.concat([n])); } setNewName(''); setAdding(false); };
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '14px 16px', alignItems: 'center' } },
        h(Checkbox, { label: '全部', checked: allOn, onChange: setAll }),
        items.map(x => {
          if (x === '中央空調') return h('span', { key: x, style: { display: 'inline-flex', alignItems: 'center', gap: 8 } },
            h(Checkbox, { checked: acOn, onChange: () => set('acSystem', acOn ? '無冷氣' : AC_OPTS[0]) }),
            h('span', { style: { width: 190 } }, h(Select, { options: AC_OPTS, value: f.acSystem || AC_OPTS[0], onChange: (v) => set('acSystem', v) })));
          if (x === '獨立衛生間') return h('span', { key: x, style: { display: 'inline-flex', alignItems: 'center', gap: 8 } },
            h(Checkbox, { checked: tkOn, onChange: () => set('facilities', tkOn ? f.facilities.filter(y => !TK_OPTS.includes(y)) : f.facilities.concat([f.toiletKind || TK_OPTS[0]])) }),
            h('span', { style: { width: 160 } }, h(Select, { options: TK_OPTS, value: f.toiletKind || TK_OPTS[0], onChange: setTK })));
          return h(Checkbox, { key: x, label: x, checked: f.facilities.includes(x), onChange: () => toggle('facilities', x) });
        }),
        customs.map(x => h(Checkbox, { key: 'c-' + x, label: x, checked: f.facilities.includes(x), onChange: () => toggle('facilities', x) }))),
      isStore && h('div', { style: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' } },
        adding
          ? h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
              h('div', { style: { width: 240 } }, h(Input, { placeholder: '輸入設備名稱', autoFocus: true, value: newName, onChange: (e) => setNewName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') addCustom(); if (e.key === 'Escape') { setAdding(false); setNewName(''); } } })),
              h(Button, { variant: 'secondary', size: 'sm', onClick: addCustom }, '加入'))
          : h('button', { type: 'button', onClick: () => setAdding(true), style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid var(--border-strong)', borderRadius: 999, background: '#fff', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', cursor: 'pointer', fontFamily: 'inherit' } }, h(Icons.plus, { size: 14, stroke: 2 }), '添加其他設備'),
        h('span', { style: { fontSize: 12, color: '#B45309' } }, '勾選所含的設備，能提升該店面的價格競爭力')));
  }

  // 適合行業（店面）— 大類＋經營類目，多列
  function SuitIndustries({ f, set }) {
    const CATS = Object.keys(M.FORM_OPTIONS.storeIndustryCats || {});
    const SUBS = M.FORM_OPTIONS.storeIndustryCats || {};
    const [showAll, setShowAll] = React.useState(false);
    const unlimited = f.suitUnlimited === true;
    const rows = f.suitIndustries && f.suitIndustries.length ? f.suitIndustries : [{ cat: '', sub: '' }];
    const setRows = (v) => set('suitIndustries', v);
    const setRow = (i, key, val) => setRows(rows.map((r, x) => x === i ? { ...r, [key]: val, ...(key === 'cat' ? { sub: '' } : {}) } : r));
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' } },
        h(Checkbox, { label: '不限', checked: unlimited, onChange: () => set('suitUnlimited', !unlimited) }),
        !unlimited && rows.map((r, i) => h('span', { key: i, style: { display: 'inline-flex', alignItems: 'center', gap: 8 } },
          h('span', { style: { width: 140 } }, h(Select, { options: CATS, value: r.cat, placeholder: '請選擇行業', onChange: (v) => setRow(i, 'cat', v) })),
          h('span', { style: { width: 170, opacity: r.cat ? 1 : 0.55, pointerEvents: r.cat ? 'auto' : 'none' } }, h(Select, { options: SUBS[r.cat] || [], value: r.sub, placeholder: '請選擇經營類目', onChange: (v) => setRow(i, 'sub', v) })),
          rows.length > 1 && h('button', { type: 'button', onClick: () => setRows(rows.filter((_, x) => x !== i)), title: '移除', style: { width: 32, height: 32, borderRadius: 999, border: '1px solid var(--error-200)', background: '#fff', color: 'var(--error-500)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } }, h(Icons.close, { size: 13 })))),
        !unlimited && h('button', { type: 'button', onClick: () => setRows([...rows, { cat: '', sub: '' }]), title: '新增行業', style: { width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border-strong)', background: '#fff', color: 'var(--gray-700)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } }, h(Icons.plus, { size: 15, stroke: 2 })),
        h('button', { type: 'button', onClick: () => setShowAll(v => !v), style: { border: 'none', background: 'none', padding: 0, fontSize: 13, fontWeight: 600, color: 'var(--info-600, #1570EF)', cursor: 'pointer', fontFamily: 'inherit' } }, showAll ? '收合可選行業' : '查看可選行業'),
        h('span', { style: { fontSize: 12, color: '#B45309' } }, '填寫該店面適合的行業，能幫您快速過濾無效租客')),
      showAll && h('div', { style: { padding: '12px 16px', background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 6 } },
        CATS.map(c => h('div', { key: c, style: { fontSize: 12.5, lineHeight: 1.7 } },
          h('span', { style: { fontWeight: 700, color: 'var(--text-primary)', marginRight: 8 } }, c),
          h('span', { style: { color: 'var(--gray-500)' } }, (SUBS[c] || []).join('、'))))));
  }

  function ParkingSpaces({ f, set, noPrice }) {
    const ENTRY = ['坡道', '機械', '露天'];
    const outdoor = f.parkingEntry === '露天';
    const spaces = f.parkingSpaces && f.parkingSpaces.length ? f.parkingSpaces : [{ kind: '平面', price: '' }];
    const update = (next) => set('parkingSpaces', next);
    const setEntry = (v) => { set('parkingEntry', v); if (v === '露天') update(spaces.map(s => ({ ...s, kind: '平面' }))); };
    const setSpace = (i, key, val) => update(spaces.map((s, x) => x === i ? { ...s, [key]: val } : s));
    const addSpace = () => update([...spaces, { kind: outdoor ? '平面' : '平面', price: '' }]);
    const removeSpace = (i) => update(spaces.filter((_, x) => x !== i));
    return h('div', { style: { padding: '14px 16px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 14 } },
      h('div', { style: { maxWidth: 280 } }, h(Lbl, { req: true }, '車位入口方式'),
        h(Select, { options: ENTRY, value: f.parkingEntry, onChange: setEntry }),
        outdoor && h('p', { style: { fontSize: 12, color: 'var(--gray-500)', marginTop: 6 } }, '露天車位僅提供平面車位')),
      h('div', null,
        h(Lbl, { req: true }, noPrice ? '車位明細（可逐筆新增）' : '車位明細（可逐筆新增，價格可不同）'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          spaces.map((s, i) => h('div', { key: i, style: { display: 'flex', gap: 10, alignItems: 'center' } },
            h('div', { style: { width: 130, flexShrink: 0 } }, h(Select, { options: outdoor ? ['平面'] : ['平面', '機械'], value: s.kind, onChange: (v) => setSpace(i, 'kind', v) })),
            !noPrice && h('div', { style: { flex: 1 } }, h(Input, { type: 'number', placeholder: '月租金（元/月），例：5000', value: s.price, onChange: (e) => setSpace(i, 'price', e.target.value) })),
            spaces.length > 1 && h('button', { type: 'button', onClick: () => removeSpace(i), title: '移除', style: { flexShrink: 0, width: 36, height: 36, borderRadius: 999, border: '1px solid var(--error-200)', background: '#fff', color: 'var(--error-500)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, h(Icons.close, { size: 15 }))))),
        h('button', { type: 'button', onClick: addSpace, style: { marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px dashed var(--border-strong)', borderRadius: 999, background: '#fff', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', cursor: 'pointer', fontFamily: 'inherit' } }, h(Icons.plus, { size: 14, stroke: 2 }), '新增車位')));
  }

  // 所有權人 — 可逐筆新增（稱呼 + 先生/小姐 非必填）
  function OwnerRows({ owners, setOwners }) {
    const setRow = (i, key, val) => setOwners(owners.map((o, x) => x === i ? { ...o, [key]: val } : o));
    const add = () => setOwners([...owners, { name: '', honorific: '' }]);
    const remove = (i) => setOwners(owners.filter((_, x) => x !== i));
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
      owners.map((o, i) => h('div', { key: i, style: { display: 'flex', gap: 10, alignItems: 'flex-end' } },
        h('div', { style: { flex: 1 } }, h(Lbl, { req: i === 0 }, '所有權人' + (owners.length > 1 ? ` ${i + 1}` : '')),
          h(Input, { placeholder: '可輸入人名或公司行號，例：王 或 鉅睿國際科技', value: o.name, onChange: (e) => setRow(i, 'name', e.target.value) })),
        h('div', { style: { width: 130, flexShrink: 0 } }, h(Lbl, null, '先生／小姐'),
          h(Select, { options: O.honorific, value: o.honorific, placeholder: '（非必填）', onChange: (v) => setRow(i, 'honorific', v) })),
        owners.length > 1 && h('button', { type: 'button', onClick: () => remove(i), title: '移除', style: { flexShrink: 0, width: 42, height: 42, borderRadius: 999, border: '1px solid var(--error-200)', background: '#fff', color: 'var(--error-500)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, h(Icons.close, { size: 15 })))),
      h('button', { type: 'button', onClick: add, style: { alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px dashed var(--border-strong)', borderRadius: 999, background: '#fff', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', cursor: 'pointer', fontFamily: 'inherit' } }, h(Icons.plus, { size: 14, stroke: 2 }), '新增所有權人'));
  }

  // 聯絡資訊 — 可逐筆新增（身份 + 先生/小姐 + 稱呼 + 電話）
  function ContactRows({ contacts, setContacts }) {
    const setRow = (i, key, val) => setContacts(contacts.map((c, x) => x === i ? { ...c, [key]: val } : c));
    const add = () => setContacts([...contacts, { identity: '所有權人', identityOther: '', honorific: '先生', surname: '', phone: '' }]);
    const remove = (i) => setContacts(contacts.filter((_, x) => x !== i));
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 18 } },
      contacts.map((c, i) => h('div', { key: i, style: { display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: contacts.length > 1 ? 16 : 0, borderBottom: (contacts.length > 1 && i < contacts.length - 1) ? '1px solid var(--border-subtle)' : 'none' } },
        contacts.length > 1 && h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
          h('span', { style: { fontSize: 13, fontWeight: 600, color: 'var(--gray-500)' } }, '聯絡人 ' + (i + 1)),
          h('button', { type: 'button', onClick: () => remove(i), title: '移除', style: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', border: '1px solid var(--error-200)', borderRadius: 999, background: '#fff', color: 'var(--error-500)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, h(Icons.close, { size: 13 }), '移除')),
        h('div', { className: 'mta-form-2col', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
          h('div', null, h(Lbl, { req: i === 0 }, '聯絡人身份'),
            h(Select, { options: ensure(O.contactIdentity, c.identity === '其他（自訂）' ? null : c.identity).concat(['其他（自訂）']), value: c.identity, onChange: (v) => setRow(i, 'identity', v) }),
            c.identity === '其他（自訂）' && h('div', { style: { marginTop: 8 } }, h(Input, { placeholder: '請輸入聯絡人身份', value: c.identityOther, onChange: (e) => setRow(i, 'identityOther', e.target.value) }))),
          h('div', null, h(Lbl, { req: i === 0 }, '先生/小姐'), h(Select, { options: O.honorific, value: c.honorific, onChange: (v) => setRow(i, 'honorific', v) }))),
        h('div', { className: 'mta-form-2col', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
          h('div', null, h(Lbl, { req: i === 0 }, '聯絡人姓氏（稱呼）'), h(Input, { placeholder: '例：王', value: c.surname, onChange: (e) => setRow(i, 'surname', e.target.value) })),
          h('div', null, h(Lbl, { req: i === 0 }, '聯絡人電話'), h(Input, { placeholder: '例：0918-888-888 或 02-2501-1234#133', value: c.phone, onChange: (e) => setRow(i, 'phone', window.MTAUI.fmtPhone(e.target.value)) }),
            h('p', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 5 } }, '自動加「-」；分機請用 #，例：02-2501-1234#133'))))),
      h('button', { type: 'button', onClick: add, style: { alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px dashed var(--border-strong)', borderRadius: 999, background: '#fff', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', cursor: 'pointer', fontFamily: 'inherit' } }, h(Icons.plus, { size: 14, stroke: 2 }), '新增聯絡人'));
  }

  function PageHeader({ title, sub, idTag, onBack, crumbs }) {
    return h('div', null,
      crumbs && h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-400)', marginBottom: 8 } },
        crumbs.map((c, i) => h(React.Fragment, { key: i },
          i > 0 && h(Icons.chevronRight, { size: 14 }),
          h('span', { onClick: i < crumbs.length - 1 && c.onClick ? c.onClick : null, style: { cursor: i < crumbs.length - 1 && c.onClick ? 'pointer' : 'default', fontWeight: i === crumbs.length - 1 ? 600 : 500, color: i === crumbs.length - 1 ? 'var(--text-primary)' : 'var(--gray-500)' } }, c.label)))),
      h('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 } },
        h('div', null,
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
            h('h1', { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' } }, title),
            idTag && h('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 } }, '#' + idTag)),
          h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 4 } }, sub)),
        h(Button, { variant: 'outline', size: 'sm', iconLeft: h(Icons.arrowLeft, { size: 13 }), onClick: onBack }, '返回列表')));
  }

  // ── Photo editor (existing + new, watermark on new uploads) ──
  function PhotoEditor({ photos, setPhotos }) {
    const wmRef = React.useRef(null);
    React.useEffect(() => { const wm = new Image(); wm.crossOrigin = 'anonymous'; wm.onload = () => { wmRef.current = wm; }; wm.src = (window.__resources && window.__resources.watermark) || 'app/watermark.png'; }, []);
    const applyWm = (file) => new Promise(res => {
      const reader = new FileReader();
      reader.onload = (e) => { const img = new Image(); img.onload = () => {
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
        const wm = wmRef.current; if (wm) { const w = img.width * 0.4, hh = w * (wm.height / wm.width); ctx.globalAlpha = 0.55; ctx.drawImage(wm, (img.width - w) / 2, (img.height - hh) / 2, w, hh); ctx.globalAlpha = 1; }
        res({ src: c.toDataURL('image/jpeg', 0.92), name: file.name, isNew: true });
      }; img.src = e.target.result; }; reader.readAsDataURL(file);
    });
    const onUpload = async (e) => { const files = Array.from(e.target.files || []); if (photos.length + files.length > 15) { alert('最多上傳 15 張照片'); return; } const done = await Promise.all(files.map(applyWm)); setPhotos(p => [...p, ...done]); e.target.value = ''; };
    const remove = (i) => setPhotos(ph => ph.filter((_, x) => x !== i));
    const makeCover = (i) => setPhotos(ph => { if (i === 0) return ph; const copy = [...ph]; const [it] = copy.splice(i, 1); return [it, ...copy]; });
    return h(Card, { padding: 24, style: { borderRadius: 'var(--radius-xl)' } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 } },
        h('h3', { style: { fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }, '照片（最多 15 張）'),
        h('span', { style: { fontSize: 12, color: 'var(--gray-400)' } }, `${photos.length} / 15 張`)),
      h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginBottom: 16 } }, '支援 JPG、PNG，單張 25MB 以內。新上傳的照片會自動加上京安浮水印。第一張為封面照。'),
      h('label', { style: { display: 'block', border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', padding: '28px 24px', textAlign: 'center', cursor: 'pointer' } },
        h('input', { type: 'file', accept: 'image/jpeg,image/png', multiple: true, onChange: onUpload, style: { display: 'none' } }),
        h('div', { style: { display: 'flex', justifyContent: 'center', marginBottom: 10, color: 'var(--gray-400)' } }, h(Icons.upload, { size: 30 })),
        h('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' } }, '點擊上傳照片'),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 4 } }, 'JPG、PNG，可一次選多張，自動加上浮水印')),
      photos.length > 0 && h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 16 } },
        photos.map((p, i) => h('div', { key: i, style: { position: 'relative', borderRadius: 8, overflow: 'hidden', background: 'var(--gray-100)' } },
          h('img', { src: p.src, style: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' } }),
          i === 0 && h('span', { style: { position: 'absolute', bottom: 6, left: 6, fontSize: 10, fontWeight: 700, color: '#fff', background: 'var(--color-dark)', padding: '2px 7px', borderRadius: 999 } }, '封面'),
          p.isNew && h('span', { style: { position: 'absolute', top: 6, left: 6, fontSize: 10, fontWeight: 700, color: 'var(--color-dark)', background: 'rgba(255,255,255,0.92)', padding: '2px 7px', borderRadius: 999 } }, '新'),
          h('div', { style: { position: 'absolute', top: 6, right: 6, display: 'flex', gap: 4 } },
            i !== 0 && h('button', { onClick: () => makeCover(i), title: '設為封面', style: photoBtn }, h(Icons.check, { size: 12, stroke: 2.4 })),
            h('button', { onClick: () => remove(i), title: '刪除', style: photoBtn }, h(Icons.close, { size: 12, stroke: 2.4 })))))));
  }
  const photoBtn = { width: 22, height: 22, borderRadius: 999, background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 };

  // ── initial form state ───────────────────────────────────────
  function blankForm() {
    return {
      buildingName: '', city: '台北市', district: '', address: '', rentFloor: '', totalFloor: '',
      propType: '電梯大樓', propClass: '純辦', status: '招租中',
      usableArea: '', registeredArea: '', mainArea: '', accessoryArea: '', areaBasis: '使用坪數', bizReg: '是', partition: '視情況而定', seatMin: '', seatMax: '',
      rent: '', deposit: '面議', depositOther: '', mgmt: '', agencyFee: '', taxType: '未稅(個人)', minLease: '1年', minLeaseOther: '', freeRent: '無', freeRentOther: '', decoration: '簡易裝潢',
      facilities: [], customFacilities: [], toiletKind: '獨立衛生間', toilet: '廁內', acSystem: '獨立冷氣', acHours: '', parking: '無車位', parkingRent: '', parkingCount: '', parkingEntry: '坡道', parkingSpaces: [{ kind: '平面', price: '' }], ceilingH: '', passengerLift: '', cargoLift: '', propMgmtCompany: '',
      industries: [], suitUnlimited: false, suitIndustries: [], mrt: '', mrtLine: '', phonePosted: '否', selfListed: '否', selfListedWhere: '',
      hasTenant: '無', leaseUntil: '',
      storeType: '商業街店面', storeRoadWidth: '', storeBizStatus: '空置中', storeTraffic: [], bannedIndustries: [],
      owners: [{ name: '', honorific: '' }],
      contactIdentity: '所有權人', contactIdentityOther: '', honorific: '先生', contactSurname: '', contactPhone: '',
      contacts: [{ identity: '所有權人', identityOther: '', honorific: '先生', surname: '', phone: '' }],
      remark: '',
    };
  }
  const STATUS_TO_LABEL = { listing: '招租中', negotiating: '洽談中', deposited: '已收定', preparing: '準備簽約', signed: '已簽約出租' };
  const LABEL_TO_STATUS = { '招租中': 'listing', '洽談中': 'negotiating', '已收定': 'deposited', '準備簽約': 'preparing', '已簽約出租': 'signed' };
  function fromProperty(p) {
    const f = blankForm();
    const dm = (p.address || '').match(/[市縣](.{2,4}區)/);
    const honor = (p.contactName || '').includes('小姐') ? '小姐' : '先生';
    return {
      ...f,
      buildingName: p.name, district: dm ? dm[1] : '', address: p.address,
      rentFloor: (p.floor || '').replace(/F.*/i, ''), propType: p.type, propClass: p.propClass || '純辦', status: STATUS_TO_LABEL[p.status] || '招租中',
      usableArea: p.area, rent: p.rent, mgmt: /^[0-9]/.test(p.mgmt) ? p.mgmt.replace(/,/g, '') : '',
      taxType: (p.tax || '').includes('含稅') ? '含稅(個人)' : '未稅(個人)',
      acSystem: p.ac === '無' ? '無冷氣' : p.ac, acHours: p.acHours || '', parking: p.parking, parkingRent: p.parkingRent || '', parkingCount: p.parkingCount || '', parkingEntry: p.parkingEntry || '坡道', parkingSpaces: (p.parkingSpaces && p.parkingSpaces.length) ? p.parkingSpaces : [{ kind: '平面', price: p.parkingRent || '' }], mrt: p.mrt,
      mrtLine: p.mrtLine || Object.keys(M.MRT_LINES).find(l => M.MRT_LINES[l].some(s => (p.mrt || '').startsWith(s))) || '',
      contactIdentity: (p.contactRole === '屋主' ? '所有權人' : p.contactRole), honorific: honor, contactSurname: (p.contactName || '').replace(/(先生|小姐)$/, ''), contactPhone: p.phone,
      hasTenant: p.hasTenant || '無', leaseUntil: p.leaseUntil || '',
      owners: (p.owners && p.owners.length) ? p.owners : [{ name: '', honorific: '' }],
      contacts: (p.contacts && p.contacts.length) ? p.contacts : [{ identity: (p.contactRole === '屋主' ? '所有權人' : p.contactRole) || '所有權人', identityOther: '', honorific: honor, surname: (p.contactName || '').replace(/(先生|小姐)$/, ''), phone: p.phone || '' }],
    };
  }
  // map back to the record fields used by list/detail
  function toProperty(f) {
    const seats = (f.seatMin || f.seatMax) ? `${f.seatMin || '?'}–${f.seatMax || '?'} 個` : '';
    return {
      name: f.buildingName, address: (f.address || '').includes(f.city) ? f.address : (f.city || '') + (f.district || '') + (f.address || ''), type: f.propType, propClass: f.propClass, floor: f.rentFloor ? (f.rentFloor + 'F') : '',
      area: Number(f.usableArea) || 0, rent: Number(f.rent) || 0, mgmt: f.mgmt ? f.mgmt : '現場問',      mrt: f.mrt, tax: f.taxType.includes('含稅') ? '含稅' : '未稅',
      ac: f.acSystem === '無冷氣' ? '無' : f.acSystem, acHours: (f.acSystem || '').includes('中央空調') ? f.acHours : '', parking: f.parking, parkingRent: f.parking === '有車位要另租' ? f.parkingRent : '', parkingCount: f.parking === '租金含車位' ? f.parkingCount : '', parkingEntry: f.parking === '有車位要另租' ? f.parkingEntry : '', parkingSpaces: f.parking === '有車位要另租' ? (f.parkingSpaces || []).filter(s => s.price || s.kind) : [], status: LABEL_TO_STATUS[f.status] || 'negotiating',
      ownerSurname: f.ownerSurname, ownerHonorific: f.ownerHonorific, ownerCompany: f.ownerCompany, owners: (f.owners || []).filter(o => (o.name || '').trim()),
      contactRole: f.contactIdentity === '其他（自訂）' ? (f.contactIdentityOther || '其他') : f.contactIdentity, contactName: (f.contactSurname || '') + (f.honorific || ''), phone: f.contactPhone,
      contacts: (f.contacts || []).filter(c => (c.surname || '').trim() || (c.phone || '').trim()).map(c => ({ identity: c.identity === '其他（自訂）' ? (c.identityOther || '其他') : c.identity, honorific: c.honorific, surname: c.surname, phone: c.phone })),
      // extended fields surfaced read-only in the detail view
      mrtLine: f.mrtLine,
      hasTenant: f.hasTenant, leaseUntil: f.hasTenant === '有' ? f.leaseUntil : '',
      totalFloor: f.totalFloor ? (f.totalFloor + 'F') : '', areaBasis: f.areaBasis, bizReg: f.bizReg, partition: f.partition, seats,
      registeredArea: f.registeredArea ? (f.registeredArea + ' 坪') : '', mainArea: f.mainArea ? (f.mainArea + ' 坪') : '', accessoryArea: f.accessoryArea ? (f.accessoryArea + ' 坪') : '',
      deposit: f.deposit === '其他（自訂）' ? (f.depositOther || '其他') : f.deposit, minLease: f.minLease === '其他（自訂）' ? (f.minLeaseOther || '其他') : f.minLease, freeRent: f.freeRent === '其他' ? (f.freeRentOther || '其他') : f.freeRent, decoration: f.decoration,
      toiletKind: f.toiletKind, toilet: f.toiletKind + '・' + f.toilet, ceilingH: f.ceilingH ? (f.ceilingH + ' 米') : '', passengerLift: f.passengerLift ? (f.passengerLift + ' 部') : '', cargoLift: f.cargoLift ? (f.cargoLift + ' 部') : '',
      propMgmtCompany: f.propMgmtCompany, phonePosted: f.phonePosted, selfListed: f.selfListed, selfListedWhere: f.selfListed === '是' ? f.selfListedWhere : '', industries: M.STORE_TYPES.includes(f.propType) ? (f.suitUnlimited ? ['不限'] : (f.suitIndustries || []).filter(r => r.sub).map(r => r.cat + '／' + r.sub)) : f.industries, facilities: f.facilities, remark: f.remark, agencyFee: f.agencyFee,
      storeType: f.storeType, storeRoadWidth: f.storeRoadWidth ? (f.storeRoadWidth + ' 米') : '', storeBizStatus: f.storeBizStatus, storeTraffic: f.storeTraffic, bannedIndustries: f.bannedIndustries,
    };
  }

  // ── the full shared field set ────────────────────────────────
  function Fields({ f, set, toggle, setMany, canContacts, isStore, photos, setPhotos, docs, setDocs, typeOptions }) {
    const sel = (label, req, options, key, placeholder) => h('div', null, h(Lbl, { req }, label), h(Select, { options, value: f[key], onChange: (v) => set(key, v), placeholder }));
    const inp = (label, req, key, props) => h('div', null, h(Lbl, { req }, label), h(Input, Object.assign({ value: f[key], onChange: (e) => set(key, e.target.value) }, props || {})));
    const radioRow = (label, req, options, key) => h('div', null, h(Lbl, { req }, label), h(RadioGroup, { options, value: f[key], onChange: (v) => set(key, v), direction: 'row', gap: 24, style: { flexWrap: 'wrap' } }));
    return h(React.Fragment, null,
      // 基本資訊
      h(FormCard, { title: '基本資訊' },
        inp('大樓名稱', true, 'buildingName', { placeholder: '例：信義之星大樓' }),
        row2(sel('縣市', true, O.city, 'city'), sel('行政區', true, ensure(O.district, f.district), 'district', '選擇行政區')),
        row2(inp('地址', true, 'address', { placeholder: '例：信義路五段7號' }), inp('總樓層', false, 'totalFloor', { type: 'number', placeholder: '例：20' })),
        !isStore
          ? row3(sel('房屋型態', true, typeOptions, 'propType'), sel('狀態', true, O.status, 'status'), sel('類別', true, M.FILTERS.propClass, 'propClass'))
          : row2(sel('房屋型態', true, typeOptions, 'propType'), sel('狀態', true, O.status, 'status')),
        row2(radioRow('是否有租客', true, ['無', '有'], 'hasTenant'),
          f.hasTenant === '有' ? inp('租約到期', false, 'leaseUntil', { placeholder: '例：2026/12/31 或 明年6月底' }) : h('div', null))),
      // 坪數與格局
      h(FormCard, { title: '坪數與格局' },
        h('div', null, h(Lbl, { req: true }, '可使用坪數（坪）'), h(Input, { type: 'number', placeholder: '例：65', value: f.usableArea, onChange: (e) => set('usableArea', e.target.value) })),
        row3(inp('權狀坪數（坪）', true, 'registeredArea', { type: 'number', placeholder: '例：80' }), inp('主建物坪數（坪）', true, 'mainArea', { type: 'number', placeholder: '例：55' }), inp('附屬建物坪數（坪）', true, 'accessoryArea', { type: 'number', placeholder: '例：10' })),
        row2(sel('可工商登記', true, O.bizReg, 'bizReg'), sel('可隔間', true, O.partition, 'partition')),
        h('div', null, h(Lbl, null, '可容納工位數'),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
            h('div', { style: { flex: 1, minWidth: 90 } }, h(Input, { type: 'number', placeholder: '最少', value: f.seatMin, onChange: (e) => set('seatMin', e.target.value) })),
            h('span', { style: { color: 'var(--gray-400)' } }, '—'),
            h('div', { style: { flex: 1, minWidth: 90 } }, h(Input, { type: 'number', placeholder: '最多', value: f.seatMax, onChange: (e) => set('seatMax', e.target.value) })),
            h('span', { style: { color: 'var(--gray-600)', fontSize: 14, whiteSpace: 'nowrap' } }, '個'),
            h(Checkbox, { label: '系統預估', checked: !!f.seatEstimate, onChange: () => {
              const on = !f.seatEstimate; const a = Number(f.registeredArea) || 0;
              if (on && a > 0) { setMany({ seatEstimate: true, seatMin: String(Math.floor(a / 2.8)), seatMax: String(Math.floor(a / 2)) }); }
              else if (on) { set('seatEstimate', true); }
              else { set('seatEstimate', false); }
            } })),
          h('p', { style: { fontSize: 12, color: f.seatEstimate && !(Number(f.registeredArea) > 0) ? 'var(--error-500)' : 'var(--gray-400)', marginTop: 6 } },
            f.seatEstimate && !(Number(f.registeredArea) > 0)
              ? '請先填寫「權狀坪數」才能系統預估'
              : '依權狀坪數 / 工位坪數所得，普通工位 2.8 坪 ～ 最小工位 2 坪，僅供參考'))),
      // 租金
      h(FormCard, { title: '租金' },
        row2(inp('租金（元/月）', true, 'rent', { type: 'number', placeholder: '例：45000' }),
          sel('未稅/含稅', true, O.taxType, 'taxType')),
        row2(h('div', null, h(Lbl, { req: true }, '押金'),
            h(Select, { options: O.deposit.concat(['其他（自訂）']), value: f.deposit, onChange: (v) => set('deposit', v) }),
            f.deposit === '其他（自訂）' && h('div', { style: { marginTop: 8 } }, h(Input, { placeholder: '請輸入押金，例：1.5個月或 NT$50,000', value: f.depositOther, onChange: (e) => set('depositOther', e.target.value) }))),
          inp('管理費（元/月）', false, 'mgmt', { type: 'number', placeholder: '例：4500（無則留空）' })),
        inp('仲介費', false, 'agencyFee', { placeholder: '例：月租 0.5 個月 或 NT$30,000（無則留空）' }),
        h(AvgRentField, { rent: f.rent, registeredArea: f.registeredArea }),
        h('div', { className: 'mta-form-2col', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
          h('div', null, h(Lbl, { req: true }, '最短租期'),
            h(Select, { options: O.minLease.concat(['其他（自訂）']), value: f.minLease, onChange: (v) => set('minLease', v) }),
            f.minLease === '其他（自訂）' && h('div', { style: { marginTop: 8 } }, h(Input, { placeholder: '請輸入最短租期，例：2年或 18個月', value: f.minLeaseOther, onChange: (e) => set('minLeaseOther', e.target.value) }))),
          h('div', null, h(Lbl, null, '免租期'),
            h(Select, { options: O.freeRent, value: f.freeRent, onChange: (v) => set('freeRent', v) }),
            f.freeRent === '其他' && h('div', { style: { marginTop: 8 } }, h(Input, { placeholder: '請輸入免租期，例：3週', value: f.freeRentOther, onChange: (e) => set('freeRentOther', e.target.value) })))),
        h('div', null, h(Lbl, { req: true }, '裝潢程度'), h(RadioGroup, { options: O.decoration, value: f.decoration, onChange: (v) => set('decoration', v), direction: 'row', gap: 24, style: { flexWrap: 'wrap' } }))),
      // 設備與設施
      h(FormCard, { title: '設備與設施' },
        h('div', null, h(Lbl, null, '提供設備'), h(FacilitiesPicker, { f, set, toggle, list: isStore ? O.storeFacilities : null, isStore })),
        row3(h('div', null, h(Lbl, { req: true }, '廁所'), h(Select, { options: ['獨立衛生間', '公共衛生間'], value: f.toiletKind, onChange: (v) => set('toiletKind', v) })), h('div', null, h(Lbl, null, '\u00a0'), h(Select, { options: O.toilet, value: f.toilet, onChange: (v) => set('toilet', v) })), sel('車位', true, ensure(O.parking, f.parking), 'parking')),
        f.parking === '有車位要另租' && h(ParkingSpaces, { f, set }),
        f.parking === '租金含車位' && h(ParkingSpaces, { f, set, noPrice: true }),
        (f.acSystem || '').includes('中央空調') && h('div', null, h(Lbl, { req: true }, '中央空調供應時間'), h(Input, { placeholder: '例：週一至週五 08:00–18:00（加班需另計）', value: f.acHours, onChange: (e) => set('acHours', e.target.value) })),
        row3(inp('層高（米）', false, 'ceilingH', { type: 'number', placeholder: '例：3.2' }), inp('客梯（部）', false, 'passengerLift', { type: 'number', placeholder: '例：2' }), inp('貨梯（部）', false, 'cargoLift', { type: 'number', placeholder: '例：1' })),
        inp('物業公司', false, 'propMgmtCompany', { placeholder: '請輸入物業公司名稱' })),
      // 店面資訊（出租店面專屬）
      isStore && h(FormCard, { title: '店面資訊' },
        inp('臨路路寬（米）', false, 'storeRoadWidth', { type: 'number', placeholder: '限填入數字' }),
        radioRow('類型', true, O.storeType, 'storeType'),
        radioRow('經營狀態', false, O.storeBizStatus, 'storeBizStatus'),
        h('div', null, h(Lbl, null, '客流人群'), h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 16 } }, O.storeTraffic.map(x => h(Checkbox, { key: x, label: x, checked: f.storeTraffic.includes(x), onChange: () => toggle('storeTraffic', x) })))),
        h('div', null, h(Lbl, null, '禁用行業'), h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 16 } }, O.bannedIndustries.map(x => h(Checkbox, { key: x, label: x, checked: f.bannedIndustries.includes(x), onChange: () => toggle('bannedIndustries', x) })))),
        // 適合行業（店面：大類＋經營類目）
        h('div', { style: { paddingTop: 4, borderTop: '1px solid var(--border-subtle)', marginTop: 4 } },
          h(Lbl, null, '適合行業'),
          h(SuitIndustries, { f, set }))),
      // 適合行業（辦公：獨立卡片）
      !isStore && h(Card, { padding: 24, style: { borderRadius: 'var(--radius-xl)' } },
        h('h3', { style: { fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 } }, '適合行業'),
        h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginBottom: 16 } }, '填寫適合的辦公行業，能幫您快速過濾無效租客'),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 14 } }, O.industries.map(x => h(Checkbox, { key: x, label: x, checked: f.industries.includes(x), onChange: () => toggle('industries', x) })))),
      // 附近交通
      h(FormCard, { title: '附近交通' },
        row2(
          h('div', null, h(Lbl, null, '捷運路線'),
            h(Select, { options: Object.keys(M.MRT_LINES), value: f.mrtLine, placeholder: '選擇捷運線', onChange: (v) => setMany({ mrtLine: v, mrt: '' }) })),
          h('div', null, h(Lbl, null, '最近捷運站'),
            f.mrtLine
              ? h(Select, { options: M.MRT_LINES[f.mrtLine].map(s => s + '站'), value: f.mrt, placeholder: '選擇捷運站', onChange: (v) => set('mrt', v) })
              : h(Select, { options: [], value: '', placeholder: '請先選擇捷運路線', onChange: () => {} })))),
      // 所有權人 (老闆專屬)
      canContacts && h(FormCard, { title: '所有權人' },
        h(OwnerRows, { owners: f.owners && f.owners.length ? f.owners : [{ name: '', honorific: '' }], setOwners: (v) => set('owners', v) })),
      // 聯絡資訊 (老闆專屬)
      canContacts && h(FormCard, { title: '聯絡資訊' },
        h(ContactRows, { contacts: f.contacts && f.contacts.length ? f.contacts : [{ identity: '所有權人', identityOther: '', honorific: '先生', surname: '', phone: '' }], setContacts: (v) => set('contacts', v) }),
        h('div', { style: { marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 14 } },
          h('div', null, h(Lbl, null, '現場是否有張貼屋主電話'), h(RadioGroup, { options: ['是', '否'], value: f.phonePosted, onChange: (v) => set('phonePosted', v), direction: 'row', gap: 24 })),
          h('div', null, h(Lbl, null, '屋主是否有自行刊登 591 或其他平台'), h(RadioGroup, { options: ['是', '否'], value: f.selfListed, onChange: (v) => set('selfListed', v), direction: 'row', gap: 24 })),
          f.selfListed === '是' && h('div', { style: { maxWidth: 420 } }, h(Lbl, null, '刊登平台'), h(Input, { placeholder: '例：591、樂屋網、自售看板', value: f.selfListedWhere, onChange: (e) => set('selfListedWhere', e.target.value) })))),
      // 照片
      h(PhotoEditor, { photos, setPhotos }),
      // 產權文件
      h(DocEditor, { docs, setDocs }),
      // 備註
      h(FormCard, { title: '備註／重要資訊（內部使用）' },
        h('textarea', { value: f.remark, onChange: (e) => set('remark', e.target.value), placeholder: '記錄業主特殊要求、議價空間、注意事項等重要資訊...', style: { padding: '10px 14px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--text-primary)', width: '100%', minHeight: 100, resize: 'vertical' } })));
  }

  // ── 產權文件編輯器（使用分區/使用執照/地籍圖 · 內部限定）──
  const fmtKB2 = (kb) => kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : Math.round(kb) + ' KB';
  function DocEditor({ docs, setDocs }) {
    const CATS = M.DOC_CATS;
    const [cat, setCat] = React.useState(CATS[0]);
    const [customCat, setCustomCat] = React.useState('');
    const [drag, setDrag] = React.useState(false);
    const inputRef = React.useRef(null);
    const useCatOf = () => cat === '其他' ? (customCat.trim() || '其他') : cat;
    const addFiles = (files) => {
      const list = Array.from(files || []).filter(x => /pdf|image/.test(x.type) || /\.(pdf|png|jpe?g)$/i.test(x.name));
      if (!list.length) { if (window.MTAToastFlash) window.MTAToastFlash('僅支援 PDF 或圖片檔', 'error'); return; }
      const useCat = useCatOf();
      setDocs(ds => [...ds, ...list.map((x, i) => ({ id: 'fd-' + Date.now() + '-' + i, cat: useCat, name: x.name, ext: ((x.name.split('.').pop() || '') + '').toLowerCase(), sizeKB: x.size / 1024 }))]);
      if (window.MTAToastFlash) window.MTAToastFlash('已加入 ' + list.length + ' 個檔案至「' + useCat + '」');
    };
    const chip = (d) => h('span', { style: { fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', background: 'var(--primary-100)', border: '1px solid var(--border-default)', borderRadius: 999, padding: '1px 8px', flexShrink: 0 } }, d.cat);
    return h(Card, { padding: 24, style: { borderRadius: 'var(--radius-xl)' } },
      h('h3', { style: { fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 } }, '產權文件（內部使用）'),
      h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginBottom: 16 } }, '使用分區、使用執照、地籍圖、平面圖等，支援 PDF、PNG、JPG。僅內部業務／行政可見，分享連結不會顯示；也可先留空，建檔後由行政到物件詳細頁補上。'),
      h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, flexWrap: 'wrap' } },
        h('span', { style: { fontSize: 13, color: 'var(--gray-600)', fontWeight: 600, flexShrink: 0, lineHeight: '30px' } }, '文件類別'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 260 } },
          h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, CATS.map(c => { const on = cat === c; return h('button', { key: c, type: 'button', onClick: () => setCat(c), style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, border: '1px solid ' + (on ? 'var(--color-dark)' : 'var(--border-strong)'), background: on ? 'var(--color-dark)' : '#fff', color: on ? '#fff' : 'var(--gray-600)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, on && h(Icons.check, { size: 13, stroke: 2.5 }), c); })),
          cat === '其他' && h('input', { value: customCat, onChange: (e) => setCustomCat(e.target.value), placeholder: '輸入文件名稱，例：租約、建物謄本…', style: { padding: '8px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 13, fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none', maxWidth: 280 } }))),
      h('label', { onDragOver: (e) => { e.preventDefault(); setDrag(true); }, onDragLeave: () => setDrag(false), onDrop: (e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }, style: { display: 'block', border: '2px dashed ' + (drag ? 'var(--color-dark)' : 'var(--border-strong)'), background: drag ? 'var(--primary-100)' : 'transparent', borderRadius: 'var(--radius-lg)', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 130ms ease, background 130ms ease' } },
        h('input', { ref: inputRef, type: 'file', accept: 'application/pdf,image/png,image/jpeg', multiple: true, onChange: (e) => { addFiles(e.target.files); e.target.value = ''; }, style: { display: 'none' } }),
        h('div', { style: { display: 'flex', justifyContent: 'center', marginBottom: 10, color: 'var(--gray-400)' } }, h(Icons.upload, { size: 28 })),
        h('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' } }, '點擊或拖曳上傳「' + useCatOf() + '」檔案'),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 4 } }, 'PDF、PNG、JPG（電腦截圖），可一次選多個')),
      docs.length > 0 && h('div', { style: { display: 'flex', flexDirection: 'column', marginTop: 14, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' } },
        docs.map((d, i) => h('div', { key: d.id, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderTop: i ? '1px solid var(--border-subtle)' : 'none', background: '#fff' } },
          h('span', { style: { color: d.ext === 'pdf' ? 'var(--error-500)' : 'var(--gray-500)', display: 'flex', flexShrink: 0 } }, h(Icons.fileDoc, { size: 16 })),
          h('span', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, d.name),
          chip(d),
          h('span', { style: { fontSize: 12, color: 'var(--gray-400)', marginLeft: 'auto', flexShrink: 0, fontFamily: 'var(--font-mono)' } }, fmtKB2(d.sizeKB)),
          h('button', { onClick: () => setDocs(ds => ds.filter(x => x.id !== d.id)), title: '移除', style: { flexShrink: 0, background: 'none', border: 'none', padding: 4, color: 'var(--error-500)', cursor: 'pointer', display: 'flex' } }, h(Icons.trash, { size: 15 }))))));
  }

  function useForm(initial) {
    const [f, setF] = React.useState(initial);
    const set = (k, v) => setF(s => ({ ...s, [k]: v }));
    const setMany = (obj) => setF(s => ({ ...s, ...obj }));
    const toggle = (k, v) => setF(s => ({ ...s, [k]: s[k].includes(v) ? s[k].filter(x => x !== v) : [...s[k], v] }));
    return [f, set, toggle, setMany];
  }

  // ── Add ──────────────────────────────────────────────────────
  function AddProperty({ role, category, onBack, onSaved }) {
    const canContacts = role !== '行政';
    const catLabel = category === 'store' ? '出租店面' : '出租辦公';
    const [f, set, toggle, setMany] = useForm(blankForm());
    const [photos, setPhotos] = React.useState([]);
    const [docs, setDocs] = React.useState([]);
    const save = (isDraft) => {
      if (!isDraft && (!f.buildingName.trim() || !f.address.trim() || !f.usableArea || !f.registeredArea || !f.mainArea || !f.accessoryArea || !f.rent)) {
        if (window.MTAToastFlash) window.MTAToastFlash('請填寫必填欄位（名稱、地址、坪數、租金）', 'error');
        return;
      }
      if (!isDraft && Number(f.registeredArea) < Number(f.usableArea)) {
        if (window.MTAToastFlash) window.MTAToastFlash('權狀坪數通常大於等於可使用坪數', 'error');
        return;
      }
      onSaved({ ...toProperty(f), _photos: photos.map(x => x.src).filter(Boolean) }, isDraft);
    };
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      h(PageHeader, { title: '新增物件', sub: '填寫物件詳細資訊', onBack, crumbs: [{ label: '物件管理', onClick: onBack }, { label: catLabel, onClick: onBack }, { label: '新增物件' }] }),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800 } },
        h(Fields, { f, set, toggle, setMany, canContacts, isStore: category === 'store', photos, setPhotos, docs, setDocs, typeOptions: M.FILTERS.houseType }),
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 24 } },
          h(Button, { variant: 'outline', size: 'lg', onClick: onBack, style: { width: '100%' } }, '取消'),
          h(Button, { variant: 'primary', size: 'lg', onClick: () => save(false), style: { width: '100%' } }, '新增物件'))));
  }

  // ── Edit (same fields, prefilled, photo editing) ─────────────
  function EditProperty({ p, role, onCancel, onSave }) {
    const canContacts = role !== '行政';
    const [f, set, toggle, setMany] = useForm(() => fromProperty(p));
    const [photos, setPhotos] = React.useState(() => (p.photos || []).map((src, i) => ({ src, name: p.id + '-' + (i + 1) + '.jpg', isNew: false })));
    const [docs, setDocs] = React.useState(() => M.docsFor(p));
    const save = () => {
      if (!f.buildingName.trim() || !f.address.trim() || !f.usableArea || !f.registeredArea || !f.mainArea || !f.accessoryArea || !f.rent) {
        if (window.MTAToastFlash) window.MTAToastFlash('請填寫必填欄位（名稱、地址、坪數、租金）', 'error');
        return;
      }
      if (Number(f.registeredArea) < Number(f.usableArea)) {
        if (window.MTAToastFlash) window.MTAToastFlash('權狀坪數通常大於等於可使用坪數', 'error');
        return;
      }
      onSave(Object.assign(toProperty(f), { _photos: photos.map(x => x.src) }));
    };
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      h(PageHeader, { title: '編輯物件', sub: '修改物件詳細資訊', idTag: p.id, onBack: onCancel }),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800 } },
        h(Fields, { f, set, toggle, setMany, canContacts, isStore: M.STORE_TYPES.includes(p.type) || p.category === 'store', photos, setPhotos, docs, setDocs, typeOptions: ensure(M.FILTERS.houseType, f.propType) }),
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 24 } },
          h(Button, { variant: 'primary', size: 'lg', onClick: save, style: { width: '100%' } }, '儲存變更'),
          h(Button, { variant: 'outline', size: 'lg', onClick: onCancel, style: { width: '100%' } }, '取消'))));
  }

  window.MTAAddProperty = AddProperty;
  window.MTAEditProperty = EditProperty;
})();
