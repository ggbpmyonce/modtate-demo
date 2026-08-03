/* @ds-bundle: {"format":3,"namespace":"ModtateDesignSystem_410f4d","components":[{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"Breadcrumbs","sourcePath":"components/navigation/Breadcrumbs.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/feedback/Alert.jsx":"f5073291781b","components/feedback/Badge.jsx":"ff286eb963f6","components/forms/Button.jsx":"68fa922ea7a0","components/forms/Checkbox.jsx":"87d04179bf14","components/forms/Input.jsx":"2a8373296508","components/forms/Radio.jsx":"721d03025ea8","components/forms/Select.jsx":"a61b82debd8b","components/forms/Switch.jsx":"844d83ae9965","components/layout/Card.jsx":"aacb6789c033","components/navigation/Breadcrumbs.jsx":"75166a640f95","components/navigation/Pagination.jsx":"27a3b131e450","components/navigation/Tabs.jsx":"4f4a4007a104","ui_kits/leasing/App.jsx":"df4fa9953c16","ui_kits/leasing/DashboardScreen.jsx":"96085741fe2c","ui_kits/leasing/DetailScreen.jsx":"7a3f2996ffd8","ui_kits/leasing/Header.jsx":"d4a4f0824ad3","ui_kits/leasing/ListingsScreen.jsx":"06e9e3471f9c","ui_kits/leasing/LoginScreen.jsx":"981ccfa643ca","ui_kits/leasing/data.js":"e6c49bca5e7e","ui_kits/leasing/icons.jsx":"3015713bac6e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ModtateDesignSystem_410f4d = window.ModtateDesignSystem_410f4d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/feedback/Alert.jsx
try { (() => {
const KINDS = {
  neutral: {
    bg: 'var(--primary-100)',
    fg: 'var(--text-primary)',
    border: 'var(--primary-200)'
  },
  error: {
    bg: 'var(--error-100)',
    fg: 'var(--error-700)',
    border: 'var(--error-200)'
  },
  success: {
    bg: 'var(--success-100)',
    fg: 'var(--success-700)',
    border: 'var(--success-200)'
  },
  warning: {
    bg: 'var(--warning-100)',
    fg: 'var(--warning-700)',
    border: 'var(--warning-200)'
  },
  info: {
    bg: 'var(--info-100)',
    fg: 'var(--info-700)',
    border: 'var(--info-100)'
  }
};

/**
 * Modtate Alert — inline status banner, optionally dismissible.
 * `kind`: neutral | error | success | warning | info.
 */
function Alert({
  kind = 'neutral',
  dismissible = false,
  onClose,
  children,
  style = {}
}) {
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  const k = KINDS[kind] || KINDS.neutral;
  const close = () => {
    setOpen(false);
    onClose && onClose();
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '11px 16px',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      background: k.bg,
      color: k.fg,
      border: `1px solid ${k.border}`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", null, children), dismissible && /*#__PURE__*/React.createElement("button", {
    onClick: close,
    "aria-label": "Dismiss",
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'currentColor',
      display: 'flex',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 13 13",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l11 11M12 1L1 12"
  }))));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: 'var(--primary-100)',
    fg: 'var(--text-primary)'
  },
  solid: {
    bg: 'var(--gray-600)',
    fg: '#fff'
  },
  success: {
    bg: 'var(--success-100)',
    fg: 'var(--success-700)'
  },
  error: {
    bg: 'var(--error-100)',
    fg: 'var(--error-700)'
  },
  info: {
    bg: 'var(--info-100)',
    fg: 'var(--info-700)'
  },
  warning: {
    bg: 'var(--warning-100)',
    fg: 'var(--warning-700)'
  }
};

/**
 * Modtate Badge — small pill for status / counts / tags.
 * `tone`: neutral | solid | success | error | info | warning.
 */
function Badge({
  tone = 'neutral',
  dot = false,
  children,
  style = {}
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-caption)',
      fontWeight: 'var(--weight-semibold)',
      lineHeight: 1.4,
      padding: '4px 12px',
      borderRadius: 'var(--radius-pill)',
      background: t.bg,
      color: t.fg,
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Modtate Button — pill-shaped, black-primary action control.
 * Variants: primary (filled black), outline, text (no chrome), icon (square pill).
 * Sizes: sm / md / lg. Pass `iconLeft` / `iconRight` for icon+text.
 */
function Button({
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  iconOnly = false,
  disabled = false,
  type = 'button',
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padY: 7,
      padX: 16,
      font: 14,
      icon: 36
    },
    md: {
      padY: 10,
      padX: 22,
      font: 14,
      icon: 40
    },
    lg: {
      padY: 13,
      padX: 28,
      font: 16,
      icon: 48
    }
  };
  const s = sizes[size] || sizes.md;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--gap-inline)',
    fontFamily: 'var(--font-sans)',
    fontSize: s.font,
    fontWeight: 'var(--weight-semibold)',
    lineHeight: 1,
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
    userSelect: 'none'
  };
  const hot = hover && !disabled;
  const variants = {
    primary: {
      background: disabled ? 'var(--action-disabled)' : hot ? 'var(--action-hover)' : 'var(--action-default)',
      color: disabled ? 'var(--text-disabled)' : 'var(--action-on)'
    },
    outline: {
      background: disabled ? 'var(--surface-card)' : hot ? 'var(--primary-100)' : 'var(--surface-card)',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
      borderColor: disabled ? 'var(--border-default)' : 'var(--text-primary)'
    },
    text: {
      background: hot ? 'var(--primary-100)' : 'transparent',
      color: disabled ? 'var(--gray-300)' : 'var(--text-primary)'
    }
  };
  const sizing = iconOnly ? {
    width: s.icon,
    height: s.icon,
    padding: 0
  } : {
    padding: `${s.padY}px ${s.padX}px`
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: {
      ...base,
      ...(variants[variant] || variants.primary),
      ...sizing,
      transform: active && !disabled ? 'scale(0.97)' : 'none',
      ...style
    },
    "data-variant": variant,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false)
  }, rest), iconLeft, !iconOnly && children, iconOnly && children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * Modtate Checkbox — 4px-radius box that fills black when checked.
 * Controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).
 */
function Checkbox({
  checked,
  defaultChecked = false,
  disabled = false,
  label,
  onChange,
  style = {}
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInner(!on);
    onChange && onChange(!on);
  };
  const box = {
    width: 18,
    height: 18,
    borderRadius: 'var(--radius-xs)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 120ms ease, border-color 120ms ease',
    border: on ? 'none' : '1.5px solid var(--border-strong)',
    background: disabled ? 'var(--gray-200)' : on ? 'var(--action-default)' : 'transparent'
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: toggle,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-sans)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: box
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "9",
    viewBox: "0 0 11 9",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 4.5L4 7.5L10 1",
    stroke: disabled ? 'var(--gray-400)' : '#fff',
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: disabled ? 'var(--text-disabled)' : 'var(--text-secondary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Modtate Input — labelled text field with optional search icon and validation.
 * 8px radius, black focus ring. Pass `error` (string) to show the error state.
 */
function Input({
  label,
  required = false,
  icon = null,
  error = null,
  disabled = false,
  value,
  defaultValue,
  placeholder = '',
  type = 'text',
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const borderColor = error ? 'var(--error-500)' : focus ? 'var(--border-focus)' : 'var(--border-strong)';
  const ring = error ? 'var(--ring-error)' : focus ? 'var(--ring-focus)' : 'none';
  const field = {
    width: '100%',
    padding: icon ? '10px 12px 10px 32px' : '10px 12px',
    border: `1px solid ${borderColor}`,
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-body)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
    boxShadow: ring,
    outline: 'none',
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
    boxSizing: 'border-box'
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      fontWeight: 'var(--weight-medium)',
      color: 'var(--gray-700)',
      marginBottom: 6
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--error-500)',
      marginLeft: 2
    }
  }, "*")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      color: focus ? 'var(--text-primary)' : 'var(--text-placeholder)',
      pointerEvents: 'none'
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    disabled: disabled,
    style: field,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest))), error && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--text-caption)',
      color: 'var(--error-500)',
      marginTop: 4
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
/**
 * Modtate Radio — single-choice control; selected shows a thick black ring.
 * Use the RadioGroup helper for a managed set, or render Radio standalone.
 */
function Radio({
  checked = false,
  disabled = false,
  label,
  onChange,
  value,
  style = {}
}) {
  const dot = {
    width: 18,
    height: 18,
    borderRadius: 'var(--radius-pill)',
    flexShrink: 0,
    background: '#fff',
    boxSizing: 'border-box',
    border: checked ? `5px solid ${disabled ? 'var(--gray-200)' : 'var(--action-default)'}` : '1.5px solid var(--border-strong)',
    transition: 'border 120ms ease'
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: () => !disabled && onChange && onChange(value),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-sans)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: dot
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: disabled ? 'var(--text-disabled)' : 'var(--text-secondary)'
    }
  }, label));
}

/**
 * Managed group of radios. `options` are strings or {value,label}.
 */
function RadioGroup({
  options = [],
  value,
  defaultValue,
  onChange,
  name,
  direction = 'column',
  gap = 14,
  style = {}
}) {
  const [inner, setInner] = React.useState(defaultValue ?? null);
  const current = value !== undefined ? value : inner;
  const norm = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  const pick = v => {
    if (value === undefined) setInner(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap,
      ...style
    }
  }, norm.map(o => /*#__PURE__*/React.createElement(Radio, {
    key: o.value,
    value: o.value,
    label: o.label,
    checked: o.value === current,
    disabled: o.disabled,
    onChange: pick
  })));
}
Object.assign(__ds_scope, { Radio, RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const Chevron = ({
  open
}) => /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 12 12",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.6",
  style: {
    transition: 'transform 120ms ease',
    transform: open ? 'rotate(180deg)' : 'none'
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 4.5L6 7.5L9 4.5"
}));

/**
 * Modtate Select — labelled dropdown with a popover list of options.
 * Controlled via `value` + `onChange(value)`, or uncontrolled with `defaultValue`.
 */
function Select({
  label,
  required = false,
  options = [],
  value,
  defaultValue,
  placeholder = 'Select',
  disabled = false,
  onChange,
  style = {}
}) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue ?? null);
  const ref = React.useRef(null);
  const current = value !== undefined ? value : inner;
  React.useEffect(() => {
    const onDoc = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const norm = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  const selected = norm.find(o => o.value === current);
  const pick = v => {
    if (value === undefined) setInner(v);
    onChange && onChange(v);
    setOpen(false);
  };
  return /*#__PURE__*/React.createElement("label", {
    ref: ref,
    style: {
      display: 'block',
      position: 'relative',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      fontWeight: 'var(--weight-medium)',
      color: 'var(--gray-700)',
      marginBottom: 6
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--error-500)',
      marginLeft: 2
    }
  }, "*")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: () => !disabled && setOpen(o => !o),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 12px',
      border: `1px solid ${open ? 'var(--border-focus)' : 'var(--border-strong)'}`,
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--text-body)',
      fontFamily: 'inherit',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      color: selected ? 'var(--text-primary)' : 'var(--text-placeholder)',
      boxShadow: open ? 'var(--ring-focus)' : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      transition: 'border-color 120ms ease, box-shadow 120ms ease'
    }
  }, selected ? selected.label : placeholder, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gray-500)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Chevron, {
    open: open
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      right: 0,
      zIndex: 20,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-popover)',
      padding: '4px 0'
    }
  }, norm.map(o => {
    const on = o.value === current;
    return /*#__PURE__*/React.createElement("div", {
      key: o.value,
      onClick: () => pick(o.value),
      style: {
        margin: '2px 6px',
        padding: '9px 12px',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-body)',
        cursor: 'pointer',
        background: on ? 'var(--surface-inverse)' : 'transparent',
        color: on ? 'var(--text-on-dark)' : 'var(--gray-700)',
        fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-regular)'
      }
    }, o.label);
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * Modtate Switch (Toggle) — pill track; fills black when on.
 */
function Switch({
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  style = {}
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInner(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    onClick: toggle,
    style: {
      width: 38,
      height: 22,
      borderRadius: 'var(--radius-pill)',
      display: 'inline-flex',
      alignItems: 'center',
      padding: 2,
      cursor: disabled ? 'not-allowed' : 'pointer',
      justifyContent: on ? 'flex-end' : 'flex-start',
      background: disabled ? '#EFEFEF' : on ? 'var(--action-default)' : 'var(--gray-200)',
      transition: 'background 140ms ease',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 'var(--radius-pill)',
      background: disabled ? 'var(--gray-300)' : '#fff',
      boxShadow: '0 1px 2px rgba(16,24,40,0.2)'
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Modtate Card — white surface, 16px radius, resting card shadow.
 * `padding` overrides the default interior padding; `interactive` adds hover lift.
 */
function Card({
  padding,
  interactive = false,
  children,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: interactive && hover ? 'var(--shadow-popover)' : 'var(--shadow-card)',
      padding: padding != null ? padding : 'var(--pad-card)',
      transition: 'box-shadow 140ms ease, transform 140ms ease',
      transform: interactive && hover ? 'translateY(-2px)' : 'none',
      cursor: interactive ? 'pointer' : 'default',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumbs.jsx
try { (() => {
/**
 * Modtate Breadcrumbs — path trail; last item is the current (bold black) page.
 * `items`: strings or {label,href}.
 */
function Breadcrumbs({
  items = [],
  onNavigate,
  style = {}
}) {
  const norm = items.map(it => typeof it === 'string' ? {
    label: it
  } : it);
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Breadcrumb",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      ...style
    }
  }, norm.map((it, i) => {
    const last = i === norm.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      onClick: () => !last && onNavigate && onNavigate(it, i),
      style: {
        color: last ? 'var(--text-primary)' : 'var(--text-tertiary)',
        fontWeight: last ? 'var(--weight-semibold)' : 'var(--weight-regular)',
        cursor: last ? 'default' : 'pointer'
      }
    }, it.label), !last && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--gray-300)'
      }
    }, "\u203A"));
  }));
}
Object.assign(__ds_scope, { Breadcrumbs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumbs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pagination.jsx
try { (() => {
/**
 * Modtate Pagination — numbered pager with prev/next; active page fills black.
 * Renders up to `siblings` neighbours around the current page with ellipses.
 */
function Pagination({
  total = 1,
  page,
  defaultPage = 1,
  siblings = 1,
  onChange,
  style = {}
}) {
  const [inner, setInner] = React.useState(defaultPage);
  const current = page !== undefined ? page : inner;
  const go = p => {
    if (p < 1 || p > total) return;
    if (page === undefined) setInner(p);
    onChange && onChange(p);
  };
  const range = (a, b) => Array.from({
    length: b - a + 1
  }, (_, i) => a + i);
  let pages = [];
  if (total <= 6 + siblings * 2) {
    pages = range(1, total);
  } else {
    const left = Math.max(current - siblings, 1);
    const right = Math.min(current + siblings, total);
    pages = [1];
    if (left > 2) pages.push('…');
    pages.push(...range(Math.max(left, 2), Math.min(right, total - 1)));
    if (right < total - 1) pages.push('…');
    pages.push(total);
  }
  const cell = (extra = {}) => ({
    minWidth: 30,
    height: 30,
    padding: '0 6px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    cursor: 'pointer',
    border: '1px solid var(--border-default)',
    background: 'var(--surface-card)',
    color: 'var(--text-secondary)',
    ...extra
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      alignItems: 'center',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => go(current - 1),
    style: cell(current === 1 ? {
      opacity: 0.4,
      cursor: 'not-allowed'
    } : {})
  }, "\u2039"), pages.map((p, i) => p === '…' ? /*#__PURE__*/React.createElement("span", {
    key: `e${i}`,
    style: {
      padding: '0 4px',
      color: 'var(--text-placeholder)',
      fontSize: 13
    }
  }, "\u2026") : /*#__PURE__*/React.createElement("span", {
    key: p,
    onClick: () => go(p),
    style: cell(p === current ? {
      background: 'var(--action-default)',
      color: '#fff',
      border: 'none',
      fontWeight: 700
    } : {})
  }, p)), /*#__PURE__*/React.createElement("span", {
    onClick: () => go(current + 1),
    style: cell(current === total ? {
      opacity: 0.4,
      cursor: 'not-allowed'
    } : {})
  }, "\u203A"));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/**
 * Modtate Tabs — underline tab bar. Active tab has a 2px black underline.
 * `items`: strings or {value,label,count,disabled}.
 */
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  style = {}
}) {
  const norm = items.map(t => typeof t === 'string' ? {
    value: t,
    label: t
  } : t);
  const [inner, setInner] = React.useState(defaultValue ?? (norm[0] && norm[0].value));
  const current = value !== undefined ? value : inner;
  const pick = (v, disabled) => {
    if (disabled) return;
    if (value === undefined) setInner(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 28,
      borderBottom: '1px solid var(--border-default)',
      ...style
    }
  }, norm.map(t => {
    const on = t.value === current;
    const color = t.disabled ? 'var(--gray-300)' : on ? 'var(--text-primary)' : 'var(--text-secondary)';
    return /*#__PURE__*/React.createElement("div", {
      key: t.value,
      role: "tab",
      "aria-selected": on,
      onClick: () => pick(t.value, t.disabled),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        paddingBottom: 8,
        marginBottom: -1,
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        color,
        fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        borderBottom: `2px solid ${on ? 'var(--action-default)' : 'transparent'}`,
        cursor: t.disabled ? 'not-allowed' : 'pointer'
      }
    }, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        padding: '1px 6px',
        borderRadius: 'var(--radius-pill)',
        background: on ? 'var(--action-default)' : 'var(--gray-400)',
        color: '#fff'
      }
    }, t.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/leasing/App.jsx
try { (() => {
// App orchestrator — wires the leasing screens together. Exports window.App.
function App() {
  const [authed, setAuthed] = React.useState(false);
  const [route, setRoute] = React.useState('browse'); // browse | dashboard | saved
  const [detail, setDetail] = React.useState(null);
  if (!authed) return /*#__PURE__*/React.createElement(LoginScreen, {
    onSignIn: () => setAuthed(true)
  });
  const openDetail = item => {
    setDetail(item);
    window.scrollTo(0, 0);
  };
  const nav = key => {
    setDetail(null);
    setRoute(key);
    window.scrollTo(0, 0);
  };
  let body;
  if (detail) body = /*#__PURE__*/React.createElement(DetailScreen, {
    item: detail,
    onBack: () => setDetail(null)
  });else if (route === 'dashboard') body = /*#__PURE__*/React.createElement(DashboardScreen, {
    onOpen: openDetail
  });else if (route === 'saved') body = /*#__PURE__*/React.createElement(ListingsScreen, {
    onOpen: openDetail
  });else body = /*#__PURE__*/React.createElement(ListingsScreen, {
    onOpen: openDetail
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    onNav: nav,
    active: detail ? '' : route,
    onSignOut: () => {
      setAuthed(false);
      setRoute('browse');
      setDetail(null);
    }
  }), body);
}
window.App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/leasing/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/leasing/DashboardScreen.jsx
try { (() => {
// "My Assets" dashboard — sidebar + data table. Exports window.DashboardScreen.
function DashboardScreen({
  onOpen
}) {
  const {
    Tabs,
    Checkbox,
    Badge,
    Button,
    Pagination,
    Card
  } = window.ModtateDesignSystem_410f4d;
  const [tab, setTab] = React.useState('active');
  const data = window.LEASING_DATA.listings;
  const side = [{
    key: 'assets',
    label: 'My Assets',
    icon: Icons.Grid,
    on: true
  }, {
    key: 'history',
    label: 'History',
    icon: Icons.Clock
  }, {
    key: 'wallet',
    label: 'My Wallet',
    icon: Icons.Wallet
  }, {
    key: 'account',
    label: 'Account',
    icon: Icons.User
  }];
  const statusTone = s => s === 'Open' ? 'success' : s === 'Upcoming' ? 'warning' : 'neutral';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '32px 28px 64px',
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      gap: 32,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, side.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.key,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      borderRadius: 'var(--radius-md)',
      fontSize: 14,
      cursor: 'pointer',
      background: s.on ? 'var(--color-dark)' : 'transparent',
      color: s.on ? '#fff' : 'var(--text-secondary)',
      fontWeight: s.on ? 600 : 500
    }
  }, /*#__PURE__*/React.createElement(s.icon, {
    size: 16
  }), s.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: '16px',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-tertiary)'
    }
  }, "Wallet balance"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      marginTop: 4
    }
  }, "NT$48,200"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    style: {
      width: '100%',
      marginTop: 12
    }
  }, "Top up"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.5px',
      margin: '0 0 20px'
    }
  }, "My Assets"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      value: 'active',
      label: 'Active',
      count: 4
    }, {
      value: 'pending',
      label: 'Pending',
      count: 2
    }, {
      value: 'closed',
      label: 'Closed'
    }],
    value: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'left',
      padding: '12px 16px',
      width: 40
    }
  }, /*#__PURE__*/React.createElement(Checkbox, null)), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Listing"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "District"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Rent / \u576A"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 90
    }
  }))), /*#__PURE__*/React.createElement("tbody", null, data.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    style: {
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Checkbox, null)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-placeholder)',
      fontFamily: 'var(--font-mono)'
    }
  }, r.id, " \xB7 ", r.floor)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--text-secondary)'
    }
  }, r.district), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: statusTone(r.status),
    dot: r.status !== 'Ended'
  }, r.status)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 600
    }
  }, "NT$", r.pricePing.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "text",
    size: "sm",
    onClick: () => onOpen(r)
  }, "View"))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Pagination, {
    total: 4,
    defaultPage: 1
  }))));
}
const th = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.3px'
};
const td = {
  padding: '14px 16px',
  verticalAlign: 'middle'
};
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/leasing/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/leasing/DetailScreen.jsx
try { (() => {
// Listing detail screen. Exports window.DetailScreen.
function DetailScreen({
  item,
  onBack
}) {
  const {
    Breadcrumbs,
    Badge,
    Button,
    Input,
    Alert,
    Card
  } = window.ModtateDesignSystem_410f4d;
  const [sent, setSent] = React.useState(false);
  const specs = [{
    icon: Icons.Floor,
    label: 'Floor',
    value: item.floor
  }, {
    icon: Icons.Area,
    label: 'Area',
    value: `${item.area} 坪`
  }, {
    icon: Icons.Pin,
    label: 'District',
    value: item.district
  }, {
    icon: Icons.Clock,
    label: 'Available',
    value: item.status === 'Upcoming' ? 'Q3 2026' : 'Now'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      padding: '24px 28px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Breadcrumbs, {
    items: ['Listings', item.district, item.name],
    onNavigate: (it, i) => {
      if (i < 2) onBack();
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-2xl)',
      overflow: 'hidden',
      aspectRatio: '21/9',
      background: 'var(--surface-sunken)',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: item.img,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: item.status === 'Open' ? 'success' : item.status === 'Upcoming' ? 'warning' : 'neutral',
    dot: true
  }, item.status))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 360px',
      gap: 36,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: '-0.5px',
      margin: 0
    }
  }, item.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-placeholder)',
      fontFamily: 'var(--font-mono)'
    }
  }, item.id)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: 'var(--text-tertiary)',
      marginTop: 6
    }
  }, item.nameZh), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 12,
      margin: '28px 0'
    }
  }, specs.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      padding: '16px 18px'
    }
  }, /*#__PURE__*/React.createElement(s.icon, {
    size: 18,
    color: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-tertiary)',
      marginTop: 10
    }
  }, s.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      marginTop: 2
    }
  }, s.value)))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      margin: '0 0 10px'
    }
  }, "About this space"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, item.desc), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      margin: '28px 0 12px'
    }
  }, "Amenities"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, [...item.tags, '24h access', 'High-speed fibre', 'On-site management', 'Bike storage'].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(Icons.Check, {
    size: 16,
    color: "var(--success-700)"
  }), t)))), /*#__PURE__*/React.createElement(Card, {
    style: {
      position: 'sticky',
      top: 84
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28,
      fontWeight: 700
    }
  }, "NT$", item.pricePing.toLocaleString()), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-tertiary)'
    }
  }, "/ \u576A / \u6708")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-tertiary)',
      marginTop: 4
    }
  }, "\u2248 NT$", (item.pricePing * item.area).toLocaleString(), " / month total"), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    kind: "success"
  }, "Enquiry sent \u2014 our agent will reply within 1 business day.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Your name",
    required: true,
    placeholder: "Enter name"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    required: true,
    placeholder: "you@company.com"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    style: {
      width: '100%'
    },
    onClick: () => setSent(true)
  }, "Enquire now"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    style: {
      width: '100%'
    },
    onClick: onBack
  }, "Back to listings")))));
}
window.DetailScreen = DetailScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/leasing/DetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/leasing/Header.jsx
try { (() => {
// Top app bar for the leasing kit. Exports window.Header.
function Header({
  onNav,
  active,
  onSignOut
}) {
  const {
    Input,
    Badge
  } = window.ModtateDesignSystem_410f4d;
  const [menu, setMenu] = React.useState(false);
  const nav = [{
    key: 'browse',
    label: 'Browse',
    icon: Icons.Building
  }, {
    key: 'saved',
    label: 'Saved',
    icon: Icons.Heart
  }, {
    key: 'dashboard',
    label: 'My Assets',
    icon: Icons.Grid
  }];
  const menuItems = ['My Assets', 'History', 'My Wallet', 'Account'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28,
      padding: '0 28px',
      height: 64,
      background: '#fff',
      borderBottom: '1px solid var(--border-default)',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      cursor: 'pointer'
    },
    onClick: () => onNav('browse')
  }, /*#__PURE__*/React.createElement(Wordmark, null)), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, nav.map(n => {
    const on = active === n.key;
    return /*#__PURE__*/React.createElement("button", {
      key: n.key,
      onClick: () => onNav(n.key),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 14px',
        border: 'none',
        borderRadius: 'var(--radius-pill)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: on ? 600 : 500,
        background: on ? 'var(--primary-100)' : 'transparent',
        color: on ? 'var(--text-primary)' : 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement(n.icon, {
      size: 16
    }), n.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(Input, {
    icon: /*#__PURE__*/React.createElement(Icons.Search, {
      size: 14
    }),
    placeholder: "Search by district, building, ID\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      position: 'relative',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-secondary)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icons.Bell, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--error-500)',
      border: '1.5px solid #fff'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMenu(m => !m),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'var(--color-dark)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 700
    }
  }, "LW"), /*#__PURE__*/React.createElement(Icons.ChevDown, {
    size: 14,
    color: "var(--gray-500)"
  })), menu && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 10px)',
      right: 0,
      width: 200,
      background: '#fff',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-popover)',
      padding: 6,
      zIndex: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px 10px',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, "Lena Wu \u5433"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-tertiary)'
    }
  }, "lena@cycatena.com")), menuItems.map(m => /*#__PURE__*/React.createElement("div", {
    key: m,
    onClick: () => {
      setMenu(false);
      if (m === 'My Assets') onNav('dashboard');
    },
    style: {
      padding: '9px 12px',
      borderRadius: 'var(--radius-md)',
      fontSize: 14,
      color: 'var(--text-secondary)',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, m)), /*#__PURE__*/React.createElement("div", {
    onClick: onSignOut,
    style: {
      padding: '9px 12px',
      borderRadius: 'var(--radius-md)',
      fontSize: 14,
      color: 'var(--text-primary)',
      cursor: 'pointer',
      background: 'var(--primary-100)',
      marginTop: 4,
      fontWeight: 600
    }
  }, "Sign Out")))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/leasing/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/leasing/ListingsScreen.jsx
try { (() => {
// Browse / listings screen. Exports window.ListingsScreen.
function StatusLabel({
  status
}) {
  const map = {
    Open: {
      bg: 'var(--color-dark)',
      fg: '#fff'
    },
    Upcoming: {
      bg: '#fff',
      fg: 'var(--color-dark)'
    },
    Ended: {
      bg: 'var(--gray-200)',
      fg: 'var(--gray-500)'
    }
  };
  const s = map[status] || map.Open;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12,
      padding: '5px 14px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 12,
      fontWeight: 600,
      background: s.bg,
      color: s.fg,
      boxShadow: '0 1px 4px rgba(16,24,40,0.12)'
    }
  }, status);
}
function ListingCard({
  item,
  onOpen
}) {
  const {
    Card,
    Badge
  } = window.ModtateDesignSystem_410f4d;
  return /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    interactive: true,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(item)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16/10',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: item.img,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement(StatusLabel, {
    status: item.status
  }), /*#__PURE__*/React.createElement("button", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 34,
      height: 34,
      borderRadius: '50%',
      border: 'none',
      background: 'rgba(255,255,255,0.92)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--gray-600)'
    }
  }, /*#__PURE__*/React.createElement(Icons.Heart, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, item.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-placeholder)',
      fontFamily: 'var(--font-mono)',
      whiteSpace: 'nowrap'
    }
  }, item.id)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--text-tertiary)',
      fontSize: 13,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(Icons.Pin, {
    size: 14
  }), item.district, " \xB7 ", item.floor, " \xB7 ", item.area, " \u576A"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginTop: 14
    }
  }, item.tags.slice(0, 3).map(t => /*#__PURE__*/React.createElement(Badge, {
    key: t,
    tone: "neutral"
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 14,
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'baseline',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 700
    }
  }, "NT$", item.pricePing.toLocaleString()), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-tertiary)'
    }
  }, "/ \u576A / \u6708")))));
}
function ListingsScreen({
  onOpen
}) {
  const {
    Tabs,
    Select,
    Pagination,
    Badge
  } = window.ModtateDesignSystem_410f4d;
  const all = window.LEASING_DATA.listings;
  const [tab, setTab] = React.useState('all');
  const [district, setDistrict] = React.useState('All');
  const filtered = all.filter(l => {
    const byTab = tab === 'all' ? true : l.status.toLowerCase() === tab;
    const byDist = district === 'All' ? true : l.district === district;
    return byTab && byDist;
  });
  const counts = {
    all: all.length,
    open: all.filter(l => l.status === 'Open').length,
    upcoming: all.filter(l => l.status === 'Upcoming').length
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '32px 28px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: '-0.5px',
      margin: 0
    }
  }, "Office space in Taipei"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--text-tertiary)',
      margin: '8px 0 0'
    }
  }, filtered.length, " verified listings \xB7 updated hourly")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 200
    }
  }, /*#__PURE__*/React.createElement(Select, {
    options: window.LEASING_DATA.districts,
    value: district,
    onChange: setDistrict,
    placeholder: "District"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '20px 0 28px'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      value: 'all',
      label: 'All',
      count: counts.all
    }, {
      value: 'open',
      label: 'Open',
      count: counts.open
    }, {
      value: 'upcoming',
      label: 'Upcoming',
      count: counts.upcoming
    }, {
      value: 'ended',
      label: 'Ended'
    }],
    value: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 22
    }
  }, filtered.map(l => /*#__PURE__*/React.createElement(ListingCard, {
    key: l.id,
    item: l,
    onOpen: onOpen
  }))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '64px 0',
      textAlign: 'center',
      color: 'var(--text-tertiary)'
    }
  }, "No listings match these filters."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(Pagination, {
    total: 6,
    defaultPage: 1
  })));
}
window.ListingsScreen = ListingsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/leasing/ListingsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/leasing/LoginScreen.jsx
try { (() => {
// Login / auth screen. Exports window.LoginScreen.
function LoginScreen({
  onSignIn
}) {
  const {
    Input,
    Button,
    Checkbox
  } = window.ModtateDesignSystem_410f4d;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-dark)',
      color: '#fff',
      padding: '56px 56px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    color: "#fff",
    size: 22
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 700,
      letterSpacing: '-1px',
      lineHeight: 1.25
    }
  }, "Premium office space,", /*#__PURE__*/React.createElement("br", null), "leased on your terms."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: 'var(--gray-400)',
      marginTop: 18,
      maxWidth: 380,
      lineHeight: 1.6
    }
  }, "Browse, compare and secure verified commercial floors across Taipei \u2014 all in one platform.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--gray-500)'
    }
  }, "\u5546\u8FA6\u79DF\u8CC3\u5E73\u53F0 \xB7 CyCatena"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -120,
      bottom: -120,
      width: 380,
      height: 380,
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.08)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -60,
      bottom: -60,
      width: 240,
      height: 240,
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.08)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.5px',
      margin: 0
    }
  }, "Sign in"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--text-tertiary)',
      margin: '8px 0 28px'
    }
  }, "Welcome back. Enter your details."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    required: true,
    defaultValue: "lena@cycatena.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    required: true,
    type: "password",
    defaultValue: "password"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Remember me",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-primary)',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Forgot?")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    style: {
      width: '100%'
    },
    onClick: onSignIn
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    style: {
      width: '100%'
    },
    onClick: onSignIn
  }, "Continue with SSO")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-tertiary)',
      marginTop: 24,
      textAlign: 'center'
    }
  }, "No account? ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-primary)',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Request access")))));
}
window.LoginScreen = LoginScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/leasing/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/leasing/data.js
try { (() => {
// Mock data for the Modtate leasing UI kit. Sets window.LEASING_DATA.
window.LEASING_DATA = {
  districts: ['All', 'Xinyi 信義', 'Da’an 大安', 'Zhongshan 中山', 'Neihu 內湖', 'Nangang 南港'],
  listings: [{
    id: 'A-2048',
    name: 'Xinyi Trade Tower',
    nameZh: '信義貿易大樓',
    district: 'Xinyi 信義',
    floor: '14F',
    area: 268,
    pricePing: 4200,
    status: 'Open',
    tags: ['Furnished', 'Corner unit', 'MRT 3min'],
    img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80',
    desc: 'Grade-A office floor with panoramic city views toward Taipei 101. Raised flooring, full HVAC, and 24-hour building access.'
  }, {
    id: 'A-1990',
    name: 'Da’an Garden Offices',
    nameZh: '大安花園商辦',
    district: 'Da’an 大安',
    floor: '7F',
    area: 142,
    pricePing: 3650,
    status: 'Open',
    tags: ['Pet friendly', 'Balcony'],
    img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80',
    desc: 'Boutique low-rise with abundant natural light and a private roof terrace. Ideal for studios and design teams.'
  }, {
    id: 'A-2210',
    name: 'Nangang Software Park C',
    nameZh: '南港軟體園區 C 棟',
    district: 'Nangang 南港',
    floor: '11F',
    area: 520,
    pricePing: 2980,
    status: 'Upcoming',
    tags: ['Whole floor', 'Data-ready'],
    img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80',
    desc: 'Large contiguous floorplate engineered for tech tenants — redundant power, fibre risers, and dedicated server room.'
  }, {
    id: 'A-1742',
    name: 'Zhongshan Riverside',
    nameZh: '中山河岸大廈',
    district: 'Zhongshan 中山',
    floor: '9F',
    area: 96,
    pricePing: 3100,
    status: 'Open',
    tags: ['Furnished', 'River view'],
    img: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=900&q=80',
    desc: 'Compact serviced suite overlooking the Keelung River. Move-in ready with meeting room and pantry.'
  }, {
    id: 'A-1588',
    name: 'Neihu Tech Hub',
    nameZh: '內湖科技中心',
    district: 'Neihu 內湖',
    floor: '5F',
    area: 310,
    pricePing: 2750,
    status: 'Ended',
    tags: ['Parking ×6'],
    img: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=900&q=80',
    desc: 'Established business park unit with generous parking allocation and loading access.'
  }, {
    id: 'A-2301',
    name: 'Xinyi Sky Loft',
    nameZh: '信義天際 Loft',
    district: 'Xinyi 信義',
    floor: '22F',
    area: 188,
    pricePing: 4850,
    status: 'Upcoming',
    tags: ['Penthouse', 'Furnished', 'Terrace'],
    img: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=900&q=80',
    desc: 'Double-height loft on the 22nd floor with wraparound terrace and skyline frontage.'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/leasing/data.js", error: String((e && e.message) || e) }); }

// ui_kits/leasing/icons.jsx
try { (() => {
// Shared wordmark + line icons for the leasing kit. Exports to window.
// Icons follow the system style: 1.5px stroke, round caps, 24px grid.
const mkIcon = (paths, vb = '0 0 24 24') => ({
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.5,
  style = {}
}) => React.createElement('svg', {
  width: size,
  height: size,
  viewBox: vb,
  fill: 'none',
  stroke: color,
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  style
}, ...paths.map((d, i) => typeof d === 'string' ? React.createElement('path', {
  d,
  key: i
}) : React.createElement(d.t, {
  ...d.p,
  key: i
})));
const Icons = {
  Search: mkIcon([{
    t: 'circle',
    p: {
      cx: 11,
      cy: 11,
      r: 7
    }
  }, 'M21 21l-4-4']),
  Building: mkIcon(['M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16', 'M15 21V9h4a1 1 0 011 1v11', 'M2 21h20', 'M7 8h2M7 12h2M7 16h2']),
  Pin: mkIcon(['M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z', {
    t: 'circle',
    p: {
      cx: 12,
      cy: 10,
      r: 2.5
    }
  }]),
  Heart: mkIcon(['M12 20s-7-4.6-7-9.5A4.5 4.5 0 0112 6a4.5 4.5 0 017 4.5C19 15.4 12 20 12 20z']),
  Wallet: mkIcon([{
    t: 'rect',
    p: {
      x: 3,
      y: 5,
      width: 18,
      height: 14,
      rx: 2
    }
  }, 'M3 9h18', {
    t: 'circle',
    p: {
      cx: 16.5,
      cy: 14,
      r: 1
    }
  }]),
  Clock: mkIcon([{
    t: 'circle',
    p: {
      cx: 12,
      cy: 12,
      r: 9
    }
  }, 'M12 7v5l3 2']),
  Grid: mkIcon([{
    t: 'rect',
    p: {
      x: 3,
      y: 3,
      width: 7,
      height: 7,
      rx: 1
    }
  }, {
    t: 'rect',
    p: {
      x: 14,
      y: 3,
      width: 7,
      height: 7,
      rx: 1
    }
  }, {
    t: 'rect',
    p: {
      x: 3,
      y: 14,
      width: 7,
      height: 7,
      rx: 1
    }
  }, {
    t: 'rect',
    p: {
      x: 14,
      y: 14,
      width: 7,
      height: 7,
      rx: 1
    }
  }]),
  User: mkIcon([{
    t: 'circle',
    p: {
      cx: 12,
      cy: 8,
      r: 3.5
    }
  }, 'M5 20c0-3.3 3-5.5 7-5.5s7 2.2 7 5.5']),
  Chevron: mkIcon(['M9 6l6 6-6 6']),
  ChevDown: mkIcon(['M6 9l6 6 6-6']),
  Bell: mkIcon(['M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8', 'M13.5 21a2 2 0 01-3 0']),
  Area: mkIcon(['M3 8V3h5', 'M21 8V3h-5', 'M3 16v5h5', 'M21 16v5h-5']),
  Check: mkIcon(['M5 13l4 4L19 7']),
  Floor: mkIcon([{
    t: 'rect',
    p: {
      x: 4,
      y: 3,
      width: 16,
      height: 18,
      rx: 1
    }
  }, 'M9 3v18M4 9h16M4 15h16'])
};

// Wordmark — type-only mark; the brand has no logotype asset on file.
function Wordmark({
  color = '#1A1A1A',
  size = 20
}) {
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '-0.5px',
      color
    }
  }, React.createElement('span', {
    style: {
      width: size * 0.9,
      height: size * 0.9,
      borderRadius: 6,
      background: color,
      color: color === '#1A1A1A' ? '#fff' : '#1A1A1A',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.6,
      fontWeight: 800
    }
  }, 'M'), 'modtate');
}
Object.assign(window, {
  Icons,
  Wordmark
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/leasing/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Breadcrumbs = __ds_scope.Breadcrumbs;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
