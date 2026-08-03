'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

/*
  Modtate Admin — Next.js entry route.

  The existing UI is a set of browser-global component modules (app/*.jsx) that
  register onto window (window.MTASidebar, window.MTAProperties, …) and are
  transpiled in-browser by Babel Standalone, exactly as in the original single-file
  build. To get a runnable Next.js app fast without rewriting every module, we load
  React/ReactDOM/Babel + the design-system bundle + those component scripts from
  /public via <Script>, then let app/App.jsx mount into #root.

  ── Migrating to idiomatic Next.js (recommended next step for engineers) ──
  Each file in public/app is an IIFE that reads window.React and assigns to
  window.MTA*. To modernise:
    1. Convert each to an ES module: `import React from 'react'` +
       `export function Sidebar(){…}` instead of the window bridge.
    2. Replace React.createElement calls with JSX (optional; they already work).
    3. Import the design-system components from a real package build instead of
       window.ModtateDesignSystem_410f4d.
    4. Delete this Script-loader page and render <App/> directly.
  The component logic itself is unchanged — only the module wiring differs.
*/

const DS = '/_ds/modern-design-system-410f4dcf-0877-43ef-92bc-118095108ad4';
// order matters: shared → leaf components → App last
const APP_SCRIPTS = [
  'shared.jsx', 'Login.jsx', 'Sidebar.jsx', 'Header.jsx', 'Dashboard.jsx',
  'Properties.jsx', 'PillFilters.jsx', 'PropertyDetail.jsx', 'PropertyForm.jsx',
  'Tenants.jsx', 'Inquiries.jsx', 'Members.jsx', 'Account.jsx',
  'tweaks-panel.jsx', 'App.jsx',
];

export default function Page() {
  const [stage, setStage] = useState('react'); // react → ds → babel → app
  const loaded = useRef(new Set());

  return (
    <>
      {/* React + ReactDOM (UMD) */}
      <Script src="https://unpkg.com/react@18.3.1/umd/react.development.js" strategy="afterInteractive" onLoad={() => loaded.current.add('react')} />
      <Script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" strategy="afterInteractive" onLoad={() => setStage('ds')} />

      {/* Design-system bundle + plain data (no Babel) */}
      {stage !== 'react' && (
        <>
          <Script src={`${DS}/_ds_bundle.js`} strategy="afterInteractive" />
          <Script src="/app/data.js" strategy="afterInteractive" onLoad={() => setStage('babel')} />
        </>
      )}

      {/* Babel Standalone, then the JSX component modules */}
      {(stage === 'babel' || stage === 'app') && (
        <Script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" strategy="afterInteractive" onLoad={() => setStage('app')} />
      )}
      {stage === 'app' && <BabelScripts />}

      <div id="root" />
    </>
  );
}

/* Fetch each .jsx as text, transform with Babel, and eval in order so the
   window.MTA* globals register before App.jsx runs. */
function BabelScripts() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // wait until Babel is present
      for (let i = 0; i < 100 && !window.Babel; i++) await new Promise(r => setTimeout(r, 50));
      if (!window.Babel || cancelled) return;
      for (const name of APP_SCRIPTS) {
        const src = await fetch(`/app/${name}`).then(r => r.text());
        const { code } = window.Babel.transform(src, { presets: ['react'], filename: name });
        // eslint-disable-next-line no-new-func
        new Function(code)();
        if (cancelled) return;
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return null;
}
