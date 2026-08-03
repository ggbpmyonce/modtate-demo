/* 我的帳號 — current-user profile + password reset — window.MTAAccount */
(function () {
  const h = React.createElement;
  const { Button, Card, Input } = window.ModtateDesignSystem_410f4d;
  const { Icons, RolePill, Avatar } = window.MTAUI;

  function ChangePassword({ onDone }) {
    const [cur, setCur] = React.useState('');
    const [pw, setPw] = React.useState('');
    const [pw2, setPw2] = React.useState('');
    const [err, setErr] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    const submit = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (!cur) return setErr('請輸入目前的密碼。');
      if (pw.length < 8) return setErr('新密碼至少需 8 碼。');
      if (pw !== pw2) return setErr('兩次輸入的新密碼不一致。');
      setErr(''); setBusy(true);
      setTimeout(() => { setBusy(false); setCur(''); setPw(''); setPw2(''); if (window.MTAToastFlash) window.MTAToastFlash('密碼已更新'); if (onDone) onDone(); }, 600);
    };
    return h('form', { onSubmit: submit, style: { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 } },
      err && h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--error-100)', border: '1px solid var(--error-200)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--error-700)' } }, h(Icons.close, { size: 14 }), err),
      h(Input, { label: '目前密碼', required: true, type: 'password', placeholder: '輸入目前密碼', value: cur, onChange: (e) => setCur(e.target.value) }),
      h('div', null,
        h(Input, { label: '新密碼', required: true, type: 'password', placeholder: '至少 8 碼', value: pw, onChange: (e) => setPw(e.target.value) }),
        h('p', { style: { fontSize: 12, color: pw && pw.length < 8 ? 'var(--error-500)' : 'var(--gray-400)', marginTop: 6 } }, '密碼至少 8 碼，建議包含英文與數字。')),
      h(Input, { label: '確認新密碼', required: true, type: 'password', placeholder: '再次輸入新密碼', value: pw2, onChange: (e) => setPw2(e.target.value) }),
      h('div', null, h(Button, { variant: 'primary', type: 'submit', disabled: busy }, busy ? '更新中…' : '更新密碼')));
  }

  function Account({ roleConfig, role, onBack }) {
    const email = roleConfig.email || 'user@modtate.com';
    const field = (label, value) => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
      h('span', { style: { fontSize: 12, color: 'var(--gray-500)' } }, label),
      h('span', { style: { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' } }, value));

    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 } },
      h('h1', { style: { fontSize: 22, fontWeight: 700 } }, '我的帳號'),
      // identity card
      h(Card, { padding: 24, style: { borderRadius: 'var(--radius-2xl)' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 18 } },
          h(Avatar, { text: roleConfig.initial, size: 64, style: { fontSize: 26 } }),
          h('div', { style: { flex: 1, minWidth: 0 } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
              h('span', { style: { fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' } }, roleConfig.name),
              h(RolePill, { role })),
            h('div', { style: { fontSize: 14, color: 'var(--gray-500)', marginTop: 4, fontFamily: 'var(--font-mono)' } }, email)))),
      // 個人資料
      h(Card, { padding: 24, style: { borderRadius: 'var(--radius-xl)' } },
        h('h3', { style: { fontSize: 16, fontWeight: 700, marginBottom: 18 } }, '個人資料'),
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 20px' } },
          field('使用者名稱', roleConfig.name),
          field('Email', h('span', { style: { fontFamily: 'var(--font-mono)' } }, email)),
          field('角色', roleConfig.title)),
        h('div', { style: { marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border-subtle)', fontSize: 13, color: 'var(--gray-400)' } }, '如需修改姓名、Email 或角色，請聯絡系統老闆於「使用者管理」調整。')),
      // 變更密碼
      h(Card, { padding: 24, style: { borderRadius: 'var(--radius-xl)' } },
        h('h3', { style: { fontSize: 16, fontWeight: 700, marginBottom: 4 } }, '變更密碼'),
        h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginBottom: 18 } }, '為保護帳號安全，請定期更新密碼。'),
        h(ChangePassword)));
  }

  window.MTAAccount = Account;
})();
