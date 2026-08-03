/* Inquiries — window.MTAInquiries */
(function () {
  const h = React.createElement;
  const { Button, Card } = window.ModtateDesignSystem_410f4d;
  const { Icons, StatusBadge } = window.MTAUI;
  const M = window.MTA;
  const thBase = { textAlign: 'left', fontWeight: 600, color: 'var(--gray-400)', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', padding: '10px 12px', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' };

  function IRow({ inq }) {
    const [hover, setHover] = React.useState(false);
    const td = { padding: '13px 12px', borderBottom: '1px solid var(--border-default)' };
    return h('tr', { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: { background: hover ? 'var(--surface-sunken)' : 'transparent' } },
      h('td', { style: { ...td, paddingLeft: 22 } },
        h('div', { style: { fontWeight: 600, color: 'var(--text-primary)' } }, inq.name),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 2 } }, inq.phone),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)' } }, inq.email)),
      h('td', { style: { ...td, fontWeight: 500, color: 'var(--text-primary)' } }, inq.property),
      h('td', { style: { ...td, color: 'var(--gray-600)', maxWidth: 220 } }, h('div', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, inq.message)),
      h('td', { style: { ...td, color: 'var(--gray-400)', fontSize: 12, fontFamily: 'var(--font-mono)' } }, inq.date),
      h('td', { style: td }, h(StatusBadge, { kind: 'inq', status: inq.status })));
  }

  function Inquiries() {
    const [tab, setTab] = React.useState('all');
    const all = M.INQUIRIES;
    const newCount = all.filter(i => i.status === 'new').length;
    const list = tab === 'all' ? all : all.filter(i => i.status === tab);
    const tabs = [['all', `全部 (${all.length})`], ['new', `新詢問 (${newCount})`], ['replied', '已回覆'], ['deal', '已成交']];
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 } },
        h('h1', { style: { fontSize: 22, fontWeight: 700 } }, '詢問管理'),
        h(Button, { variant: 'outline', size: 'sm', iconLeft: h(Icons.export, { size: 14 }) }, '匯出 Excel')),
      h('div', { style: { display: 'flex', gap: 2, background: 'var(--primary-100)', borderRadius: 10, padding: 3, width: 'fit-content' } },
        tabs.map(([v, l]) => { const on = tab === v; return h('button', { key: v, onClick: () => setTab(v), style: { padding: '7px 16px', border: 'none', borderRadius: 999, background: on ? '#fff' : 'transparent', fontSize: 13, fontWeight: on ? 600 : 500, color: on ? 'var(--text-primary)' : 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit', boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' } }, l); })),
      h(Card, { padding: 0, style: { overflow: 'hidden' } },
        h('div', { style: { overflowX: 'auto' } },
          h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 760 } },
            h('thead', null, h('tr', { style: { background: 'var(--surface-sunken)' } },
              ['詢問人', '物件名稱', '詢問內容', '時間', '狀態'].map((t, i) => h('th', { key: i, style: { ...thBase, ...(i === 0 ? { paddingLeft: 22 } : {}), ...(i === 2 ? { minWidth: 200 } : {}) } }, t)))),
            h('tbody', null, list.map((inq, i) => h(IRow, { key: i, inq })))))));
  }

  window.MTAInquiries = Inquiries;
})();
