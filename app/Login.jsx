/* Auth flow — system init (老闆 setup), login, forgot/reset password — window.MTALogin */
(function () {
  const h = React.createElement;
  const { Input, Button, Checkbox } = window.ModtateDesignSystem_410f4d;
  const { Icons } = window.MTAUI;

  const INIT_KEY = 'mta_initialized_v1';
  const isInitialized = () => { try { return localStorage.getItem(INIT_KEY) === '1'; } catch (e) { return false; } };
  const markInitialized = () => { try { localStorage.setItem(INIT_KEY, '1'); } catch (e) {} };
  const resetInit = () => { try { localStorage.removeItem(INIT_KEY); } catch (e) {} };

  // demo accounts (exist once system is initialized) → role
  const ACCOUNTS = { 'aven@modtate.com': '老闆', 'wu@modtate.com': '業務', 'wang@modtate.com': '行政', 'lin@modtate.com': '業務/行政' };
  const DEMO = [
    { email: 'aven@modtate.com', label: '老闆', name: 'Aven Hsu' },
    { email: 'wu@modtate.com', label: '業務', name: '小巫' },
    { email: 'wang@modtate.com', label: '行政', name: '王小美' },
    { email: 'lin@modtate.com', label: '業務/行政', name: '林雅婷' },
  ];

  const validEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || '').trim());

  // ── shared layout ───────────────────────────────────────────
  function Shell({ children }) {
    return h('div', { id: 'mta-login', style: { display: 'grid', gridTemplateColumns: '1.05fr 1fr', minHeight: '100vh', fontFamily: 'var(--font-sans)' } },
      h('div', { id: 'mta-login-brand', style: { background: 'var(--color-dark)', color: '#fff', padding: '52px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' } },
        h('img', { src: ((window.__resources && window.__resources.logoWhite) || 'app/logo-white.png'), alt: 'Modtate', style: { height: 84, width: 119, objectFit: 'contain', objectPosition: 'left center', alignSelf: 'flex-start', display: 'block', position: 'relative', zIndex: 1 } }),
        h('div', { style: { position: 'relative', zIndex: 1 } },
          h('div', { style: { fontSize: 38, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1.28 } }, '商辦租賃，', h('br'), '一站式後台管理。'),
          h('p', { style: { fontSize: 16, color: 'var(--gray-400)', marginTop: 18, maxWidth: 400, lineHeight: 1.7 } }, '物件、來電客戶與團隊權限集中管理，讓每一筆台北商辦租賃都井然有序。')),
        h('div', { style: { position: 'absolute', right: -120, bottom: -120, width: 380, height: 380, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' } }),
        h('div', { style: { position: 'absolute', right: -60, bottom: -60, width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' } })),
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#fff' } },
        h('div', { style: { width: '100%', maxWidth: 380 } }, children)));
  }

  const Banner = ({ kind, children }) => {
    const map = { error: ['var(--error-100)', 'var(--error-200)', 'var(--error-700)', Icons.close], success: ['var(--success-100)', 'var(--success-200)', 'var(--success-700)', Icons.check2], info: ['var(--info-100)', 'var(--info-100)', 'var(--info-700)', Icons.mail] };
    const [bg, bd, fg, Ic] = map[kind] || map.info;
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: bg, border: `1px solid ${bd}`, borderRadius: 'var(--radius-md)', fontSize: 13, color: fg, marginBottom: 18 } }, h(Ic, { size: 15 }), h('span', null, children));
  };
  const linkBtn = { background: 'none', border: 'none', padding: 0, color: 'var(--text-primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' };

  // ── 1. SETUP — first user becomes 老闆 ───────────────────────
  function Setup({ onComplete, onHasAccount }) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [pw, setPw] = React.useState('');
    const [pw2, setPw2] = React.useState('');
    const [err, setErr] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const pwOk = pw.length >= 8;
    const submit = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      setErr('');
      if (!name.trim()) return setErr('請輸入姓名。');
      if (!validEmail(email)) return setErr('請輸入有效的 Email。');
      if (!pwOk) return setErr('密碼至少需 8 碼。');
      if (pw !== pw2) return setErr('兩次輸入的密碼不一致。');
      setLoading(true);
      setTimeout(() => { setLoading(false); markInitialized(); onComplete({ name: name.trim(), email: email.trim(), role: '老闆' }); }, 600);
    };
    return h(Shell, null,
      h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 999, background: 'var(--primary-100)', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 16, whiteSpace: 'nowrap' } }, h('span', { style: { width: 6, height: 6, borderRadius: 999, background: 'var(--color-dark)', flexShrink: 0 } }), '系統初始化 · 第一步'),
      h('h1', { style: { fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' } }, '建立老闆帳號'),
      h('p', { style: { fontSize: 15, color: 'var(--gray-500)', margin: '8px 0 24px', lineHeight: 1.6 } }, '您是第一位設定此系統的人，將成為系統老闆（最高權限）。老闆帳號僅限一位，設定後即可登入並邀請團隊成員。'),
      err && h(Banner, { kind: 'error' }, err),
      h('form', { onSubmit: submit },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
          h(Input, { label: '姓名', required: true, placeholder: '例：Aven Hsu', value: name, onChange: (e) => setName(e.target.value) }),
          h(Input, { label: 'Email', required: true, type: 'email', placeholder: 'name@modtate.com', value: email, onChange: (e) => setEmail(e.target.value) }),
          h('div', null,
            h(Input, { label: '密碼', required: true, type: 'password', placeholder: '至少 8 碼', value: pw, onChange: (e) => setPw(e.target.value) }),
            h('p', { style: { fontSize: 12, color: pw && !pwOk ? 'var(--error-500)' : 'var(--gray-400)', marginTop: 6 } }, '密碼至少 8 碼，建議包含英文與數字。')),
          h(Input, { label: '確認密碼', required: true, type: 'password', placeholder: '再次輸入密碼', value: pw2, onChange: (e) => setPw2(e.target.value) }),
          h(Button, { variant: 'primary', type: 'submit', disabled: loading, style: { width: '100%' } }, loading ? '設定中…' : '完成設定並登入'))),
      h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 22, textAlign: 'center' } }, '系統已設定過？ ', h('button', { type: 'button', onClick: onHasAccount, style: linkBtn }, '前往登入')));
  }

  // ── 2. LOGIN ─────────────────────────────────────────────────
  function LoginForm({ bossAccount, onSignIn, onForgot, onReinit }) {
    const [email, setEmail] = React.useState(bossAccount ? bossAccount.email : 'aven@modtate.com');
    const [pw, setPw] = React.useState(bossAccount ? '' : 'modtate');
    const [remember, setRemember] = React.useState(true);
    const [err, setErr] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const submit = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      setErr('');
      const key = email.trim().toLowerCase();
      let role = ACCOUNTS[key];
      if (!role && bossAccount && key === bossAccount.email.toLowerCase()) role = '老闆';
      if (!role) return setErr('查無此帳號，請確認 Email 是否正確。');
      if (!pw) return setErr('請輸入密碼。');
      setLoading(true);
      const name = bossAccount && key === bossAccount.email.toLowerCase() ? bossAccount.name : null;
      setTimeout(() => { setLoading(false); onSignIn(role, name); }, 500);
    };
    const quick = (acc) => { setEmail(acc.email); setPw('modtate'); setErr(''); };
    return h(Shell, null,
      h('h1', { style: { fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' } }, '登入'),
      h('p', { style: { fontSize: 15, color: 'var(--gray-500)', margin: '8px 0 26px' } }, '歡迎回來，請輸入您的帳號資訊。'),
      err && h(Banner, { kind: 'error' }, err),
      h('form', { onSubmit: submit },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
          h(Input, { label: 'Email', required: true, type: 'email', placeholder: 'name@modtate.com', value: email, onChange: (e) => setEmail(e.target.value) }),
          h(Input, { label: '密碼', required: true, type: 'password', placeholder: '請輸入密碼', value: pw, onChange: (e) => setPw(e.target.value) }),
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            h(Checkbox, { label: '記住我', checked: remember, onChange: setRemember }),
            h('button', { type: 'button', onClick: onForgot, style: linkBtn }, '忘記密碼？')),
          h(Button, { variant: 'primary', type: 'submit', disabled: loading, style: { width: '100%' } }, loading ? '登入中…' : '登入'))),
      bossAccount
        ? h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 22, textAlign: 'center', lineHeight: 1.7 } }, '以老闆帳號登入：', h('br'), h('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 } }, bossAccount.email))
        : h('div', { style: { marginTop: 26, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' } },
          h('div', { style: { fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 } }, '示範帳號（點擊帶入）'),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
            DEMO.map(acc => h('button', { key: acc.email, type: 'button', onClick: () => quick(acc), style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', background: email === acc.email ? 'var(--primary-100)' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' } },
              h('span', { style: { minWidth: 26, height: 26, borderRadius: 999, background: 'var(--color-dark)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: acc.label.length > 2 ? '0 9px' : 0, whiteSpace: 'nowrap' } }, acc.label),
              h('span', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' } }, acc.name),
              h('span', { style: { fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' } }, acc.email)))),
          h('p', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 10, textAlign: 'center' } }, '密碼一律為 ', h('span', { style: { fontFamily: 'var(--font-mono)' } }, 'modtate'), ' · ', h('button', { type: 'button', onClick: onReinit, style: { ...linkBtn, fontSize: 12, color: 'var(--gray-500)' } }, '重新初始化系統'))));
  }

  // ── 3. FORGOT — request reset link ───────────────────────────
  function Forgot({ onBack, onSent }) {
    const [email, setEmail] = React.useState('');
    const [err, setErr] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const submit = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (!validEmail(email)) return setErr('請輸入有效的 Email。');
      setErr(''); setLoading(true);
      setTimeout(() => { setLoading(false); onSent(email.trim()); }, 600);
    };
    return h(Shell, null,
      h('button', { type: 'button', onClick: onBack, style: { ...linkBtn, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--gray-500)', marginBottom: 18 } }, h(Icons.arrowLeft, { size: 16, stroke: 2 }), '返回登入'),
      h('h1', { style: { fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' } }, '忘記密碼'),
      h('p', { style: { fontSize: 15, color: 'var(--gray-500)', margin: '8px 0 24px', lineHeight: 1.6 } }, '輸入您的帳號 Email，我們會寄送重設密碼的連結給您。'),
      err && h(Banner, { kind: 'error' }, err),
      h('form', { onSubmit: submit },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
          h(Input, { label: 'Email', required: true, type: 'email', placeholder: 'name@modtate.com', value: email, onChange: (e) => setEmail(e.target.value) }),
          h(Button, { variant: 'primary', type: 'submit', disabled: loading, style: { width: '100%' } }, loading ? '寄送中…' : '寄送重設連結'))));
  }

  // ── 4. SENT — confirmation ───────────────────────────────────
  function Sent({ email, onBack, onContinue }) {
    return h(Shell, null,
      h('div', { style: { width: 56, height: 56, borderRadius: 999, background: 'var(--success-100)', color: 'var(--success-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 } }, h(Icons.mail, { size: 26 })),
      h('h1', { style: { fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' } }, '連結已寄出'),
      h('p', { style: { fontSize: 15, color: 'var(--gray-500)', margin: '8px 0 24px', lineHeight: 1.7 } }, '我們已將重設密碼連結寄至 ', h('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 } }, email), '。請至信箱點擊連結以重設密碼，連結 30 分鐘內有效。'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        h(Button, { variant: 'primary', onClick: onContinue, style: { width: '100%' } }, '我已收到，設定新密碼'),
        h(Button, { variant: 'outline', onClick: onBack, style: { width: '100%' } }, '返回登入')),
      h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 22, textAlign: 'center' } }, '沒收到信？請檢查垃圾郵件，或 ', h('button', { type: 'button', onClick: onContinue, style: linkBtn }, '重新寄送')));
  }

  // ── 5. RESET — set new password ──────────────────────────────
  function Reset({ email, onDone }) {
    const [pw, setPw] = React.useState('');
    const [pw2, setPw2] = React.useState('');
    const [err, setErr] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const pwOk = pw.length >= 8;
    const submit = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (!pwOk) return setErr('密碼至少需 8 碼。');
      if (pw !== pw2) return setErr('兩次輸入的密碼不一致。');
      setErr(''); setLoading(true);
      setTimeout(() => { setLoading(false); onDone(); }, 600);
    };
    return h(Shell, null,
      h('h1', { style: { fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' } }, '設定新密碼'),
      h('p', { style: { fontSize: 15, color: 'var(--gray-500)', margin: '8px 0 24px', lineHeight: 1.6 } }, email ? h('span', null, '為帳號 ', h('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 } }, email), ' 設定新密碼。') : '請設定您的新密碼。'),
      err && h(Banner, { kind: 'error' }, err),
      h('form', { onSubmit: submit },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
          h('div', null,
            h(Input, { label: '新密碼', required: true, type: 'password', placeholder: '至少 8 碼', value: pw, onChange: (e) => setPw(e.target.value) }),
            h('p', { style: { fontSize: 12, color: pw && !pwOk ? 'var(--error-500)' : 'var(--gray-400)', marginTop: 6 } }, '密碼至少 8 碼，建議包含英文與數字。')),
          h(Input, { label: '確認新密碼', required: true, type: 'password', placeholder: '再次輸入新密碼', value: pw2, onChange: (e) => setPw2(e.target.value) }),
          h(Button, { variant: 'primary', type: 'submit', disabled: loading, style: { width: '100%' } }, loading ? '更新中…' : '更新密碼並登入'))));
  }

  // ── flow controller ─────────────────────────────────────────
  function Login({ onSignIn }) {
    const [boss, setBoss] = React.useState(null); // {name,email,role} once system set up this session
    const [mode, setMode] = React.useState(() => isInitialized() ? 'login' : 'setup');
    const [resetEmail, setResetEmail] = React.useState('');

    const completeSetup = (acct) => { setBoss(acct); onSignIn('老闆', acct.name); };
    const reinit = () => { resetInit(); setBoss(null); setMode('setup'); };

    if (mode === 'setup') return h(Setup, { onComplete: completeSetup, onHasAccount: () => setMode('login') });
    if (mode === 'forgot') return h(Forgot, { onBack: () => setMode('login'), onSent: (em) => { setResetEmail(em); setMode('sent'); } });
    if (mode === 'sent') return h(Sent, { email: resetEmail, onBack: () => setMode('login'), onContinue: () => setMode('reset') });
    if (mode === 'reset') return h(Reset, { email: resetEmail, onDone: () => setMode('login') });
    return h(LoginForm, { bossAccount: boss, onSignIn, onForgot: () => setMode('forgot'), onReinit: reinit });
  }

  window.MTALogin = Login;
})();
