/* Members (使用者管理) — add / edit / disable flows — window.MTAMembers */
(function () {
  const h = React.createElement;
  const { Button, Card, Input, Select } = window.ModtateDesignSystem_410f4d;
  const { Icons, StatusBadge, RolePill, Avatar } = window.MTAUI;
  const M = window.MTA;
  const thBase = { textAlign: 'left', fontWeight: 600, color: 'var(--gray-400)', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', padding: '10px 12px', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' };
  const ghostBtn = { padding: '5px 11px', border: '1px solid var(--border-default)', borderRadius: 999, background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit' };

  function MRow({ m, onEdit, onToggle, dimmed }) {
    const [hover, setHover] = React.useState(false);
    const td = { padding: '13px 12px', borderBottom: '1px solid var(--border-default)' };
    const inactive = m.status === 'inactive';
    return h('tr', { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: { background: hover ? 'var(--surface-sunken)' : 'transparent', opacity: inactive ? 0.6 : 1 } },
      h('td', { style: { ...td, paddingLeft: 22, whiteSpace: 'nowrap' } }, h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } }, h(Avatar, { text: m.name[0], size: 34, dark: !inactive }), h('div', { style: { fontWeight: 600, color: 'var(--text-primary)' } }, m.name))),
      h('td', { style: { ...td, color: 'var(--gray-600)', fontSize: 13, fontFamily: 'var(--font-mono)' } }, m.email),
      h('td', { style: td }, h(RolePill, { role: m.role })),
      h('td', { style: { ...td, color: 'var(--gray-400)', fontSize: 12, fontFamily: 'var(--font-mono)' } }, m.joined),
      h('td', { style: td }, h(StatusBadge, { kind: 'member', status: m.status })),
      h('td', { style: { ...td, paddingRight: 22, textAlign: 'right' } }, h('div', { style: { display: 'flex', gap: 6, justifyContent: 'flex-end' } },
        h('button', { style: ghostBtn, onClick: () => onEdit(m) }, '編輯'),
        h('button', { style: inactive ? { ...ghostBtn, borderColor: 'var(--success-200)', color: 'var(--success-700)' } : { ...ghostBtn, borderColor: 'var(--error-200)', color: 'var(--error-500)' }, onClick: () => onToggle(m) }, inactive ? '啟用' : '停用'))));
  }

  // ── modal shell ──────────────────────────────────────────────
  function Modal({ title, onClose, children, maxWidth = 440 }) {
    return h('div', { onClick: onClose, style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 } },
      h('div', { onClick: (e) => e.stopPropagation(), style: { background: '#fff', borderRadius: 'var(--radius-2xl)', width: '100%', maxWidth, boxShadow: '0 20px 50px rgba(0,0,0,0.25)', padding: '28px 28px 24px' } },
        h('div', { style: { position: 'relative', textAlign: 'center', marginBottom: 24 } },
          h('h2', { style: { fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' } }, title),
          h('button', { onClick: onClose, style: { position: 'absolute', top: -4, right: -4, width: 32, height: 32, borderRadius: 999, border: 'none', background: 'var(--primary-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' } }, h(Icons.close, { size: 16 }))),
        children));
  }

  function AddModal({ onClose, onSave }) {
    const [form, setForm] = React.useState({ name: '', email: '', role: '業務' });
    return h(Modal, { title: '新增使用者', onClose },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 18 } },
        h(Input, { label: '姓名', required: true, placeholder: '例：王小明', value: form.name, onChange: (e) => setForm(s => ({ ...s, name: e.target.value })) }),
        h(Input, { label: 'Email', required: true, placeholder: '例：wang@modtate.com', value: form.email, onChange: (e) => setForm(s => ({ ...s, email: e.target.value })) }),
        h(Select, { label: '角色', required: true, options: ['老闆', '業務', '行政', '業務/行政'], value: form.role, onChange: (v) => setForm(s => ({ ...s, role: v })) })),
      h('p', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 14, lineHeight: 1.6 } }, '系統將寄送設定密碼的邀請信至此 Email，使用者首次登入時自行設定密碼。'),
      h('div', { style: { display: 'flex', gap: 10, marginTop: 22 } },
        h(Button, { variant: 'outline', onClick: onClose, style: { flex: 1 } }, '取消'),
        h(Button, { variant: 'primary', onClick: () => { if (form.name && form.email) onSave(form); else onClose(); }, style: { flex: 1 } }, '新增使用者')));
  }

  function EditModal({ member, onClose, onSave }) {
    const [form, setForm] = React.useState({ name: member.name, email: member.email, role: member.role });
    const [resetSent, setResetSent] = React.useState(false);
    const changed = form.name !== member.name || form.email !== member.email || form.role !== member.role;
    return h(Modal, { title: '編輯使用者', onClose },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 18, borderBottom: '1px solid var(--border-subtle)' } },
        h(Avatar, { text: member.name[0], size: 44 }),
        h('div', null,
          h('div', { style: { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' } }, member.name),
          h('div', { style: { fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-mono)' } }, '加入於 ' + member.joined))),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 18 } },
        h(Input, { label: '姓名', required: true, value: form.name, onChange: (e) => setForm(s => ({ ...s, name: e.target.value })) }),
        h(Input, { label: 'Email', required: true, value: form.email, onChange: (e) => setForm(s => ({ ...s, email: e.target.value })) }),
        h(Select, { label: '角色', required: true, options: ['老闆', '業務', '行政', '業務/行政'], value: form.role, onChange: (v) => setForm(s => ({ ...s, role: v })) })),
      // password reset row
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 18, padding: '12px 14px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)' } },
        h('div', null,
          h('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' } }, '密碼'),
          h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginTop: 2 } }, resetSent ? '已寄出重設密碼連結至 ' + form.email : '寄送重設密碼連結給此使用者')),
        resetSent
          ? h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--success-700)', whiteSpace: 'nowrap' } }, h(Icons.check, { size: 15, stroke: 2.2 }), '已寄出')
          : h('button', { onClick: () => setResetSent(true), style: { ...ghostBtn, whiteSpace: 'nowrap' } }, '重設密碼')),
      h('div', { style: { display: 'flex', gap: 10, marginTop: 24 } },
        h(Button, { variant: 'outline', onClick: onClose, style: { flex: 1 } }, '取消'),
        h(Button, { variant: 'primary', disabled: !changed || !form.name || !form.email, onClick: () => onSave(member, form), style: { flex: 1 } }, '儲存變更')));
  }

  function ConfirmToggle({ member, onClose, onConfirm }) {
    const inactive = member.status === 'inactive';
    const enabling = inactive;
    return h(Modal, { title: enabling ? '啟用使用者' : '停用使用者', onClose, maxWidth: 420 },
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, marginTop: -8 } },
        h('div', { style: { width: 52, height: 52, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: enabling ? 'var(--success-100)' : 'var(--error-100)', color: enabling ? 'var(--success-700)' : 'var(--error-500)' } }, h(enabling ? Icons.check2 : Icons.lock, { size: 24 })),
        h('div', { style: { fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7 } },
          enabling
            ? h('span', null, '確定要啟用 ', h('strong', null, member.name), ' 嗎？啟用後該使用者可重新登入系統。')
            : h('span', null, '確定要停用 ', h('strong', null, member.name), ' 嗎？停用後該使用者將無法登入，但歷史資料與承辦紀錄會保留。'))),
      h('div', { style: { display: 'flex', gap: 10, marginTop: 26 } },
        h(Button, { variant: 'outline', onClick: onClose, style: { flex: 1 } }, '取消'),
        enabling
          ? h(Button, { variant: 'primary', onClick: () => onConfirm(member), style: { flex: 1 } }, '確定啟用')
          : h('button', { onClick: () => onConfirm(member), style: { flex: 1, padding: '11px 22px', border: 'none', borderRadius: 999, background: 'var(--error-500)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, '確定停用')));
  }

  // toast
  function Toast({ msg }) {
    return h('div', { style: { position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: 'var(--color-dark)', color: '#fff', padding: '11px 20px', borderRadius: 999, fontSize: 13, fontWeight: 500, boxShadow: '0 8px 28px rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', gap: 8 } },
      h(Icons.check, { size: 15, stroke: 2.4 }), msg);
  }

  function Members() {
    const [extra, setExtra] = React.useState([]);
    const [edits, setEdits] = React.useState({});       // email -> {name,email,role}
    const [statuses, setStatuses] = React.useState({}); // email -> 'active'|'inactive'
    const [add, setAdd] = React.useState(false);
    const [editing, setEditing] = React.useState(null);
    const [toggling, setToggling] = React.useState(null);
    const [toast, setToast] = React.useState('');
    const [search, setSearch] = React.useState('');
    const [roleF, setRoleF] = React.useState('所有角色');
    const toastTimer = React.useRef(null);
    const flash = (msg) => { setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 2200); };

    // resolve effective member records (apply edits + status overrides, key by original email)
    const base = M.MEMBERS.concat(extra).map(m => {
      const e = edits[m.email] || {};
      return { ...m, ...e, status: statuses[m.email] || m.status, _key: m.email };
    });
    const list = base.filter(m => (roleF === '所有角色' || m.role === roleF) && (!search || m.name.includes(search) || m.email.toLowerCase().includes(search.toLowerCase())));

    const saveAdd = (f) => { const now = new Date(); const joined = now.getFullYear() + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + String(now.getDate()).padStart(2, '0'); setExtra(e => [...e, { name: f.name, email: f.email, role: f.role, company: 'Modtate', joined, status: 'active' }]); setAdd(false); flash('已新增使用者 ' + f.name); };
    const saveEdit = (member, form) => { setEdits(s => ({ ...s, [member._key]: { name: form.name, email: form.email, role: form.role } })); setEditing(null); flash('已更新 ' + form.name + ' 的資料'); };
    const confirmToggle = (member) => { const next = member.status === 'inactive' ? 'active' : 'inactive'; setStatuses(s => ({ ...s, [member._key]: next })); setToggling(null); flash(member.name + (next === 'inactive' ? ' 已停用' : ' 已啟用')); };

    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
        h('h1', { style: { fontSize: 22, fontWeight: 700 } }, '使用者管理'),
        h(Button, { variant: 'primary', size: 'sm', iconLeft: h(Icons.plus, { size: 14, stroke: 2 }), onClick: () => setAdd(true) }, '新增使用者')),
      h(Card, { padding: 0, style: { overflow: 'hidden' } },
        h('div', { style: { display: 'flex', gap: 10, padding: '16px 22px', borderBottom: '1px solid var(--border-default)', alignItems: 'center', flexWrap: 'wrap' } },
          h('div', { style: { minWidth: 260 } }, h(Input, { placeholder: '搜尋姓名或 Email…', value: search, onChange: (e) => setSearch(e.target.value) })),
          h('div', { style: { width: 150 } }, h(Select, { options: ['所有角色', '老闆', '業務', '行政', '業務/行政'], value: roleF, onChange: setRoleF })),
          h('span', { style: { fontSize: 12, color: 'var(--gray-400)', marginLeft: 'auto' } }, `共 ${list.length} 名會員`)),
        h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 13 } },
          h('thead', null, h('tr', { style: { background: 'var(--surface-sunken)' } },
            ['使用者名稱', 'Email', '角色', '加入時間', '狀態', ''].map((t, i) => h('th', { key: i, style: { ...thBase, ...(i === 0 ? { paddingLeft: 22 } : {}) } }, t)))),
          h('tbody', null, list.map((m) => h(MRow, { key: m._key, m, onEdit: setEditing, onToggle: setToggling }))))),
      add && h(AddModal, { onClose: () => setAdd(false), onSave: saveAdd }),
      editing && h(EditModal, { member: editing, onClose: () => setEditing(null), onSave: saveEdit }),
      toggling && h(ConfirmToggle, { member: toggling, onClose: () => setToggling(null), onConfirm: confirmToggle }),
      toast && h(Toast, { msg: toast }));
  }

  window.MTAMembers = Members;
})();
