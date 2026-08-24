/* 系統設定 (老闆專屬) — Audit Log 檢視與下載 — window.MTASettings */
(function () {
  const h = React.createElement;
  const DS = window.ModtateDesignSystem_410f4d;
  const { Card, Button, Input, Select } = DS;
  const { Icons, Avatar, exportExcel } = window.MTAUI;
  const M = window.MTA;

  // ── 假 Audit Log 資料（後端接 API 後由伺服器回傳）─────────
  const pad = (n) => String(n).padStart(2, '0');
  const fmtD = (d) => d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate());
  const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const ACTIONS = [
    { user: '小巫', role: '業務', action: '編輯', target: '物件 A03', detail: '租金 85,000 → 88,000' },
    { user: '王小美', role: '行政', action: '新增', target: '來電紀錄', detail: '陳先生 0918-236-880' },
    { user: 'Aven Hsu', role: '老闆', action: '編輯', target: '物件 B02', detail: '狀態 招租中 → 已成交' },
    { user: '小巫', role: '業務', action: '上傳', target: '物件 A03 文件', detail: '建物權狀.pdf' },
    { user: '林雅婷', role: '業務/行政', action: '編輯', target: '物件 A07', detail: '仲介費（空）→ 月租 0.5 個月' },
    { user: '王小美', role: '行政', action: '刪除', target: '來電紀錄', detail: '重複紀錄 林小姐 02-2501-1234' },
    { user: 'Aven Hsu', role: '老闆', action: '新增', target: '使用者', detail: '新增業務帳號 chang@modtate.com' },
    { user: '小巫', role: '業務', action: '編輯', target: '物件 A05', detail: '照片 新增 3 張' },
    { user: '林雅婷', role: '業務/行政', action: '登入', target: '系統', detail: 'IP 61.216.44.10' },
    { user: '小巫', role: '業務', action: '刪除', target: '物件 A09', detail: '移至封存（可還原）' },
    { user: '王小美', role: '行政', action: '匯出', target: '來電紀錄', detail: 'CSV 共 42 筆' },
    { user: 'Aven Hsu', role: '老闆', action: '編輯', target: '使用者', detail: '停用帳號 lee@modtate.com' },
  ];
  const LOGS = [];
  (function seed() {
    const now = new Date();
    for (let i = 0; i < 48; i++) {
      const a = ACTIONS[i % ACTIONS.length];
      const d = new Date(now.getTime() - i * 7.3 * 3600 * 1000);
      LOGS.push({ id: 'L' + String(1048 - i), time: fmtD(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()), date: d, ...a });
    }
  })();

  const ACTION_TONE = { '刪除': ['var(--error-600)', 'var(--error-50)'], '新增': ['var(--success-700)', 'var(--success-50)'], '編輯': ['var(--gray-700)', 'var(--gray-100)'], '上傳': ['var(--gray-700)', 'var(--gray-100)'], '匯出': ['var(--gray-700)', 'var(--gray-100)'], '登入': ['var(--gray-500)', 'var(--gray-50)'] };

  function Settings({ role }) {
    const isBoss = role === '老闆';
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 86400 * 1000);
    const [from, setFrom] = React.useState(iso(monthAgo));
    const [to, setTo] = React.useState(iso(today));
    const fromD = from ? new Date(from + 'T00:00:00') : null;
    const toD = to ? new Date(to + 'T23:59:59') : null;
    const rows = LOGS.filter(l =>
      (!fromD || l.date >= fromD) && (!toD || l.date <= toD));

    const download = () => {
      exportExcel(`AuditLog_${from}_${to}`, ['編號', '時間', '使用者', '角色', '動作', '對象', '內容'],
        rows.map(l => [l.id, l.time, l.user, l.role, l.action, l.target, l.detail]));
      window.MTAToastFlash && window.MTAToastFlash(`已下載操作日誌（${rows.length} 筆）`);
    };

    const lbl = (t) => h('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: 6 } }, t);
    const dateInp = (v, set) => h('input', { type: 'date', value: v, onChange: (e) => set(e.target.value), style: { height: 40, padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', fontSize: 13, fontFamily: 'inherit', color: 'var(--text-primary)', background: '#fff', width: '100%' } });

    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
      h('div', null,
        h('h1', { style: { fontSize: 22, fontWeight: 700 } }, '下載操作日誌'),
        h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 3 } }, '操作日誌（Audit Log）— 所有異動皆留存，日誌不可修改')),
      h(Card, { padding: 26, style: { borderRadius: 'var(--radius-xl)' } },
        h('div', { style: { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' } },
          h('div', { style: { width: 170 } }, lbl('開始日期'), dateInp(from, setFrom)),
          h('div', { style: { width: 170 } }, lbl('結束日期'), dateInp(to, setTo)),
          h('div', { style: { flex: 1 } }),
          isBoss
            ? h(Button, { variant: 'primary', size: 'sm', iconLeft: h(Icons.downloadFilled, { size: 14 }), onClick: download }, '下載日誌')
            : h('span', { style: { fontSize: 12, color: 'var(--gray-400)' } }, '僅老闆可下載日誌'))),
      h('p', { style: { fontSize: 13, color: 'var(--gray-500)' } }, `${from.replace(/-/g, '/')} — ${to.replace(/-/g, '/')} · 共 ${rows.length} 筆操作紀錄`));
  }

  window.MTASettings = Settings;
})();
