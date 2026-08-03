/* Header with role switcher — window.MTAHeader */
(function () {
  const h = React.createElement;
  const { Icons, Avatar } = window.MTAUI;

  const PAGE_TITLES = { dashboard: '儀表板', properties: '物件管理', inquiries: '詢問管理', tenants: '來電紀錄', members: '使用者管理', propDetail: '物件詳細', addProperty: '新增物件', editProperty: '編輯物件' };
  const ROLE_LIST = ['老闆', '業務', '行政', '業務/行政'];

  function RoleRow({ role, cfg, active, onClick }) {
    const [hover, setHover] = React.useState(false);
    return h('button', {
      onClick, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
      style: { width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: 'none', borderTop: '1px solid var(--border-subtle)', background: active ? 'var(--primary-100)' : (hover ? 'var(--surface-sunken)' : '#fff'), cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
    },
      h(Avatar, { text: cfg.initial, size: 34 }),
      h('div', { style: { flex: 1 } },
        h('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' } }, cfg.name),
        h('div', { style: { fontSize: 11, color: 'var(--gray-500)', fontWeight: 600 } }, role)),
      active && h('span', { style: { display: 'flex', color: 'var(--color-dark)' } }, h(Icons.check, { size: 16, stroke: 2.2 })),
    );
  }

  function Header({ view, role, roleConfig, onOpenNav, showSwitcher, onToggleSwitcher, onSwitchRole, onLogout, onAccount, notifs, unread, notifOpen, onToggleNotif, onOpenFromNotif }) {
    const { ROLE_CONFIG } = window.MTA;
    const NOTIF_ICON = { property: Icons.building, remark: Icons.inquiry };
    return h('header', {
      style: { borderBottom: '1px solid var(--border-default)', padding: '13px 28px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 30, background: 'var(--surface-page)' },
    },
      h('button', { id: 'mta-burger', onClick: onOpenNav, style: { width: 36, height: 36, borderRadius: 999, background: 'var(--primary-100)', border: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 } },
        h('svg', { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', stroke: 'var(--gray-700)', strokeWidth: 1.8, strokeLinecap: 'round' }, h('path', { d: 'M2 4h14M2 9h14M2 14h14' }))),
      // breadcrumb removed
      h('div', { style: { flex: 1 } }),
      // notification bell
      h('div', { style: { position: 'relative' } },
        h('button', { onClick: onToggleNotif, title: '通知', style: { position: 'relative', width: 40, height: 40, borderRadius: 999, border: '1px solid var(--border-default)', background: notifOpen ? 'var(--primary-100)' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-700)' } },
          h(Icons.bell, { size: 19 }),
          unread > 0 && h('span', { style: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--error-500)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface-page)' } }, unread > 9 ? '9+' : unread)),
        notifOpen && h('div', { style: { position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-popover)', width: 340, zIndex: 100, overflow: 'hidden' } },
          h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' } },
            h('span', { style: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' } }, '通知'),
            unread > 0 && h('span', { style: { fontSize: 11, fontWeight: 600, color: 'var(--gray-500)' } }, unread + ' 則未讀')),
          h('div', { style: { maxHeight: 360, overflowY: 'auto' } },
            (notifs && notifs.length)
              ? notifs.map((n) => { const Ic = NOTIF_ICON[n.kind] || Icons.bell; return h('button', { key: n.id, onClick: () => onOpenFromNotif && onOpenFromNotif(n), style: { width: '100%', display: 'flex', gap: 11, padding: '12px 16px', border: 'none', borderTop: '1px solid var(--border-subtle)', background: n.read ? '#fff' : 'var(--primary-100)', cursor: n.propId ? 'pointer' : 'default', textAlign: 'left', fontFamily: 'inherit' } },
                h('span', { style: { flexShrink: 0, width: 32, height: 32, borderRadius: 999, background: 'var(--color-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, h(Ic, { size: 16, stroke: 1.7 })),
                h('span', { style: { flex: 1, minWidth: 0 } },
                  h('span', { style: { display: 'block', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 } }, n.text),
                  h('span', { style: { display: 'block', fontSize: 11, color: 'var(--gray-400)', fontFamily: 'var(--font-mono)', marginTop: 3 } }, n.time)),
                !n.read && h('span', { style: { flexShrink: 0, alignSelf: 'center', width: 8, height: 8, borderRadius: 999, background: 'var(--error-500)' } })); })
              : h('div', { style: { padding: '36px 16px', textAlign: 'center', fontSize: 13, color: 'var(--gray-400)' } }, '目前沒有通知')))),
      // role switcher
      h('div', { style: { position: 'relative' } },
        h('div', { onClick: onToggleSwitcher, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px 5px 5px', border: '1px solid var(--border-default)', borderRadius: 999, cursor: 'pointer', background: '#fff' } },
          h(Avatar, { text: roleConfig.initial }),
          h('div', null,
            h('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 } }, roleConfig.name),
            h('div', { style: { fontSize: 11, color: 'var(--gray-500)' } }, role)),
          h('span', { style: { display: 'flex', color: 'var(--gray-500)', marginLeft: 2 } }, h(Icons.chevronDown, { size: 14 }))),
        showSwitcher && h('div', { style: { position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-popover)', width: 230, zIndex: 100, overflow: 'hidden' } },
          h('div', { style: { padding: '10px 14px 8px', fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', letterSpacing: 0.5, textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)' } }, '切換角色'),
          ROLE_LIST.map(r => h(RoleRow, { key: r, role: r, cfg: ROLE_CONFIG[r], active: r === role, onClick: () => onSwitchRole(r) })),
          h('button', { onClick: onAccount, style: { width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', border: 'none', borderTop: '1px solid var(--border-subtle)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', textAlign: 'left' } }, h(Icons.settings, { size: 16 }), '帳號設定'),
          h('button', { onClick: onLogout, style: { width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', border: 'none', borderTop: '1px solid var(--border-subtle)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--error-500)', textAlign: 'left' } }, h(Icons.logout, { size: 16 }), '登出'))),
    );
  }

  window.MTAHeader = Header;
})();
