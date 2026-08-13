/* Shared helpers, icons and status badge — window.MTAUI */
(function () {
  const { Badge } = window.ModtateDesignSystem_410f4d;
  const h = React.createElement;

  // ── Solid/filled icons (24-grid, currentColor fill) ──────────
  // Glyphs are filled; a few directional marks (chevron/arrow/plus/check/close)
  // stay as strokes — they read as solid lines in any filled icon set.
  const sic = (d, opts = {}) => ({ size = 18, ...rest } = {}) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', ...rest },
      (Array.isArray(d) ? d : [d]).map((dd, i) => h('path', { key: i, d: dd, fillRule: 'evenodd', clipRule: 'evenodd' })),
      ...(opts.extra || []));
  // stroke helper kept for the few line marks
  const ic = (paths) => ({ size = 18, stroke = 2, ...rest } = {}) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', ...rest },
      ...paths.map((d, i) => h('path', { key: i, d })));
  const white = (d, w) => h('path', { d, fill: 'none', stroke: '#fff', strokeWidth: w || 2, strokeLinecap: 'round', strokeLinejoin: 'round' });

  const Icons = {
    dashboard: (p) => h('svg', { width: p?.size || 18, height: p?.size || 18, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('rect', { x: 3, y: 3, width: 8, height: 8, rx: 2 }), h('rect', { x: 13, y: 3, width: 8, height: 8, rx: 2 }),
      h('rect', { x: 3, y: 13, width: 8, height: 8, rx: 2 }), h('rect', { x: 13, y: 13, width: 8, height: 8, rx: 2 })),
    building: (p) => h('svg', { width: p?.size || 18, height: p?.size || 18, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { d: 'M4 21V8.3a1 1 0 0 1 .46-.84l7-4.52a1 1 0 0 1 1.08 0l7 4.52a1 1 0 0 1 .46.84V21a1 1 0 0 1-1 1h-5v-4.5a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1V22H5a1 1 0 0 1-1-1Z' }),
      h('g', { fill: '#fff', opacity: 0.001 }), white('M9 10.5h.01M12 10.5h.01M15 10.5h.01M9 13.5h.01M12 13.5h.01M15 13.5h.01', 1.6)),
    inquiry: sic('M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-4.6 3.45A1 1 0 0 1 3 20.6V5a2 2 0 0 1 1-2Z'),
    users: (p) => h('svg', { width: p?.size || 18, height: p?.size || 18, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('circle', { cx: 9, cy: 8, r: 4 }), h('path', { d: 'M9 13c-3.9 0-7 2.2-7 5 0 .9.6 1.5 1.5 1.5h11c.9 0 1.5-.6 1.5-1.5 0-2.8-3.1-5-7-5Z' }),
      h('circle', { cx: 17.5, cy: 8.5, r: 3 }), h('path', { d: 'M17.5 13c-.6 0-1.2.1-1.7.2 1.4 1.1 2.2 2.6 2.2 4.3v.5h3.5c.8 0 1.5-.5 1.5-1.3 0-2.1-2.4-3.7-5.5-3.7Z' })),
    user: (p) => h('svg', { width: p?.size || 18, height: p?.size || 18, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('circle', { cx: 12, cy: 8, r: 4.2 }), h('path', { d: 'M12 13.5c-4.4 0-8 2.5-8 5.6 0 1 .7 1.9 1.8 1.9h12.4c1.1 0 1.8-.9 1.8-1.9 0-3.1-3.6-5.6-8-5.6Z' })),
    search: (p) => h('svg', { width: p?.size || 18, height: p?.size || 18, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M10.5 3a7.5 7.5 0 1 0 4.55 13.46l4.24 4.25a1.2 1.2 0 0 0 1.7-1.7l-4.25-4.24A7.5 7.5 0 0 0 10.5 3Zm0 2.4a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2Z' })),
    plus: ic(['M12 5v14M5 12h14']),
    chevronDown: ic(['M6 9l6 6 6-6']),
    chevronRight: ic(['M9 6l6 6-6 6']),
    chevronLeft: ic(['M15 6l-6 6 6 6']),
    arrowLeft: ic(['M19 12H5M12 19l-7-7 7-7']),
    arrowUp: ic(['M12 19V5M5 12l7-7 7 7']),
    export: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z' }), white('M8 13h8M8 17h5', 1.6)),
    filter: sic('M3.6 4h16.8a1 1 0 0 1 .77 1.64L14.5 13.4V19a1 1 0 0 1-1.45.9l-2.5-1.25A1 1 0 0 1 10 17.75V13.4L2.83 5.64A1 1 0 0 1 3.6 4Z'),
    listView: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('circle', { cx: 4, cy: 6, r: 1.6 }), h('circle', { cx: 4, cy: 12, r: 1.6 }), h('circle', { cx: 4, cy: 18, r: 1.6 }),
      h('rect', { x: 8, y: 5, width: 13, height: 2.2, rx: 1.1 }), h('rect', { x: 8, y: 10.9, width: 13, height: 2.2, rx: 1.1 }), h('rect', { x: 8, y: 16.8, width: 13, height: 2.2, rx: 1.1 })),
    gridView: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('rect', { x: 3, y: 3, width: 8, height: 8, rx: 2 }), h('rect', { x: 13, y: 3, width: 8, height: 8, rx: 2 }),
      h('rect', { x: 3, y: 13, width: 8, height: 8, rx: 2 }), h('rect', { x: 13, y: 13, width: 8, height: 8, rx: 2 })),
    mrt: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { d: 'M8 2h8a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-.3l1.6 2.4a1 1 0 0 1-1.66 1.1L13.4 20h-2.8l-1.54 3.1a1 1 0 0 1-1.66-1.1L8.3 17H8a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Zm.5 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z' }),
      h('rect', { x: 7.5, y: 5, width: 9, height: 5.5, rx: 1, fill: '#fff' })),
    close: ic(['M18 6L6 18M6 6l12 12']),
    check: ic(['M20 6L9 17l-5-5']),
    bell: sic('M12 2a6 6 0 0 0-6 6c0 3.5-1 5.5-2 6.7-.5.6-.1 1.6.7 1.6h14.6c.8 0 1.2-1 .7-1.6-1-1.2-2-3.2-2-6.7a6 6 0 0 0-6-6Zm-2.3 16a2.4 2.4 0 0 0 4.6 0H9.7Z'),
    logout: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { d: 'M4 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3h-2V4H6v16h6v-3h2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z' }),
      h('path', { d: 'M16.3 8.3a1 1 0 0 0 0 1.4L17.6 11H10a1 1 0 1 0 0 2h7.6l-1.3 1.3a1 1 0 0 0 1.4 1.4l3-3a1 1 0 0 0 0-1.4l-3-3a1 1 0 0 0-1.4 0Z' })),
    share: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('circle', { cx: 18, cy: 5, r: 3 }), h('circle', { cx: 6, cy: 12, r: 3 }), h('circle', { cx: 18, cy: 19, r: 3 }),
      h('path', { d: 'M8.6 13.5l6.8 4M15.4 6.5l-6.8 4', stroke: 'currentColor', strokeWidth: 2, fill: 'none' })),
    ruler: sic('M3.5 14.3 14.3 3.5a1.6 1.6 0 0 1 2.27 0l3.93 3.93a1.6 1.6 0 0 1 0 2.27L9.7 20.5a1.6 1.6 0 0 1-2.27 0L3.5 16.57a1.6 1.6 0 0 1 0-2.27Zm3.3.5 1.5 1.5m1.7-4.7 1.5 1.5m1.7-4.7 1.5 1.5m1.7-4.7 1.5 1.5', { extra: [h('path', { key: 'w', d: 'M6.8 14.8l1.5 1.5M8.5 11.6l1.5 1.5M10.2 8.4l1.5 1.5M11.9 5.2l1.5 1.5', stroke: '#fff', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' })] }),
    floors: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { d: 'M3 20V9.5a1 1 0 0 1 .47-.85l4.5-2.8a1 1 0 0 1 1.06 0L12 7.8V12l1.5-.9V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z' }),
      h('path', { d: 'M13 12.2 17 9.8a1 1 0 0 1 1.04 0l3 1.85a1 1 0 0 1 .46.85V20a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7.8Z', opacity: 0.55 })),
    clock: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('circle', { cx: 12, cy: 12, r: 9.5 }), white('M12 7v5l3 2.2', 1.8)),
    trend: ic(['M3 17l6-6 4 4 8-8', 'M21 7h-5M21 7v5']),
    phone: sic('M6.6 2.5c.5-.1 1 .1 1.3.6l1.9 3.3c.3.5.2 1.1-.2 1.5L8 9.4a14 14 0 0 0 6.6 6.6l1.5-1.6c.4-.4 1-.5 1.5-.2l3.3 1.9c.5.3.7.8.6 1.3l-.8 3.2c-.1.5-.6.9-1.1.9C10.3 21.4 2.6 13.7 2.4 4.4c0-.5.4-1 .9-1.1l3.3-.8Z'),
    mail: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { d: 'M2 7.3V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7.3l-9.4 6.1a1 1 0 0 1-1.2 0L2 7.3Z' }),
      h('path', { d: 'M22 5.4A2 2 0 0 0 20 4H4a2 2 0 0 0-2 1.4l10 6.5 10-6.5Z' })),
    lock: (p) => h('svg', { width: p?.size || 14, height: p?.size || 14, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { d: 'M7 9V7a5 5 0 0 1 10 0v2h.5A1.5 1.5 0 0 1 19 10.5v9A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-9A1.5 1.5 0 0 1 6.5 9H7Zm2 0h6V7a3 3 0 0 0-6 0v2Z' })),
    check2: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('circle', { cx: 12, cy: 12, r: 10 }), white('M8 12.2l2.6 2.6L16 9.4', 2.1)),
    upload: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { d: 'M11 21V8.8L7.7 12a1 1 0 0 1-1.4-1.4l5-5a1 1 0 0 1 1.4 0l5 5A1 1 0 0 1 16.3 12L13 8.8V21h-2Z' }),
      h('path', { d: 'M4 19h16v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2Z' })),
    download: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { d: 'M11 3v9.2L7.7 9a1 1 0 0 0-1.4 1.4l5 5a1 1 0 0 0 1.4 0l5-5A1 1 0 0 0 16.3 9L13 12.2V3h-2Z' }),
      h('path', { d: 'M4 19h16v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2Z' })),
    fileDoc: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'currentColor' },
      h('path', { d: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7Z' }),
      h('path', { d: 'M13 2v5a2 2 0 0 0 2 2h5', fill: 'none', stroke: '#fff', strokeWidth: 1.6, strokeLinejoin: 'round' }),
      white('M8.5 13.5h7M8.5 17h4.5', 1.6)),
    trash: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
      h('path', { d: 'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6.5 7l1 13a1.5 1.5 0 0 0 1.5 1h6a1.5 1.5 0 0 0 1.5-1l1-13M10 11.5v5.5M14 11.5v5.5' })),
    settings: (p) => h('svg', { width: p?.size || 16, height: p?.size || 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: p?.stroke || 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
      h('path', { d: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' }),
      h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z' })),
  };

  // ── Status badge mapping → DS Badge tones ─────────────────────
  const TONE = {
    prop: { listing: 'success', negotiating: 'warning', deposited: 'info', preparing: 'solid', signed: 'neutral' },
    inq: { new: 'neutral', replied: 'warning', deal: 'success', closed: 'neutral' },
    tenant: { new: 'neutral', scheduled: 'warning', replied: 'info', deal: 'success' },
    member: { active: 'success', inactive: 'neutral' },
  };
  function StatusBadge({ kind, status }) {
    const label = (window.MTA.STATUS_LABELS[kind] || {})[status] || status;
    const tone = (TONE[kind] || {})[status] || 'neutral';
    const dot = !(kind === 'member' && status === 'inactive');
    return h(Badge, { tone, dot }, label);
  }

  // role pill — monochrome neutral
  function RolePill({ role }) {
    return h(Badge, { tone: role === '老闆' ? 'solid' : 'neutral' }, role);
  }

  // small monochrome avatar
  function Avatar({ text, size = 32, dark = true, style }) {
    return h('span', {
      style: {
        width: size, height: size, borderRadius: 999, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: size * 0.4,
        background: dark ? 'var(--color-dark)' : 'var(--gray-100)',
        color: dark ? '#fff' : 'var(--gray-700)',
        fontFamily: 'var(--font-sans)', ...style,
      },
    }, text);
  }

  window.MTAUI = { Icons, StatusBadge, RolePill, Avatar, h };

  // ── global toast ─────────────────────────────────────────────
  function Toast({ toast }) {
    if (!toast) return null;
    const kind = toast.kind || 'success';
    const map = {
      success: ['var(--color-dark)', '#fff', Icons.check],
      error: ['var(--error-500)', '#fff', Icons.close],
      info: ['var(--color-dark)', '#fff', Icons.bell],
    };
    const [bg, fg, Ic] = map[kind] || map.success;
    return h('div', { key: toast.id, style: { position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 500, background: bg, color: fg, padding: '12px 20px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, boxShadow: '0 8px 28px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 9, maxWidth: '90vw', animation: 'mtaToastIn 220ms ease' } },
      h('span', { style: { display: 'flex', flexShrink: 0, width: 20, height: 20, borderRadius: 999, background: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' } }, h(Ic, { size: 13, stroke: 2.4 })),
      h('span', null, toast.msg));
  }
  window.MTAUI.Toast = Toast;

  // toast hook: returns [toast, flash(msg, kind)]
  function useToast() {
    const [toast, setToast] = React.useState(null);
    const timer = React.useRef(null);
    const flash = React.useCallback((msg, kind = 'success') => {
      setToast({ msg, kind, id: Date.now() });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), 2600);
    }, []);
    return [toast, flash];
  }
  window.MTAUI.useToast = useToast;

  // ── Corrected Select (DS visuals, <div> root) ────────────────
  // The bundled DS Select uses a <label> root; clicking an option <div>
  // bubbles to the label and re-forwards the click to the trigger button,
  // re-opening the menu. This drop-in replacement keeps identical styling
  // but uses a <div> root + outside-click close, and overrides the namespace
  // so every Select across the app closes on pick.
  function MTASelect({ label, required = false, options = [], value, defaultValue, placeholder = '請選擇', disabled = false, onChange, style = {} }) {
    const [open, setOpen] = React.useState(false);
    const [inner, setInner] = React.useState(defaultValue != null ? defaultValue : null);
    const ref = React.useRef(null);
    const current = value !== undefined ? value : inner;
    React.useEffect(() => {
      const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, []);
    const norm = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
    const selected = norm.find(o => o.value === current);
    const pick = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); setOpen(false); };
    return h('div', { ref, style: { display: 'block', position: 'relative', fontFamily: 'var(--font-sans)', ...style } },
      label && h('span', { style: { display: 'block', fontSize: 13, fontWeight: 'var(--weight-medium)', color: 'var(--gray-700)', marginBottom: 6 } }, label, required && h('span', { style: { color: 'var(--error-500)', marginLeft: 2 } }, '*')),
      h('button', { type: 'button', disabled, onClick: () => !disabled && setOpen(o => !o),
        style: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: `1px solid ${open ? 'var(--border-focus)' : 'var(--border-strong)'}`, borderRadius: 'var(--radius-md)', fontSize: 'var(--text-body)', fontFamily: 'inherit', background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)', color: selected ? 'var(--text-primary)' : 'var(--text-placeholder)', boxShadow: open ? 'var(--ring-focus)' : 'none', cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none', transition: 'border-color 120ms ease, box-shadow 120ms ease', textAlign: 'left' } },
        h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, selected ? selected.label : placeholder),
        h('span', { style: { color: 'var(--gray-500)', display: 'flex', flexShrink: 0, marginLeft: 8, transition: 'transform 120ms ease', transform: open ? 'rotate(180deg)' : 'none' } },
          h('svg', { width: 12, height: 12, viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }, h('path', { d: 'M3 4.5L6 7.5L9 4.5' })))),
      open && h('div', { style: { position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-popover)', padding: '4px 0', maxHeight: 280, overflowY: 'auto' } },
        norm.map(o => { const on = o.value === current; return h(MTASelectOption, { key: o.value, on, label: o.label, onPick: () => pick(o.value) }); })));
  }
  function MTASelectOption({ on, label, onPick }) {
    const [hover, setHover] = React.useState(false);
    return h('div', { onClick: onPick, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
      style: { margin: '2px 6px', padding: '9px 12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-body)', cursor: 'pointer', background: on ? 'var(--surface-inverse)' : (hover ? 'var(--primary-100)' : 'transparent'), color: on ? 'var(--text-on-dark)' : 'var(--gray-700)', fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-regular)' } }, label);
  }
  try { window.ModtateDesignSystem_410f4d.Select = MTASelect; } catch (e) {}
  window.MTAUI.Select = MTASelect;
})();
