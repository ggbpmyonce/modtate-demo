/* Sidebar — window.MTASidebar */
(function () {
  const h = React.createElement;
  const { Icons, Avatar } = window.MTAUI;
  const { Badge } = window.ModtateDesignSystem_410f4d;

  const NAV = [
    { key: 'dashboard', label: '儀表板', icon: 'dashboard' },
    { key: 'properties', label: '物件管理', icon: 'building', badge: 'prop' },
    { key: 'inquiries', label: '詢問管理', icon: 'inquiry', badge: 'inq' },
    { key: 'tenants', label: '來電紀錄', icon: 'users' },
    { key: 'members', label: '使用者管理', icon: 'user' },
    { key: 'settings', label: '下載操作日誌', icon: 'downloadFilled' },
  ];

  function NavItem({ item, active, onClick, propCount, newInq, dark }) {
    const [hover, setHover] = React.useState(false);
    const Icon = Icons[item.icon];
    const color = dark
      ? (active ? 'var(--color-dark)' : 'rgba(255,255,255,0.75)')
      : (active ? '#fff' : 'var(--gray-700)');
    const bg = dark
      ? (active ? '#fff' : (hover ? 'rgba(255,255,255,0.08)' : 'transparent'))
      : (active ? 'var(--color-dark)' : (hover ? 'var(--primary-100)' : 'transparent'));
    return h('button', {
      onClick,
      onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
      style: {
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        padding: '9px 14px', borderRadius: 'var(--radius-lg)', border: 'none',
        fontFamily: 'var(--font-sans)', fontSize: 14, textAlign: 'left', cursor: 'pointer',
        fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-regular)',
        color, background: bg,
        transition: 'background 120ms ease, color 120ms ease',
      },
    },
      h('span', { style: { display: 'flex', flexShrink: 0 } }, h(Icon, { size: 18 })),
      h('span', { style: { flex: 1 } }, item.label),
      item.badge === 'prop' && propCount != null && h('span', {
        style: badgeStyle(false, 'var(--mta-gold)', 'var(--color-dark)'),
      }, propCount),
      item.badge === 'inq' && newInq > 0 && h('span', {
        style: badgeStyle(active, 'var(--error-500)'),
      }, newInq),
    );
  }
  const badgeStyle = (active, bg, fg) => ({
    background: active ? 'rgba(255,255,255,0.22)' : bg, color: fg || '#fff',
    fontSize: 11, fontWeight: 700, padding: '1px 8px', borderRadius: 999,
    fontFamily: 'var(--font-sans)', minWidth: 20, textAlign: 'center',
  });

  function Sidebar({ view, role, roleConfig, onNav, propCount, newInq, sidebarStyle, onLogout, onAccount }) {
    const nav = NAV.filter(n => roleConfig.nav.includes(n.key));
    const dark = sidebarStyle === 'dark';
    const divider = dark ? 'rgba(255,255,255,0.12)' : 'var(--border-default)';
    return h('aside', {
      id: 'mta-sidebar',
      style: {
        background: dark ? 'var(--gray-900)' : '#fff',
        borderRight: `1px solid ${dark ? 'transparent' : 'var(--border-default)'}`,
        display: 'flex', flexDirection: 'column', padding: '20px 14px 18px',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', zIndex: 20,
      },
    },
      // Logo — Modtate stacked logo
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 6px 18px', marginBottom: 10, borderBottom: `1px solid ${divider}` } },
        h('img', { src: (dark ? ((window.__resources && window.__resources.logoWhite) || 'app/logo-white.png') : ((window.__resources && window.__resources.logoMain) || 'app/logo.png')), alt: 'Modtate', style: { height: dark ? 64 : 76, width: 'auto', display: 'block' } })),
      // Nav
      h('nav', { style: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 } },
        nav.map(item => h(NavItem, { key: item.key, item, active: view === item.key, onClick: () => onNav(item.key), propCount, newInq, dark }))),
      // User footer
      h('div', { style: { marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${divider}` } },
        h('div', { onClick: onAccount, title: '我的帳號', style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer' } },
          h(Avatar, { text: roleConfig.initial, dark: !dark, style: dark ? { background: 'rgba(255,255,255,0.15)', color: '#fff' } : null }),
          h('div', { style: { minWidth: 0, flex: 1 } },
            h('div', { style: { fontSize: 13, fontWeight: 600, color: dark ? '#fff' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, roleConfig.name),
            h('div', { style: { fontSize: 11, color: dark ? 'rgba(255,255,255,0.5)' : 'var(--gray-400)' } }, role)),
          h('button', { title: '登出', onClick: (e) => { e.stopPropagation(); onLogout && onLogout(); }, style: { background: 'none', border: 'none', cursor: 'pointer', color: dark ? 'rgba(255,255,255,0.6)' : 'var(--gray-400)', padding: 2, display: 'flex', flexShrink: 0 } }, h(Icons.logout, { size: 16 })))),
    );
  }

  window.MTASidebar = Sidebar;
})();
