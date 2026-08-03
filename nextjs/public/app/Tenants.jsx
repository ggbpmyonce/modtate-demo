/* 來電紀錄 (call records) — window.MTATenants
   Each row = one call. Same person/company may appear multiple times.
   Repeat detection: shared phone digits OR shared 統編.
   行政: phone-lookup only. 老闆/業務: full list + timeline. */
(function () {
  const h = React.createElement;
  const { Button, Card, Input, Select, Pagination } = window.ModtateDesignSystem_410f4d;
  const { Icons } = window.MTAUI;
  const M = window.MTA;
  const PAGE = 15;
  const thBase = { textAlign: 'left', fontWeight: 600, color: 'var(--gray-400)', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', padding: '10px 12px', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' };
  const onlyDigits = (s) => (s || '').replace(/\D/g, '');
  const STAFF_OPTIONS = ['林雅婷', '張偉明', '黃淑芬', '暫時不指派'];
  const flash = (msg, kind) => { if (window.MTAToastFlash) window.MTAToastFlash(msg, kind); };
  const nowStr = () => { const n = new Date(); return n.getFullYear() + '/' + String(n.getMonth() + 1).padStart(2, '0') + '/' + String(n.getDate()).padStart(2, '0') + ' ' + String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0'); };

  // ── repeat-caller keys: each distinct phone number + 統編 ────
  function phoneKeys(t) {
    const raw = (t.phones && t.phones.length) ? t.phones.map(p => p.value) : String(t.phone || '').split('\n');
    return raw.map(v => { const d = onlyDigits(v).replace(/^0+/, ''); return d.length >= 7 ? d.slice(-9) : d; }).filter(x => x.length >= 6);
  }
  function keysOf(t) {
    const ks = new Set(phoneKeys(t));
    if (t.taxId && onlyDigits(t.taxId).length >= 6) ks.add('tax:' + onlyDigits(t.taxId));
    return ks;
  }
  function relatedTo(t, all) {
    const ks = keysOf(t);
    return all.filter(x => x !== t && [...keysOf(x)].some(k => ks.has(k)));
  }
  const cmpDateDesc = (a, b) => String(b.date || '').localeCompare(String(a.date || ''));

  function RepeatBadge({ n }) {
    if (!n) return null;
    return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, color: 'var(--warning-700)', background: 'var(--warning-100)', border: '1px solid var(--warning-200)', borderRadius: 999, padding: '1px 8px', whiteSpace: 'nowrap' } }, h(Icons.phone, { size: 11 }), '重複 ×' + (n + 1));
  }

  function TRow({ t, repeatN, canManage, onOpen, onEdit, onDelete }) {
    const [hover, setHover] = React.useState(false);
    const td = { padding: '13px 12px', borderBottom: '1px solid var(--border-default)', verticalAlign: 'top' };
    const ghost = { padding: '5px 11px', border: '1px solid var(--border-default)', borderRadius: 999, background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit' };
    return h('tr', { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: { background: hover ? 'var(--surface-sunken)' : 'transparent' } },
      h('td', { style: { ...td, paddingLeft: 22, whiteSpace: 'nowrap' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          h('span', { onClick: onOpen, style: { fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' } }, t.name),
          h(RepeatBadge, { n: repeatN }))),
      h('td', { style: { ...td, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-600)', maxWidth: 180, whiteSpace: 'pre-wrap', wordBreak: 'break-word' } }, t.phone),
      h('td', { style: { ...td, fontSize: 12, color: 'var(--gray-600)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' } }, t.taxId || '—'),
      h('td', { style: { ...td, fontSize: 12, color: 'var(--text-primary)' } }, t.industry),
      h('td', { style: { ...td, fontSize: 12, color: 'var(--gray-600)', maxWidth: 240 } }, h('div', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, t.notes)),
      h('td', { style: { ...td, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' } }, t.staffName),
      h('td', { style: { ...td, fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' } }, t.date),
      canManage && h('td', { style: { ...td, paddingRight: 22, textAlign: 'right', whiteSpace: 'nowrap' } },
        h('div', { style: { display: 'flex', gap: 6, justifyContent: 'flex-end' } },
          h('button', { style: ghost, onClick: onOpen }, '檢視'),
          h('button', { style: ghost, onClick: () => onEdit(t) }, '編輯'),
          h('button', { style: { ...ghost, borderColor: 'var(--error-200)', color: 'var(--error-500)' }, onClick: () => onDelete(t) }, '刪除'))));
  }

  const phoneToText = (phones) => (phones || []).map(p => (p.value || '').trim()).filter(Boolean).join('\n');

  function PhoneRows({ phones, setPhones }) {
    const rows = phones && phones.length ? phones : [{ value: '' }];
    const setRow = (i, val) => setPhones(rows.map((r, x) => x === i ? { value: val } : r));
    const add = () => setPhones([...rows, { value: '' }]);
    const remove = (i) => setPhones(rows.filter((_, x) => x !== i));
    return h('div', null,
      h('span', { style: { fontSize: 13, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 } }, '聯絡電話', h('span', { style: { color: 'var(--error-500)' } }, '*')),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        rows.map((r, i) => h('div', { key: i, style: { display: 'flex', gap: 10, alignItems: 'center' } },
          h('div', { style: { flex: 1 } }, h(Input, { placeholder: '例：02-8195-3000 分機8452', value: r.value, onChange: (e) => setRow(i, e.target.value) })),
          rows.length > 1 && h('button', { type: 'button', onClick: () => remove(i), title: '移除', style: { flexShrink: 0, width: 38, height: 38, borderRadius: 999, border: '1px solid var(--error-200)', background: '#fff', color: 'var(--error-500)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, h(Icons.close, { size: 15 }))))),
      h('button', { type: 'button', onClick: add, style: { marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px dashed var(--border-strong)', borderRadius: 999, background: '#fff', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', cursor: 'pointer', fontFamily: 'inherit' } }, h(Icons.plus, { size: 14, stroke: 2 }), '新增電話'));
  }

  // ── 新增 / 編輯 來電紀錄 modal ──────────────────────────────
  function TenantModal({ mode, record, initialPhone, prefill, onClose, onSave }) {
    const editing = mode === 'edit';
    const base0 = editing ? record : (prefill || {});
    const [form, setForm] = React.useState({
      name: base0.name || '', phones: (base0.phones && base0.phones.length) ? base0.phones : [{ value: (editing ? base0.phone : initialPhone) || '' }],
      industry: (base0.industry && base0.industry !== '未提供') ? base0.industry : '', taxId: base0.taxId || '', notes: editing ? base0.notes : '', staffName: STAFF_OPTIONS.includes(base0.staffName) ? base0.staffName : '林雅婷',
    });
    const set = (k) => (e) => setForm(s => ({ ...s, [k]: e && e.target ? e.target.value : e }));
    const submit = () => {
      const phoneText = phoneToText(form.phones);
      if (!form.name.trim() || !onlyDigits(phoneText) || !form.industry.trim()) { flash('請填寫必填欄位（客戶稱呼、聯絡電話、公司名稱/行業別）', 'error'); return; }
      const b = { ...form, name: form.name.trim(), phone: phoneText, phones: form.phones, industry: form.industry.trim() };
      onSave(editing ? { ...record, ...b } : { ...b, date: nowStr(), status: 'new' });
    };
    return h('div', { onClick: onClose, style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 } },
      h('div', { onClick: (e) => e.stopPropagation(), style: { background: '#fff', borderRadius: 'var(--radius-2xl)', width: '100%', maxWidth: 480, boxShadow: '0 20px 50px rgba(0,0,0,0.25)', padding: '28px 28px 24px', maxHeight: '90vh', overflowY: 'auto' } },
        h('div', { style: { position: 'relative', textAlign: 'center', marginBottom: 6 } },
          h('h2', { style: { fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' } }, editing ? '編輯來電紀錄' : '新增來電紀錄'),
          h('button', { onClick: onClose, style: { position: 'absolute', top: -4, right: -4, width: 32, height: 32, borderRadius: 999, border: 'none', background: 'var(--primary-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' } }, h(Icons.close, { size: 16 }))),
        (!editing && prefill) && h('div', { style: { fontSize: 12, color: 'var(--gray-500)', textAlign: 'center', marginBottom: 16 } }, '已帶入舊客戶資料，僅需填寫這次的需求／備註'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 } },
          h(Input, { label: '客戶稱呼', required: true, placeholder: '例：賴先生', value: form.name, onChange: set('name') }),
          h(PhoneRows, { phones: form.phones, setPhones: (p) => setForm(s => ({ ...s, phones: p })) }),
          h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
            h(Input, { label: '統編', placeholder: '例：12345678', value: form.taxId, onChange: set('taxId') }),
            h(Input, { label: '公司名稱/行業別', required: true, placeholder: '例：軟體科技業', value: form.industry, onChange: set('industry') })),
          h(Select, { label: '本次承辦', required: true, options: STAFF_OPTIONS, value: form.staffName, onChange: set('staffName') }),
          h('div', null,
            h('span', { style: { fontSize: 13, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 6, display: 'block' } }, '本次來電需求／備註'),
            h('textarea', { value: form.notes, onChange: set('notes'), placeholder: '記錄這通來電的需求、預算、區域、可看屋時間等…', style: { padding: '10px 14px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--text-primary)', width: '100%', minHeight: 90, resize: 'vertical' } }))),
        h('div', { style: { display: 'flex', gap: 10, marginTop: 24 } },
          h(Button, { variant: 'outline', onClick: onClose, style: { flex: 1 } }, '取消'),
          h(Button, { variant: 'primary', onClick: submit, style: { flex: 1 } }, editing ? '儲存變更' : '新增紀錄'))));
  }

  function ConfirmDelete({ record, onClose, onConfirm }) {
    return h('div', { onClick: onClose, style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 } },
      h('div', { onClick: (e) => e.stopPropagation(), style: { background: '#fff', borderRadius: 'var(--radius-2xl)', width: '100%', maxWidth: 400, boxShadow: '0 20px 50px rgba(0,0,0,0.25)', padding: '28px' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 } },
          h('div', { style: { width: 52, height: 52, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--error-100)', color: 'var(--error-500)' } }, h(Icons.close, { size: 24, stroke: 2 })),
          h('h2', { style: { fontSize: 19, fontWeight: 600, color: 'var(--text-primary)' } }, '刪除來電紀錄'),
          h('div', { style: { fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 } }, '確定要刪除 ', h('strong', null, record.name, '（', record.date, '）'), ' 這筆來電紀錄嗎？此動作無法復原。')),
        h('div', { style: { display: 'flex', gap: 10, marginTop: 26 } },
          h(Button, { variant: 'outline', onClick: onClose, style: { flex: 1 } }, '取消'),
          h('button', { onClick: onConfirm, style: { flex: 1, padding: '11px 22px', border: 'none', borderRadius: 999, background: 'var(--error-500)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, '確定刪除'))));
  }

  // ── 來電歷史時間軸（同號碼／同統編）─────────────────────────
  function Timeline({ record, all, canManage, onAddSame, onEdit, onDelete, onClose }) {
    const group = [record, ...relatedTo(record, all)].sort(cmpDateDesc);
    return h('div', { onClick: onClose, style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 } },
      h('div', { onClick: (e) => e.stopPropagation(), style: { background: '#fff', borderRadius: 'var(--radius-2xl)', width: '100%', maxWidth: 560, boxShadow: '0 20px 50px rgba(0,0,0,0.25)', maxHeight: '88vh', display: 'flex', flexDirection: 'column' } },
        h('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '22px 24px 16px', borderBottom: '1px solid var(--border-default)' } },
          h('div', null,
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
              h('h2', { style: { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' } }, record.name),
              group.length > 1 && h(RepeatBadge, { n: group.length - 1 })),
            h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginTop: 4, fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' } }, record.phone),
            h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginTop: 2 } }, record.industry, record.taxId ? ' · 統編 ' + record.taxId : '')),
          h('button', { onClick: onClose, style: { flexShrink: 0, width: 32, height: 32, borderRadius: 999, border: 'none', background: 'var(--primary-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' } }, h(Icons.close, { size: 16 }))),
        h('div', { style: { padding: '18px 24px', overflowY: 'auto' } },
          h('div', { style: { fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', letterSpacing: 0.5, marginBottom: 14 } }, `來電時間軸 · 共 ${group.length} 通`),
          h('div', { style: { position: 'relative', paddingLeft: 22 } },
            h('div', { style: { position: 'absolute', left: 5, top: 6, bottom: 6, width: 2, background: 'var(--border-default)' } }),
            group.map((g, i) => h('div', { key: g._id || i, style: { position: 'relative', paddingBottom: i === group.length - 1 ? 0 : 20 } },
              h('span', { style: { position: 'absolute', left: -22, top: 3, width: 12, height: 12, borderRadius: 999, background: g === record ? 'var(--color-dark)' : '#fff', border: '2px solid ' + (g === record ? 'var(--color-dark)' : 'var(--gray-300)') } }),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
                h('span', { style: { fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' } }, g.date),
                h('span', { style: { fontSize: 12, color: 'var(--gray-500)' } }, '承辦 ' + g.staffName),
                g === record && h('span', { style: { fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', background: 'var(--primary-100)', borderRadius: 999, padding: '1px 8px' } }, '本筆')),
              g.notes && h('div', { style: { fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.7, marginTop: 5, whiteSpace: 'pre-wrap' } }, g.notes),
              canManage && h('div', { style: { display: 'flex', gap: 12, marginTop: 8 } },
                h('button', { onClick: () => onEdit(g), style: { background: 'none', border: 'none', padding: 0, fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit' } }, '編輯'),
                h('button', { onClick: () => onDelete(g), style: { background: 'none', border: 'none', padding: 0, fontSize: 12, fontWeight: 600, color: 'var(--error-500)', cursor: 'pointer', fontFamily: 'inherit' } }, '刪除')))))),
        h('div', { style: { padding: '16px 24px', borderTop: '1px solid var(--border-default)' } },
          h(Button, { variant: 'primary', size: 'md', iconLeft: h(Icons.plus, { size: 15, stroke: 2 }), onClick: () => onAddSame(record), style: { width: '100%' } }, '為此客戶新增一筆來電'))));
  }

  // ── 行政 視角：電話查詢 ─────────────────────────────────────
  function AdminLookup({ tenants, onAdd }) {
    const [q, setQ] = React.useState('');
    const [submitted, setSubmitted] = React.useState(null);
    const run = () => {
      const query = q.trim();
      const digits = onlyDigits(q);
      if (query.length < 2 && digits.length < 4) { setSubmitted({ query, matches: [], tooShort: true }); return; }
      const matches = tenants.filter(t =>
        (t.name && t.name.includes(query)) ||
        (t.industry && t.industry.includes(query)) ||
        (t.taxId && t.taxId.includes(query)) ||
        (digits.length >= 4 && onlyDigits(t.phone).includes(digits))
      ).sort(cmpDateDesc);
      setSubmitted({ query, matches });
    };
    const onKey = (e) => { if (e.key === 'Enter') run(); };
    const isRepeat = submitted && !submitted.tooShort && submitted.matches.length > 0;
    const isNew = submitted && !submitted.tooShort && submitted.matches.length === 0;
    const td = { padding: '13px 12px', borderBottom: '1px solid var(--border-default)', verticalAlign: 'top' };
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
      h('div', null,
        h('h1', { style: { fontSize: 22, fontWeight: 700 } }, '來電紀錄'),
        h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 3 } }, `共 ${tenants.length} 通來電 · 每通來電獨立一筆`)),
      h(Card, { padding: 26, style: { borderRadius: 'var(--radius-xl)' } },
        h('div', { style: { display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' } },
          h('div', { style: { flex: 1, minWidth: 240 } },
            h(Input, { label: '搜尋客戶、電話、公司名稱或統編', icon: h(Icons.search, { size: 15 }), placeholder: '搜尋客戶、電話、公司名稱或統編…', value: q, onChange: (e) => setQ(e.target.value), onKeyDown: onKey })),
          h(Button, { variant: 'primary', size: 'md', onClick: run, iconLeft: h(Icons.search, { size: 15 }) }, '查詢')),
        submitted && submitted.tooShort && h('div', { style: { marginTop: 16, fontSize: 13, color: 'var(--warning-700)' } }, '請至少輸入 2 個字或 4 碼電話。'),
        isRepeat && h('div', { style: { marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--warning-100)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--warning-200)' } },
          h('span', { style: { width: 34, height: 34, borderRadius: 999, background: 'var(--warning-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } }, h(Icons.phone, { size: 17 })),
          h('div', null,
            h('div', { style: { fontSize: 14, fontWeight: 700, color: 'var(--warning-700)' } }, `重複來電 · 找到 ${submitted.matches.length} 通紀錄`),
            h('div', { style: { fontSize: 12, color: 'var(--gray-600)', marginTop: 2 } }, '此號碼／統編曾來電，請參考下方歷史紀錄並轉接對應承辦。'))),
        isNew && h('div', { style: { marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--success-100)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--success-200)' } },
          h('span', { style: { width: 34, height: 34, borderRadius: 999, background: 'var(--success-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } }, h(Icons.check, { size: 18, stroke: 2.2 })),
          h('div', { style: { flex: 1 } },
            h('div', { style: { fontSize: 14, fontWeight: 700, color: 'var(--success-700)' } }, '新來電 · 查無紀錄'),
            h('div', { style: { fontSize: 12, color: 'var(--gray-600)', marginTop: 2 } }, `查無「${submitted.query}」的來電紀錄，可視為新客戶。`)),
          h(Button, { variant: 'primary', size: 'sm', iconLeft: h(Icons.plus, { size: 13, stroke: 2 }), onClick: () => onAdd(submitted.query) }, '新增來電紀錄'))),
      isRepeat && h(Card, { padding: 0, style: { overflow: 'hidden' } },
        h('div', { style: { padding: '12px 22px', borderBottom: '1px solid var(--border-default)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' } }, '歷史來電紀錄（依時間排序）'),
        h('div', { style: { overflowX: 'auto' } },
          h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 } },
            h('thead', null, h('tr', { style: { background: 'var(--surface-sunken)' } },
              ['來電日', '客戶', '聯絡電話', '統編', '需求／備註', '承辦'].map((t, i) => h('th', { key: i, style: { ...thBase, ...(i === 0 ? { paddingLeft: 22 } : {}), ...(i === 4 ? { minWidth: 220 } : {}) } }, t)))),
            h('tbody', null, submitted.matches.map((t, i) => h('tr', { key: i },
              h('td', { style: { ...td, paddingLeft: 22, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-500)', whiteSpace: 'nowrap' } }, t.date),
              h('td', { style: { ...td, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' } }, t.name),
              h('td', { style: { ...td, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-600)', whiteSpace: 'pre-wrap' } }, t.phone),
              h('td', { style: { ...td, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-600)', whiteSpace: 'nowrap' } }, t.taxId || '—'),
              h('td', { style: { ...td, fontSize: 12, color: 'var(--gray-600)' } }, t.notes),
              h('td', { style: { ...td, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' } }, t.staffName)))))) ),
      !submitted && h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 20px', textAlign: 'center' } },
        h('div', { style: { width: 60, height: 60, borderRadius: 999, background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: 'var(--gray-400)' } }, h(Icons.phone, { size: 26 })),
        h('div', { style: { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' } }, '請輸入電話或統編查詢'),
        h('div', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 6, maxWidth: 360 } }, '查詢結果僅顯示符合的來電紀錄；查得到代表為重複來電。')));
  }

  // ── 老闆 / 業務 視角：完整名單 ──────────────────────────────
  function FullTable({ tenants, onAdd, onOpen, canManage, onEdit, onDelete }) {
    const [page, setPage] = React.useState(1);
    const [q, setQ] = React.useState('');
    React.useEffect(() => setPage(1), [q]);
    const digits = onlyDigits(q);
    const sorted = [...tenants].sort(cmpDateDesc);
    const all = q.trim()
      ? sorted.filter(t => t.name.includes(q) || t.industry.includes(q) || (t.taxId && t.taxId.includes(q)) || (digits.length >= 2 && onlyDigits(t.phone).includes(digits)))
      : sorted;
    const totalPages = Math.max(1, Math.ceil(all.length / PAGE));
    const items = all.slice((page - 1) * PAGE, page * PAGE);
    const start = all.length ? (page - 1) * PAGE + 1 : 0, end = Math.min(page * PAGE, all.length);
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 } },
        h('div', null,
          h('h1', { style: { fontSize: 22, fontWeight: 700 } }, '來電紀錄'),
          h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 3 } }, `共 ${tenants.length} 通來電 · 每通來電獨立一筆`)),
        h('div', { style: { display: 'flex', gap: 10 } },
          h(Button, { variant: 'outline', size: 'sm', iconLeft: h(Icons.export, { size: 14 }) }, '匯出 Excel'),
          h(Button, { variant: 'primary', size: 'sm', iconLeft: h(Icons.plus, { size: 14, stroke: 2 }), onClick: () => onAdd('') }, '新增來電紀錄'))),
      h(Card, { padding: 0, style: { overflow: 'hidden' } },
        h('div', { style: { display: 'flex', gap: 10, padding: '14px 22px', borderBottom: '1px solid var(--border-default)', alignItems: 'center', flexWrap: 'wrap' } },
          h('div', { style: { flex: 1, minWidth: 240, maxWidth: 380 } }, h(Input, { icon: h(Icons.search, { size: 15 }), placeholder: '搜尋客戶、電話、公司名稱或統編…', value: q, onChange: (e) => setQ(e.target.value) })),
          h('span', { style: { fontSize: 12, color: 'var(--gray-400)', marginLeft: 'auto' } }, `找到 ${all.length} 筆`)),
        h('div', { style: { overflowX: 'auto' } },
          h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 840 } },
            h('thead', null, h('tr', { style: { background: 'var(--surface-sunken)' } },
              ['客戶', '聯絡電話', '統編', '公司名稱/行業別', '需求／備註', '本次承辦', '來電日'].concat(canManage ? [''] : []).map((t, i) => h('th', { key: i, style: { ...thBase, ...(i === 0 ? { paddingLeft: 22 } : {}), ...(i === 4 ? { minWidth: 220 } : {}) } }, t)))),
            h('tbody', null, items.map((t, i) => h(TRow, { key: t._id != null ? t._id : i, t, repeatN: relatedTo(t, tenants).length, canManage, onOpen: () => onOpen(t), onEdit, onDelete }))))),
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderTop: '1px solid var(--border-default)' } },
          h('span', { style: { fontSize: 12, color: 'var(--gray-400)' } }, `顯示 ${start}–${end} 共 ${all.length} 筆`),
          h(Pagination, { total: totalPages, page, onChange: setPage }))));
  }

  function Tenants({ role }) {
    const canManage = role === '老闆';
    const [list, setList] = React.useState(() => M.TENANTS.map((t, i) => ({ ...t, _id: 'base-' + i })));
    const [modal, setModal] = React.useState(null);   // {mode, record, phone, prefill}
    const [deleting, setDeleting] = React.useState(null);
    const [timeline, setTimeline] = React.useState(null); // record
    const onAdd = (phone) => setModal({ mode: 'add', phone: phone || '' });
    const onAddSame = (rec) => setModal({ mode: 'add', prefill: { name: rec.name, phones: rec.phones || [{ value: rec.phone }], industry: rec.industry, taxId: rec.taxId, staffName: rec.staffName } });
    const onEdit = (t) => setModal({ mode: 'edit', record: t });
    const onDelete = (t) => setDeleting(t);
    const onOpen = (t) => setTimeline(t);
    const save = (rec) => {
      if (modal.mode === 'edit') { setList(l => l.map(x => x._id === rec._id ? rec : x)); setTimeline(tl => tl && tl._id === rec._id ? rec : tl); flash(`已更新「${rec.name}」的紀錄`); }
      else { const nr = { ...rec, _id: 'new-' + Date.now() }; setList(l => [nr, ...l]); flash(`已新增來電紀錄「${rec.name}」`); }
      setModal(null);
    };
    const confirmDelete = () => { setList(l => l.filter(x => x._id !== deleting._id)); if (timeline && timeline._id === deleting._id) setTimeline(null); flash(`已刪除「${deleting.name}」的來電紀錄`); setDeleting(null); };
    return h(React.Fragment, null,
      (role || '').includes('行政')
        ? h(AdminLookup, { tenants: list, onAdd })
        : h(FullTable, { tenants: list, onAdd, onOpen, canManage, onEdit, onDelete }),
      timeline && h(Timeline, { record: timeline, all: list, canManage, onAddSame, onEdit, onDelete, onClose: () => setTimeline(null) }),
      modal && h(TenantModal, { mode: modal.mode, record: modal.record, initialPhone: modal.phone, prefill: modal.prefill, onClose: () => setModal(null), onSave: save }),
      deleting && h(ConfirmDelete, { record: deleting, onClose: () => setDeleting(null), onConfirm: confirmDelete }));
  }

  window.MTATenants = Tenants;
})();
