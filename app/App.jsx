/* App root — state, routing, role gating, tweaks — mounts #root */
(function () {
  const h = React.createElement;
  const M = window.MTA;
  const Sidebar = window.MTASidebar, Header = window.MTAHeader;
  const Dashboard = window.MTADashboard, Properties = window.MTAProperties;
  const PropertyDetail = window.MTAPropertyDetail, AddProperty = window.MTAAddProperty, EditProperty = window.MTAEditProperty;
  const Tenants = window.MTATenants, Members = window.MTAMembers, Inquiries = window.MTAInquiries;
  const Account = window.MTAAccount;
  const Login = window.MTALogin;
  const Toast = window.MTAUI.Toast, useToast = window.MTAUI.useToast;
  const { useTweaks, TweaksPanel, TweakSection, TweakRadio } = window;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "sidebarTheme": "dark",
    "kpiTone": "mono",
    "filterStyle": "panel",
    "startRole": "老闆"
  }/*EDITMODE-END*/;

  const PARENT = { propDetail: 'properties', addProperty: 'properties', editProperty: 'properties' };
  const parentOf = (v) => PARENT[v] || v;

  function enrichOne(id, role, overrides) {
    const raw = M.PROPERTIES.find(p => p.id === id);
    if (!raw) return null;
    const p = { ...raw, ...(overrides[id] || {}) };
    const myCodes = M.MY_STAFF_CODES[M.ROLE_CONFIG[role].name] || [];
    const category = M.STORE_TYPES.includes(p.type) ? 'store' : 'office';
    const storeType = p.storeType || (category === 'store' ? M.FILTERS.storeType[M.hashId(p.id) % M.FILTERS.storeType.length] : '');
    return { ...p, category, storeType, photos: (overrides[id] && overrides[id]._photos) || M.photosFor(p), canSeeContact: role !== '業務' || myCodes.includes(p.staff) };
  }

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [toast, flash] = useToast();
    React.useEffect(() => { window.MTAToastFlash = flash; return () => { if (window.MTAToastFlash === flash) delete window.MTAToastFlash; }; }, [flash]);
    const [authed, setAuthed] = React.useState(false);
    const [role, setRole] = React.useState(TWEAK_DEFAULTS.startRole);
    const [sessionName, setSessionName] = React.useState(null);
    const [view, setView] = React.useState('properties');
    const [overrides, setOverrides] = React.useState({});
    const [deletedIds, setDeletedIds] = React.useState([]);
    const [detailId, setDetailId] = React.useState(null);
    const [detailMode, setDetailMode] = React.useState('summary');
    const [addCategory, setAddCategory] = React.useState('office');
    const [editing, setEditing] = React.useState(null);
    const [shareCopied, setShareCopied] = React.useState(false);
    const [showSwitcher, setShowSwitcher] = React.useState(false);
    const [mobOpen, setMobOpen] = React.useState(false);
    const [notifs, setNotifs] = React.useState(() => M.seedNotifs());
    const [notifOpen, setNotifOpen] = React.useState(false);
    const shareTimer = React.useRef(null);

    const nowStr = () => { const d = new Date(); return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
    const pushNotif = (text, forRoles, kind, propId) => setNotifs(n => [{ id: 'n-' + Date.now() + '-' + Math.round(Math.random() * 1e4), text, forRoles, kind: kind || 'info', time: nowStr(), read: false, propId }, ...n]);
    const visibleNotifs = notifs.filter(n => n.forRoles.includes(role));
    const unread = visibleNotifs.filter(n => !n.read).length;
    const toggleNotif = () => setNotifOpen(o => { const nv = !o; if (nv) setNotifs(list => list.map(n => n.forRoles.includes(role) ? { ...n, read: true } : n)); return nv; });
    const openFromNotif = (n) => { setNotifOpen(false); if (n.propId && M.PROPERTIES.find(p => p.id === n.propId)) openDetail(n.propId, 'full'); };

    const roleConfig = React.useMemo(() => {
      const base = M.ROLE_CONFIG[role];
      return sessionName ? { ...base, name: sessionName, initial: sessionName.trim()[0] || base.initial } : base;
    }, [role, sessionName]);
    const allowed = (v) => roleConfig.nav.includes(parentOf(v));

    // sync startRole tweak — only when the tweak itself changes while logged in,
    // never on the login transition (sign-in role must win)
    const lastStartRole = React.useRef(t.startRole);
    React.useEffect(() => {
      if (lastStartRole.current === t.startRole) return;
      lastStartRole.current = t.startRole;
      if (!authed) return;
      setRole(t.startRole);
      const cfg = M.ROLE_CONFIG[t.startRole];
      if (!cfg.nav.includes(parentOf(view))) setView('properties');
    }, [t.startRole, authed, view]);

    const signIn = (r, name) => { setRole(r); setSessionName(name || null); setView('properties'); setAuthed(true); };
    const logout = () => { setAuthed(false); setSessionName(null); setShowSwitcher(false); setMobOpen(false); };

    const navTo = (v) => { setView(v); setMobOpen(false); setShowSwitcher(false); };
    const switchRole = (r) => {
      setRole(r); setSessionName(null); setShowSwitcher(false);
      if (!M.ROLE_CONFIG[r].nav.includes(parentOf(view))) setView('properties');
    };
    const deleteProperty = (p) => { setDeletedIds(ids => ids.includes(p.id) ? ids : [...ids, p.id]); flash(`已刪除物件「${p.name}」`); };
    const startEdit = (p) => { setEditing(p.id); setView('editProperty'); };
    const saveEdit = (form) => { const name = form.name || (M.PROPERTIES.find(x => x.id === editing) || {}).name || ''; setOverrides(o => ({ ...o, [editing]: { ...(o[editing] || {}), ...form } })); setEditing(null); setView('properties'); flash(`已儲存物件變更「${name}」`); };
    const addProperty = (form, isDraft) => { const nm = (form && (form.buildingName || form.name)) || '未命名物件'; setView('properties'); flash(isDraft ? '已儲存為草稿' : `已新增物件「${nm}」`); if (!isDraft) pushNotif(`${roleConfig.name} 新增了物件「${nm}」`, ['老闆', '業務', '行政'], 'property'); };
    const onRemarkAdded = (propName, propId, isReply) => pushNotif(`${roleConfig.name} ${isReply ? `在「${propName}」的討論串有新回覆` : `在「${propName}」新增了備註`}`, ['老闆', '業務'], 'remark', propId);
    const openDetail = (id, mode) => { setDetailId(id); setDetailMode(mode || 'summary'); setView('propDetail'); };
    const doShare = (id) => { try { navigator.clipboard && navigator.clipboard.writeText('https://modtate.com/share/' + id); } catch (e) {} setShareCopied(true); flash('已複製分享連結'); clearTimeout(shareTimer.current); shareTimer.current = setTimeout(() => setShareCopied(false), 2000); };

    const allProps = M.PROPERTIES.map(r => ({ ...r, ...(overrides[r.id] || {}) }));
    const propCount = allProps.length;
    const newInq = M.INQUIRIES.filter(i => i.status === 'new').length;

    if (!authed) return h(Login, { onSignIn: signIn });

    let content;
    if (view === 'dashboard') content = h(Dashboard, { inquiries: M.INQUIRIES, onNav: allowed('inquiries') ? navTo : null, kpiTone: t.kpiTone });
    else if (view === 'properties') content = h(Properties, { role, overrides, deletedIds, onOpenDetail: openDetail, onEdit: startEdit, onDelete: deleteProperty, filterStyle: t.filterStyle, onAdd: (cat) => { setAddCategory(cat || 'office'); setView('addProperty'); } });
    else if (view === 'propDetail') { const p = enrichOne(detailId, role, overrides); content = p ? h(PropertyDetail, { p, role, mode: detailMode, userName: roleConfig.name, onBack: () => setView('properties'), onEdit: () => startEdit(p), onShare: () => doShare(p.id), shareCopied, onRemarkAdded, onDelete: (pp) => { deleteProperty(pp); setView('properties'); } }) : null; }
    else if (view === 'addProperty') content = h(AddProperty, { role, category: addCategory, onBack: () => setView('properties'), onSaved: addProperty });
    else if (view === 'editProperty') { const p = enrichOne(editing, role, overrides); content = p ? h(EditProperty, { p, role, onCancel: () => { setEditing(null); setView('properties'); }, onSave: saveEdit }) : null; }
    else if (view === 'inquiries') content = h(Inquiries);
    else if (view === 'tenants') content = h(Tenants, { role });
    else if (view === 'members') content = h(Members);
    else if (view === 'account') content = h(Account, { roleConfig, role, onBack: () => setView('properties') });

    return h('div', { id: 'mta-grid', style: { display: 'grid', gridTemplateColumns: '256px 1fr', minHeight: '100vh', background: 'var(--surface-page)', color: 'var(--text-primary)', fontSize: 14 } },
      h('div', { id: 'mta-overlay', className: mobOpen ? 'mob-open' : '', onClick: () => setMobOpen(false) }),
      h('div', { id: 'mta-sidebar-wrap', className: mobOpen ? 'mob-open' : '' },
        h(Sidebar, { view: parentOf(view), role, roleConfig, onNav: navTo, propCount, newInq, sidebarStyle: t.sidebarTheme, onLogout: logout, onAccount: () => setView('account') })),
      h('main', { style: { minWidth: 0, display: 'flex', flexDirection: 'column' } },
        h(Header, { view, role, roleConfig, onOpenNav: () => setMobOpen(true), showSwitcher, onToggleSwitcher: () => { setShowSwitcher(s => !s); setNotifOpen(false); }, onSwitchRole: switchRole, onLogout: logout, onAccount: () => { setShowSwitcher(false); setView('account'); }, notifs: visibleNotifs, unread, notifOpen, onToggleNotif: () => { toggleNotif(); setShowSwitcher(false); }, onOpenFromNotif: openFromNotif }),
        h('div', { style: { padding: 28, flex: 1 } }, content)),
      h(TweaksPanel, null,
        h(TweakSection, { label: '外觀' }),
        h(TweakRadio, { label: '側欄主題', value: t.sidebarTheme, options: [{ value: 'light', label: '淺色' }, { value: 'dark', label: '深色' }], onChange: (v) => setTweak('sidebarTheme', v) }),
        h(TweakRadio, { label: 'KPI 圖示', value: t.kpiTone, options: [{ value: 'mono', label: '單色' }, { value: 'tinted', label: '狀態色' }], onChange: (v) => setTweak('kpiTone', v) }),
        h(TweakRadio, { label: '物件篩選樣式', value: t.filterStyle, options: [{ value: 'panel', label: '展開面板' }, { value: 'pills', label: '膠囊列' }], onChange: (v) => setTweak('filterStyle', v) }),
        h(TweakSection, { label: '角色' }),
        h(TweakRadio, { label: '起始角色', value: t.startRole, options: ['老闆', '業務', '行政', '業務/行政'], onChange: (v) => setTweak('startRole', v) })),
      h(Toast, { toast }));
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
