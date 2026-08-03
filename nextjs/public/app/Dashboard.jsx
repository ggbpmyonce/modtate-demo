/* Dashboard — window.MTADashboard */
(function () {
  const h = React.createElement;
  const { Icons, StatusBadge } = window.MTAUI;
  const { Card, Button } = window.ModtateDesignSystem_410f4d;

  const KPIS = [
    { icon: 'building', label: '刊登中物件', value: '715', delta: '↑ 12 件 本週新增', tone: 'pos', tint: ['var(--primary-100)', 'var(--color-dark)'] },
    { icon: 'inquiry', label: '本月新詢問', value: '342', delta: '↑ 18.3% 較上月', tone: 'pos', tint: ['var(--info-100)', 'var(--info-700)'] },
    { icon: 'check2', label: '租約進行中', value: '89', delta: '⚠ 7 件即將到期', tone: 'warn', tint: ['var(--success-100)', 'var(--success-700)'] },
    { icon: 'clock', label: '本月成交', value: '18', delta: 'NT$ 2,724,000 租金', tone: 'mut', tint: ['var(--warning-100)', 'var(--warning-700)'] },
  ];
  const deltaColor = { pos: 'var(--success-700)', warn: 'var(--warning-700)', mut: 'var(--gray-500)' };

  function KPI({ k, kpiTone }) {
    const Icon = Icons[k.icon];
    const tinted = kpiTone === 'tinted';
    const bg = tinted ? k.tint[0] : 'var(--color-dark)';
    const fg = tinted ? k.tint[1] : '#fff';
    return h(Card, { padding: '20px 22px' },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gray-600)', fontSize: 13, fontWeight: 500, marginBottom: 10 } },
        h('span', { style: { width: 28, height: 28, borderRadius: 999, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: fg } }, h(Icon, { size: 15, stroke: 1.7 })),
        k.label),
      h('div', { style: { fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.4px' } }, k.value),
      h('div', { style: { marginTop: 4, fontSize: 12, color: deltaColor[k.tone] } }, k.delta));
  }

  function Chart() {
    return h(Card, { padding: 22 },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 } },
        h('div', null,
          h('h3', { style: { fontSize: 16, fontWeight: 600 } }, '詢問趨勢'),
          h('p', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 2 } }, '近 6 個月詢問與成交數量')),
        h('div', { style: { display: 'flex', gap: 6 } },
          h('button', { style: segBtn(false) }, '本季'),
          h('button', { style: segBtn(true) }, '近6個月'))),
      h('div', { style: { display: 'flex', gap: 18, marginBottom: 8, fontSize: 12, color: 'var(--gray-600)' } },
        legend('var(--color-dark)', '詢問數'), legend('var(--success-700)', '成交數')),
      h('svg', { viewBox: '0 0 800 200', style: { width: '100%', height: 200, display: 'block' } },
        h('defs', null, h('linearGradient', { id: 'mtaGrad', x1: 0, y1: 0, x2: 0, y2: 1 },
          h('stop', { offset: '0%', stopColor: '#1A1A1A', stopOpacity: 0.12 }), h('stop', { offset: '100%', stopColor: '#1A1A1A', stopOpacity: 0 }))),
        [20, 60, 100, 140].map(y => h('line', { key: y, x1: 50, y1: y, x2: 790, y2: y, stroke: 'var(--border-default)', strokeWidth: 1 })),
        [[23, '150'], [63, '100'], [103, '50'], [143, '0']].map(([y, t]) => h('text', { key: t, x: 44, y, fill: 'var(--gray-400)', fontSize: 11, textAnchor: 'end', fontFamily: 'Inter,sans-serif' }, t)),
        h('path', { d: 'M100,110 C180,90 240,75 320,62 S460,40 540,32 S680,22 790,18', fill: 'none', stroke: 'var(--color-dark)', strokeWidth: 2.5, strokeLinecap: 'round' }),
        h('path', { d: 'M100,110 C180,90 240,75 320,62 S460,40 540,32 S680,22 790,18 V150 H100Z', fill: 'url(#mtaGrad)' }),
        h('path', { d: 'M100,142 C180,138 260,134 340,130 S480,124 560,120 S700,115 790,112', fill: 'none', stroke: 'var(--success-700)', strokeWidth: 2.5, strokeLinecap: 'round' }),
        ['1月', '2月', '3月', '4月', '5月', '6月'].map((m, i) => h('text', { key: m, x: 100 + i * 128, y: 168, fill: 'var(--gray-400)', fontSize: 11, textAnchor: 'middle', fontFamily: 'Inter,Noto Sans TC,sans-serif' }, m))));
  }
  const legend = (c, t) => h('span', { style: { display: 'flex', alignItems: 'center', gap: 6 } }, h('span', { style: { width: 18, height: 2.5, background: c, borderRadius: 2 } }), t);
  const segBtn = (on) => ({ padding: '6px 12px', border: on ? '1px solid var(--border-default)' : '1px solid var(--border-default)', borderRadius: 999, background: on ? 'var(--surface-sunken)' : '#fff', fontSize: 12, color: on ? 'var(--gray-700)' : 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: on ? 600 : 500 });

  const thBase = { textAlign: 'left', fontWeight: 600, color: 'var(--gray-400)', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', padding: '10px 12px', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' };

  function RecentInquiries({ inquiries, onViewAll }) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
        h('h2', { style: { fontSize: 18, fontWeight: 700 } }, '近期詢問'),
        onViewAll && h('button', { onClick: onViewAll, style: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', padding: 0 } }, '全部查看 →')),
      h(Card, { padding: 0, style: { overflow: 'hidden' } },
        h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 13 } },
          h('thead', null, h('tr', { style: { background: 'var(--surface-sunken)' } },
            h('th', { style: { ...thBase, paddingLeft: 22 } }, '詢問人'), h('th', { style: thBase }, '物件'), h('th', { style: thBase }, '時間'), h('th', { style: thBase }, '狀態'), h('th', { style: { ...thBase, width: 80 } }))),
          h('tbody', null, inquiries.map((inq, i) => h(Row, { key: i, inq }))))));
  }
  function Row({ inq }) {
    const [hover, setHover] = React.useState(false);
    const td = { padding: '14px 12px', borderBottom: '1px solid var(--border-default)' };
    return h('tr', { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: { background: hover ? 'var(--surface-sunken)' : 'transparent' } },
      h('td', { style: { ...td, paddingLeft: 22 } },
        h('div', { style: { fontWeight: 600, color: 'var(--text-primary)' } }, inq.name),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 2 } }, inq.phone)),
      h('td', { style: { ...td, color: 'var(--gray-600)', fontWeight: 500 } }, inq.property),
      h('td', { style: { ...td, color: 'var(--gray-400)', fontSize: 12 } }, inq.date),
      h('td', { style: td }, h(StatusBadge, { kind: 'inq', status: inq.status })),
      h('td', { style: { ...td, paddingRight: 22, textAlign: 'right' } },
        h('button', { style: { padding: '5px 12px', border: '1px solid var(--border-default)', borderRadius: 999, background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit' } }, '查看')));
  }

  function Dashboard({ inquiries, onNav, kpiTone }) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
      h('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' } },
        h('h1', { style: { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' } }, '儀表板'),
        h('span', { style: { fontSize: 12, color: 'var(--gray-400)' } }, '最後更新 2026/06/17 09:30')),
      h('div', { id: 'mta-kpi', style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 } }, KPIS.map(k => h(KPI, { key: k.label, k, kpiTone }))),
      h(Chart),
      h(RecentInquiries, { inquiries: inquiries.slice(0, 5), onViewAll: onNav ? () => onNav('inquiries') : null }));
  }

  window.MTADashboard = Dashboard;
})();
