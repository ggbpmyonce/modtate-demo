/* Property detail — window.MTAPropertyDetail */
(function () {
  const h = React.createElement;
  const { Icons, StatusBadge, Avatar } = window.MTAUI;
  const { Button, Card } = window.ModtateDesignSystem_410f4d;
  const M = window.MTA;

  // download a (possibly cross-origin) image; fall back to opening in a new tab
  async function downloadImage(url, filename) {
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      const obj = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = obj; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(obj), 1500);
    } catch (e) {
      window.open(url, '_blank', 'noopener');
    }
  }
  async function downloadAll(photos, baseName) {
    for (let i = 0; i < photos.length; i++) {
      await downloadImage(photos[i], `${baseName}-${String(i + 1).padStart(2, '0')}.jpg`);
      await new Promise(r => setTimeout(r, 350)); // stagger so browser allows multiple
    }
  }

  // photo tile with a hover download button
  function PhotoTile({ src, idx, baseName, style, onOpen, children }) {
    const [hover, setHover] = React.useState(false);
    return h('div', { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), onClick: onOpen ? () => onOpen(idx) : null, style: { borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative', background: 'var(--gray-100)', cursor: onOpen ? 'zoom-in' : 'default', ...style } },
      h('img', { src, alt: '', style: img }),
      children,
      h('button', {
        title: '下載此照片', onClick: (e) => { e.stopPropagation(); downloadImage(src, `${baseName}-${String(idx + 1).padStart(2, '0')}.jpg`); },
        style: { position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 999, border: 'none', background: 'rgba(255,255,255,0.92)', color: 'var(--color-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', opacity: hover ? 1 : 0, transform: hover ? 'translateY(0)' : 'translateY(-4px)', transition: 'opacity 130ms ease, transform 130ms ease', zIndex: 2 },
      }, h(Icons.download, { size: 16 })));
  }

  // ── full-screen lightbox viewer ──────────────────────────────
  function Lightbox({ photos, index, baseName, onClose, onIndex }) {
    const go = React.useCallback((d) => onIndex((index + d + photos.length) % photos.length), [index, photos.length, onIndex]);
    React.useEffect(() => {
      const onKey = (e) => { if (e.key === 'Escape') onClose(); else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [go, onClose]);
    const navBtn = (side) => ({ position: 'absolute', top: '50%', [side]: 20, transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: 999, border: 'none', background: 'rgba(255,255,255,0.14)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' });
    return h('div', { onClick: onClose, style: { position: 'fixed', inset: 0, background: 'rgba(10,12,16,0.94)', zIndex: 400, display: 'flex', flexDirection: 'column' } },
      // top bar
      h('div', { onClick: (e) => e.stopPropagation(), style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', color: '#fff' } },
        h('div', { style: { fontSize: 14, fontWeight: 600 } }, baseName, h('span', { style: { color: 'rgba(255,255,255,0.55)', marginLeft: 10, fontFamily: 'var(--font-mono)' } }, `${index + 1} / ${photos.length}`)),
        h('div', { style: { display: 'flex', gap: 8 } },
          h('button', { onClick: () => downloadImage(photos[index], `${baseName}-${String(index + 1).padStart(2, '0')}.jpg`), style: { display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.25)', background: 'transparent', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 } }, h(Icons.download, { size: 15 }), '下載'),
          h('button', { onClick: onClose, title: '關閉', style: { width: 38, height: 38, borderRadius: 999, border: 'none', background: 'rgba(255,255,255,0.14)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, h(Icons.close, { size: 18 })))),
      // main image
      h('div', { onClick: (e) => e.stopPropagation(), style: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 80px', minHeight: 0 } },
        h('img', { src: photos[index], alt: '', style: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' } }),
        photos.length > 1 && h('button', { onClick: () => go(-1), style: navBtn('left') }, h(Icons.chevronLeft, { size: 24 })),
        photos.length > 1 && h('button', { onClick: () => go(1), style: navBtn('right') }, h(Icons.chevronRight, { size: 24 }))),
      // thumbnail rail
      h('div', { onClick: (e) => e.stopPropagation(), style: { display: 'flex', gap: 8, padding: '14px 22px 22px', overflowX: 'auto', justifyContent: 'center' } },
        photos.map((src, i) => h('button', { key: i, onClick: () => onIndex(i), style: { flexShrink: 0, width: 84, height: 56, borderRadius: 7, overflow: 'hidden', border: i === index ? '2px solid #fff' : '2px solid transparent', padding: 0, cursor: 'pointer', background: 'none', opacity: i === index ? 1 : 0.55, transition: 'opacity 120ms ease' } },
          h('img', { src, alt: '', style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } })))));
  }

  const field = (label, valueNode) => h('div', null,
    h('div', { style: { fontSize: 12, color: 'var(--gray-500)' } }, label),
    h('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 3 } }, valueNode));

  function Section({ title, sub, children, top }) {
    return h('div', { style: top ? { paddingTop: 24, borderTop: '1px solid var(--border-default)' } : null },
      h('h2', { style: { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' } }, title),
      sub && h('p', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 2 } }, sub),
      children);
  }
  const facility = (txt) => h('span', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--gray-700)' } },
    h('span', { style: { color: 'var(--color-dark)', display: 'flex' } }, h(Icons.check2, { size: 18 })), txt);

  // summary row replicating the property-list table row
  function DetailSummaryRow({ p, canManage, onDelete }) {
    const td = { padding: '14px 12px', borderBottom: 'none', verticalAlign: 'top' };
    const ghost = { padding: '5px 11px', border: '1px solid var(--border-default)', borderRadius: 999, background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' };
    return h('tr', null,
      h('td', { style: { ...td, paddingLeft: 22, fontFamily: 'var(--font-mono)', color: 'var(--gray-400)', fontSize: 11, whiteSpace: 'nowrap' } }, p.id),
      h('td', { style: { ...td, minWidth: 180 } },
        h('div', { style: { fontWeight: 600, color: 'var(--text-primary)' } }, p.name),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 2 } }, p.address)),
      h('td', { style: { ...td, whiteSpace: 'nowrap' } },
        h('div', { style: { color: 'var(--text-primary)', fontWeight: 500 } }, p.type),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 1 } }, p.floor)),
      h('td', { style: { ...td, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' } }, p.area + ' 坪'),
      h('td', { style: { ...td, whiteSpace: 'nowrap' } },
        h('div', { style: { fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' } }, M.fmt(p.rent)),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 1 } }, '管理費 ' + p.mgmt)),
      h('td', { style: { ...td, fontSize: 12, color: 'var(--gray-600)' } }, p.mrt ? h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 4 } }, h(Icons.mrt, { size: 13 }), h('span', { style: { fontWeight: 500, color: 'var(--text-primary)' } }, p.mrt)) : null),
      h('td', { style: { ...td, fontSize: 12 } },
        h('div', { style: { color: 'var(--gray-600)' } }, p.ac), h('div', { style: { color: 'var(--gray-400)', marginTop: 2 } }, p.parking)),
      h('td', { style: { ...td, minWidth: 120 } }, p.canSeeContact
        ? h('div', null, h('div', { style: { fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 } }, p.contactName), h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 1 } }, p.contactRole), h('div', { style: { fontSize: 12, color: 'var(--gray-600)', fontFamily: 'var(--font-mono)', marginTop: 1 } }, p.phone))
        : h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--gray-400)' } }, h(Icons.lock, { size: 12 }), '僅承辦業務可見')),
      h('td', { style: { ...td, whiteSpace: 'nowrap' } },
        h('div', { style: { fontSize: 12, color: 'var(--gray-600)' } }, p.tax),
        h('div', { style: { fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 } }, M.staffName(p.staff))),
      h('td', { style: td }, h(StatusBadge, { kind: 'prop', status: p.status }), h('div', { style: { fontSize: 11, color: 'var(--gray-400)', marginTop: 3, fontFamily: 'var(--font-mono)' } }, p.created)),
      h('td', { style: { ...td, paddingRight: 22, textAlign: 'right' } },
        h('div', { style: { display: 'flex', gap: 6, justifyContent: 'flex-end' } },
          h('button', { onClick: () => window.scrollTo({ top: 0 }), style: ghost }, '檢視'),
          canManage && onDelete && h('button', { onClick: onDelete, style: { ...ghost, borderColor: 'var(--error-200)', color: 'var(--error-500)' } }, '刪除'))));
  }

  function PropertyDetail({ p, role, mode, userName, onBack, onEdit, onShare, shareCopied, onRemarkAdded, onDocChanged, onDelete }) {
    const full = mode === 'full';
    const canManage = role === '老闆';
    // 編輯權限：老闆／行政（含業務/行政）可編輯所有物件；業務僅能編輯自己承辦的物件
    const myCodes = M.MY_STAFF_CODES[(M.ROLE_CONFIG[role] || {}).name] || [];
    const isMine = myCodes.includes(p.staff);
    const canEditProp = role === '老闆' || (role || '').includes('行政') || isMine;
    const [lb, setLb] = React.useState(-1); // lightbox index, -1 closed
    const photos = p.photos || [];
    const remaining = Math.max(0, photos.length - 5);
    const remarks = React.useMemo(() => M.remarksFor(p), [p.id]);
    const dm = (p.address || '').match(/[市縣](.{2,4}區)/);
    const district = dm ? dm[1] : '—';
    return h(React.Fragment, null,
      lb >= 0 && h(Lightbox, { photos, index: lb, baseName: p.id, onClose: () => setLb(-1), onIndex: setLb }),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
      // breadcrumb + actions
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-400)' } },
          h('span', { onClick: onBack, style: { cursor: 'pointer', fontWeight: 500 } }, '物件管理'),
          h(Icons.chevronRight, { size: 14 }),
          h('span', { style: { fontWeight: 600, color: 'var(--text-primary)' } }, '物件詳細')),
        h('div', { style: { display: 'flex', gap: 10 } },
          h(Button, { variant: 'outline', size: 'sm', iconLeft: h(Icons.arrowLeft, { size: 13 }), onClick: onBack }, '返回列表'),
          full && canEditProp && h(Button, { variant: 'primary', size: 'sm', onClick: onEdit }, '編輯物件'),
          full && !canEditProp && h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--gray-400)' } }, h(Icons.lock, { size: 12 }), '僅承辦業務可編輯'))),
      // gallery
      h('div', { className: 'mta-detail-gallery', style: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 10, height: 380 } },
        h(PhotoTile, { src: photos[0], idx: 0, baseName: p.id, onOpen: setLb, style: { gridRow: 'span 2' } },
          h('div', { style: { position: 'absolute', bottom: 14, left: 14, zIndex: 1 } }, h(StatusBadge, { kind: 'prop', status: p.status }))),
        [1, 2, 3].map(i => h(PhotoTile, { key: i, src: photos[i], idx: i, baseName: p.id, onOpen: setLb })),
        h(PhotoTile, { src: photos[4], idx: 4, baseName: p.id, onOpen: setLb },
          remaining > 0 && h('div', { style: { position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: '#fff', pointerEvents: 'none' } },
            h('span', { style: { fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)' } }, '+' + remaining),
            h('span', { style: { fontSize: 12, fontWeight: 500 } }, '查看全部')))),
      // photo count + view-all link + download-all
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, marginTop: -8 } },
        h('span', { style: { fontSize: 13, color: 'var(--gray-500)' } }, '共 ' + photos.length + ' 張照片'),
        h('button', { onClick: () => setLb(0), style: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 5 } }, h(Icons.gridView, { size: 14 }), '查看所有照片'),
        h('button', { onClick: () => downloadAll(photos, p.id), style: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 5 } }, h(Icons.download, { size: 14 }), '下載全部照片')),
      // title block
      h('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, paddingBottom: 18, borderBottom: '1px solid var(--border-default)' } },
        h('div', null,
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
            full && h('h1', { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' } }, p.name),
            h('span', { style: { fontFamily: 'var(--font-mono)', fontSize: full ? 13 : 20, color: 'var(--text-primary)', fontWeight: full ? 600 : 700 } }, '#' + p.id)),
          full && h('div', { style: { fontSize: 14, color: 'var(--gray-600)', marginTop: 6 } }, p.address),
          h('div', { style: { display: 'flex', gap: 18, marginTop: 14, fontSize: 14, color: 'var(--gray-700)' } },
            meta(Icons.ruler, p.area + ' 坪'), meta(Icons.floors, p.floor), meta(Icons.mrt, p.mrt))),
        h('div', { style: { textAlign: 'right', flexShrink: 0 } },
          h('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' } }, 'NT$ ' + M.fmt(p.rent)),
          h('div', { style: { fontSize: 13, color: 'var(--gray-400)', marginTop: 2 } }, '每月租金' + (p.parking === '租金含車位' ? '（含車位）' : '') + ' · 管理費 ' + p.mgmt))),
      // two-column
      h('div', { id: 'mta-detail-grid', style: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 26 } },
          full
          ? h(React.Fragment, null,
          // 基本資訊
          h(Section, { title: '基本資訊', sub: '物件名稱、位置與類型' },
            h('div', { style: grid3 },
              field('物件編號', h('span', { style: { fontFamily: 'var(--font-mono)' } }, p.id)),
              field('大樓名稱', p.name),
              field('狀態', h(StatusBadge, { kind: 'prop', status: p.status })),
              field('縣市', '台北市'),
              field('行政區', district),
              field('物件類型', p.type),
              p.category === 'office' && field('類別', p.propClass || '純辦'),
              field('是否有租客', p.hasTenant || '無'),
              (p.hasTenant === '有') && field('租約到期', p.leaseUntil || '—'),
              field('出租樓層', p.floor),
              field('總樓層', p.totalFloor || '—'),
              h('div', { style: { gridColumn: '1 / -1' } }, field('地址', p.address)))),
          // 坪數與格局
          h(Section, { title: '坪數與格局', sub: '坪數、登記與隔間', top: true },
            h('div', { style: grid3 },
              field('可使用坪數', h('span', { style: { fontFamily: 'var(--font-mono)' } }, p.area + ' 坪')),
              field('權狀坪數', p.registeredArea || '—'),
              field('主建物坪數', p.mainArea || '—'),
              field('附屬建物坪數', p.accessoryArea || '—'),
              field('可工商登記', p.bizReg || '是'),
              field('可隔間', p.partition || '視情況而定'),
              field('可容納工位數', p.seats || '—'))),
          // 租金
          h(Section, { title: '租金', sub: '租金、押金、稅別與租期', top: true },
            h('div', { style: grid3 },
              field('月租金', h('span', { style: { fontFamily: 'var(--font-mono)', fontWeight: 700 } }, 'NT$ ' + M.fmt(p.rent))),
              field('押金', p.deposit || '面議'),
              field('管理費', h('span', { style: { fontFamily: 'var(--font-mono)' } }, p.mgmt)),
              field('仲介費', p.agencyFee || '—'),
              field('稅別', p.tax),
              field('最短租期', p.minLease || '1年'),
              field('免租期', p.freeRent || '無'),
              field('裝潢程度', p.decoration || '—'))),
          // 設備與設施
          h(Section, { title: '設備與設施', sub: '空調、車位、電梯與物業', top: true },
            h('div', { style: { ...grid3, gap: 14 } },
              facility(p.ac), facility(p.parking), facility('鄰近 ' + p.mrt)),
            (p.ac || '').includes('中央空調') && h('div', { style: grid3 }, field('中央空調供應時間', p.acHours || '—')),
            (p.parkingRent || p.parkingCount) && h('div', { style: grid3 },
              p.parkingRent && field('車位月租金', h('span', { style: { fontFamily: 'var(--font-mono)' } }, 'NT$ ' + M.fmt(p.parkingRent))),
              p.parkingCount && field('車位數量', p.parkingCount + ' 個')),
            p.parkingEntry && h('div', { style: grid3 }, field('車位入口方式', p.parkingEntry)),
            (p.parkingSpaces && p.parkingSpaces.length) && h('div', { style: { marginTop: 16 } },
              h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 } }, '車位明細'),
              h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
                p.parkingSpaces.map((s, i) => h('span', { key: i, style: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', fontSize: 13 } },
                  h('span', { style: { fontWeight: 600, color: 'var(--text-primary)' } }, s.kind),
                  s.price && h('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--gray-600)' } }, 'NT$ ' + M.fmt(s.price) + '/月'))))),
            h('div', { style: grid3 },
              field('廁所', p.toilet || '—'),
              field('層高', p.ceilingH || '—'),
              field('客梯', p.passengerLift || '—'),
              field('貨梯', p.cargoLift || '—'),
              field('物業公司', p.propMgmtCompany || '—'))),
          // 適合行業
          h(Section, { title: '適合行業', sub: '建議的承租行業類別', top: true },
            (p.industries && p.industries.length)
              ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 } }, p.industries.map(x => h('span', { key: x, style: chip }, x)))
              : h('div', { style: { fontSize: 14, color: 'var(--gray-400)', marginTop: 14 } }, '不限')),
          // 附近交通
          h(Section, { title: '附近交通', sub: '鄰近捷運站', top: true },
            h('div', { style: grid3 }, field('捷運路線', p.mrtLine || '—'), field('最近捷運站', p.mrt || '—'))),
          // 店面資訊（僅店面）
          p.category === 'store' && h(Section, { title: '店面資訊', sub: '店面類型與客流', top: true },
            h('div', { style: grid3 },
              field('類型', p.storeType || '—'),
              field('臨路路寬', p.storeRoadWidth || '—'),
              field('經營狀態', p.storeBizStatus || '—')),
            (p.storeTraffic && p.storeTraffic.length) && h('div', { style: { marginTop: 16 } },
              h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 } }, '客流人群'),
              h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, p.storeTraffic.map(x => h('span', { key: x, style: chip }, x)))),
            (p.bannedIndustries && p.bannedIndustries.length) && h('div', { style: { marginTop: 16 } },
              h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 } }, '禁用行業'),
              h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, p.bannedIndustries.map(x => h('span', { key: x, style: { ...chip, background: 'var(--error-100)', borderColor: 'var(--error-200)', color: 'var(--error-700)' } }, x))))),
          // 備註 — moved below the grid to span full width
          null)
          : h(React.Fragment, null,
            h(Section, { title: '物件資訊', sub: '物件基本資料與規格' },
              h('div', { style: grid3 },
                field('物件編號', h('span', { style: { fontFamily: 'var(--font-mono)' } }, p.id)), field('物件類型', p.type), field('狀態', h(StatusBadge, { kind: 'prop', status: p.status })),
                field('坪數', h('span', { style: { fontFamily: 'var(--font-mono)' } }, p.area + ' 坪')), field('樓層', p.floor))),
            h(Section, { title: '租金資訊', sub: '租金、管理費與稅務', top: true },
              h('div', { style: grid3 },
                field('月租金', h('span', { style: { fontFamily: 'var(--font-mono)', fontWeight: 700 } }, 'NT$ ' + M.fmt(p.rent))), field('管理費', h('span', { style: { fontFamily: 'var(--font-mono)' } }, p.mgmt)), field('稅別', p.tax))),
            h(Section, { title: '設施配備', sub: '空調、車位與交通', top: true },
              h('div', { style: { ...grid3, gap: 14 } }, facility(p.ac), facility(p.parking), facility('鄰近 ' + p.mrt))))),
        // contact card
        h(Card, { padding: 22, style: { borderRadius: 'var(--radius-2xl)' } },
          h('div', { style: { marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid var(--border-subtle)' } },
            h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 } }, '承辦業務'),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } }, h(Avatar, { text: (M.staffName(p.staff) || '?')[0], size: 32 }), h('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' } }, M.staffName(p.staff))),
            h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginTop: 14, marginBottom: 4 } }, '建立時間'),
            h('div', { style: { fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--gray-700)' } }, p.created)),
          // 所有權人 + 聯絡資訊 (full view only) — 業務僅可見自己承辦物件
          full && (p.canSeeContact
            ? h('div', null,
                (function () {
                  const owners = (p.owners && p.owners.length) ? p.owners : (p.contactName ? [{ name: (p.contactName || '').replace(/(先生|小姐)$/, ''), honorific: /小姐$/.test(p.contactName || '') ? '小姐' : '先生' }] : []);
                  return owners.length ? h('div', { style: { marginBottom: 18 } },
                    h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 } }, '所有權人'),
                    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, owners.map((o, i) => h('div', { key: i, style: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' } }, (o.name || '') + (o.honorific || ''))))) : null;
                })(),
                h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginBottom: 10 } }, '聯絡資訊'),
                h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
                  (p.contacts && p.contacts.length ? p.contacts : [{ surname: (p.contactName || '').replace(/(先生|小姐)$/, ''), honorific: /小姐$/.test(p.contactName || '') ? '小姐' : '先生', identity: p.contactRole, phone: p.phone }]).map((c, i) => h('div', { key: i, style: { paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' } },
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
                      h('span', { style: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' } }, (c.surname || '') + (c.honorific || '')),
                      c.identity && h('span', { style: { fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', background: 'var(--primary-100)', border: '1px solid var(--border-default)', borderRadius: 999, padding: '1px 8px' } }, c.identity)),
                    c.phone && h('a', { href: 'tel:' + c.phone, style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-700)', fontFamily: 'var(--font-mono)', marginTop: 5, textDecoration: 'none' } }, h(Icons.phone, { size: 13 }), c.phone)))),
                (p.phonePosted || p.selfListed) && h('div', { style: { marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--gray-600)' } },
                  p.phonePosted && h('div', null, '現場張貼屋主電話：' + p.phonePosted),
                  p.selfListed && h('div', null, '屋主自行刊登：' + (p.selfListed === '是' ? (p.selfListedWhere || '是') : '否'))))
            : h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '14px 14px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--gray-500)' } }, h(Icons.lock, { size: 14 }), '聯絡資訊僅承辦業務可見')),
          !full && h(Button, { variant: 'primary', size: 'md', onClick: onShare, iconLeft: shareCopied ? h(Icons.check, { size: 16, stroke: 2 }) : h(Icons.share, { size: 16 }), style: { width: '100%' } }, shareCopied ? '已複製連結' : '分享物件連結'))),
      full && h(Section, { title: '產權文件', sub: '使用分區、使用執照、地籍圖、平面圖 · 僅內部人員可見', top: true }, h(DocsSection, { p, userName, canEditDocs: canEditProp, onChanged: onDocChanged })),
      full && h(Section, { title: '備註／重要資訊', sub: '內部使用 · 含建立人與時間', top: true }, h(RemarkThread, { seed: remarks, userName, canDelete: role === '老闆', onAdded: (text, isReply) => onRemarkAdded && onRemarkAdded(p.name, p.id, isReply) }))));
  }
  const img = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
  const grid3 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px 16px', marginTop: 18 };
  const meta = (Icon, txt) => h('span', { style: { display: 'flex', alignItems: 'center', gap: 5 } }, h(Icon, { size: 16, stroke: 1.4 }), txt);
  const chip = { display: 'inline-flex', alignItems: 'center', padding: '6px 14px', borderRadius: 999, background: 'var(--primary-100)', border: '1px solid var(--border-default)', fontSize: 13, fontWeight: 500, color: 'var(--gray-700)' };

  // ── 產權文件 — internal-only upload/download (使用分區/使用執照/地籍圖) ──
  const fmtKB = (kb) => kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : Math.round(kb) + ' KB';
  function DocsSection({ p, userName, canEditDocs, onChanged }) {
    const CATS = M.DOC_CATS;
    const [docs, setDocs] = React.useState(() => M.docsFor(p));
    React.useEffect(() => { setDocs(M.docsFor(p)); }, [p.id]);
    const [cat, setCat] = React.useState(CATS[0]);
    const [customCat, setCustomCat] = React.useState('');
    const [drag, setDrag] = React.useState(false);
    const inputRef = React.useRef(null), replaceRef = React.useRef(null), pendingReplace = React.useRef(null);
    const flash = (t) => window.MTAToastFlash && window.MTAToastFlash(t);
    const extOf = (n) => ((n.split('.').pop() || '') + '').toLowerCase();
    const addFiles = (files) => {
      const list = Array.from(files || []).filter(f => /pdf|image/.test(f.type) || /\.(pdf|png|jpe?g)$/i.test(f.name));
      if (!list.length) { flash('僅支援 PDF 或圖片檔'); return; }
      const useCat = cat === '其他' ? (customCat.trim() || '其他') : cat;
      setDocs(ds => [...ds, ...list.map((f, i) => ({ id: 'up-' + Date.now() + '-' + i, cat: useCat, ext: extOf(f.name), name: f.name, uploader: userName, time: fmtNow(), sizeKB: f.size / 1024, url: URL.createObjectURL(f) }))]);
      flash('已上傳 ' + list.length + ' 個檔案至「' + useCat + '」');
      if (onChanged) onChanged('上傳了', list.map(f => f.name).join('、'));
    };
    const doReplace = (file) => {
      const id = pendingReplace.current; pendingReplace.current = null;
      if (!file || !id) return;
      setDocs(ds => ds.map(d => d.id === id ? { ...d, name: file.name, ext: extOf(file.name), sizeKB: file.size / 1024, uploader: userName, time: fmtNow(), url: URL.createObjectURL(file), demo: false } : d));
      flash('已更新檔案'); if (onChanged) onChanged('更新了', file.name);
    };
    const del = (d) => { setDocs(ds => ds.filter(x => x.id !== d.id)); flash('已刪除「' + d.name + '」'); if (onChanged) onChanged('刪除了', d.name); };
    const download = (d) => {
      if (d.url) { const a = document.createElement('a'); a.href = d.url; a.download = d.name; document.body.appendChild(a); a.click(); a.remove(); return; }
      const c = document.createElement('canvas'); c.width = 1240; c.height = 877;
      const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, 1240, 877);
      x.strokeStyle = '#D5D7DA'; x.lineWidth = 3; x.strokeRect(30, 30, 1180, 817);
      x.fillStyle = '#1A1A1A'; x.textAlign = 'center'; x.font = '700 60px "Noto Sans TC", sans-serif';
      x.fillText(d.cat, 620, 400);
      x.fillStyle = '#717680'; x.font = '400 30px "Noto Sans TC", sans-serif';
      x.fillText('示範文件 · ' + p.id + ' · ' + (p.name || ''), 620, 460);
      c.toBlob(b => { const url = URL.createObjectURL(b); const a = document.createElement('a'); a.href = url; a.download = d.name.replace(/\.[^.]+$/, '') + '.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); });
    };
    const isPdf = (e) => e === 'pdf';
    const extBadge = (ext) => h('span', { style: { flexShrink: 0, width: 42, height: 42, borderRadius: 'var(--radius-md)', background: isPdf(ext) ? 'var(--error-100)' : 'var(--primary-100)', color: isPdf(ext) ? 'var(--error-500)' : 'var(--gray-600)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 } },
      h(Icons.fileDoc, { size: 15 }), h('span', { style: { fontSize: 8, fontWeight: 700, letterSpacing: 0.5 } }, (ext || 'file').toUpperCase()));
    const ghost = { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', border: '1px solid var(--border-default)', borderRadius: 999, background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' };
    const docRow = (d) => h('div', { key: d.id, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderTop: '1px solid var(--border-subtle)' } },
      extBadge(d.ext),
      h('div', { style: { flex: 1, minWidth: 0 } },
        h('div', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, d.name),
        h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 2 } }, d.uploader + (d.uploaderRole ? '（' + d.uploaderRole + '）' : '') + ' 上傳 · ' + d.time + ' · ' + fmtKB(d.sizeKB))),
      h('div', { style: { display: 'flex', gap: 6, flexShrink: 0 } },
        h('button', { style: ghost, onClick: () => download(d), title: '下載' }, h(Icons.download, { size: 13 }), '下載'),
        canEditDocs && h('button', { style: ghost, onClick: () => { pendingReplace.current = d.id; replaceRef.current && replaceRef.current.click(); }, title: '替換檔案' }, '替換'),
        canEditDocs && h('button', { style: { ...ghost, borderColor: 'var(--error-200)', color: 'var(--error-500)' }, onClick: () => del(d), title: '刪除' }, h(Icons.trash, { size: 13 }), '刪除')));
    const dynCats = [...new Set(docs.map(d => d.cat).filter(c => !CATS.includes(c)))];
    const groups = CATS.filter(c => c !== '其他').map(c => ({ cat: c, items: docs.filter(d => d.cat === c) }))
      .concat(dynCats.map(c => ({ cat: c, items: docs.filter(d => d.cat === c) })))
      .concat(docs.some(d => d.cat === '其他') ? [{ cat: '其他', items: docs.filter(d => d.cat === '其他') }] : []);
    return h('div', { style: { marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--gray-500)', background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '8px 12px' } },
        h(Icons.lock, { size: 13 }), canEditDocs ? '內部文件 — 老闆／行政可修改所有物件；業務僅能修改自己承辦物件的文件。分享連結的客戶不會看到此區塊。' : '內部文件 — 此物件由其他業務承辦，您僅能檢視與下載文件。分享連結的客戶不會看到此區塊。'),
      canEditDocs && h('div', { onDragOver: (e) => { e.preventDefault(); setDrag(true); }, onDragLeave: () => setDrag(false), onDrop: (e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }, style: { border: '1.5px dashed ' + (drag ? 'var(--color-dark)' : 'var(--border-strong)'), background: drag ? 'var(--primary-100)' : '#fff', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', transition: 'border-color 130ms ease, background 130ms ease' } },
        h('span', { style: { width: 40, height: 40, borderRadius: 999, background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-dark)', flexShrink: 0 } }, h(Icons.upload, { size: 18 })),
        h('div', { style: { flex: 1, minWidth: 180 } },
          h('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' } }, '拖曳檔案到此處，或點擊上傳'),
          h('div', { style: { fontSize: 12, color: 'var(--gray-400)', marginTop: 2 } }, '支援 PDF、PNG、JPG（電腦截圖），可一次選取多個檔案')),
        h(Button, { variant: 'primary', size: 'sm', iconLeft: h(Icons.upload, { size: 14 }), onClick: () => inputRef.current && inputRef.current.click(), style: { flexShrink: 0 } }, '上傳檔案'),
        h('div', { style: { width: '100%', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 10, borderTop: '1px dashed var(--border-default)' } },
          h('span', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--gray-500)', flexShrink: 0 } }, '文件類別'),
          CATS.map(c => { const on = cat === c; return h('button', { key: c, type: 'button', onClick: () => setCat(c), style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 13px', borderRadius: 999, border: '1px solid ' + (on ? 'var(--color-dark)' : 'var(--border-strong)'), background: on ? 'var(--color-dark)' : '#fff', color: on ? '#fff' : 'var(--gray-600)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, on && h(Icons.check, { size: 12, stroke: 2.5 }), c); }),
          cat === '其他' && h('input', { value: customCat, onChange: (e) => setCustomCat(e.target.value), placeholder: '輸入文件名稱，例：租約、建物謄本…', style: { padding: '6px 12px', border: '1px solid var(--border-strong)', borderRadius: 999, fontSize: 12.5, fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none', width: 220 } })),
        h('input', { ref: inputRef, type: 'file', multiple: true, accept: 'application/pdf,image/png,image/jpeg', style: { display: 'none' }, onChange: (e) => { addFiles(e.target.files); e.target.value = ''; } }),
        h('input', { ref: replaceRef, type: 'file', accept: 'application/pdf,image/png,image/jpeg', style: { display: 'none' }, onChange: (e) => { doReplace(e.target.files[0]); e.target.value = ''; } })),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
        groups.map(g => h('div', { key: g.cat, style: { border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', background: '#fff', overflow: 'hidden' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface-sunken)' } },
            h('span', { style: { fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' } }, g.cat),
            h('span', { style: { fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--gray-500)', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 999, padding: '1px 8px' } }, g.items.length),
            g.items.length === 0 && h('span', { style: { fontSize: 12, color: 'var(--warning-600, #b54708)', marginLeft: 'auto' } }, '尚未上傳 — 可由行政後續補上')),
          g.items.map(docRow)))));
  }

  // ── remark discussion (Slack/Notion-style threads with replies) ──
  function fmtNow() {
    const n = new Date();
    return `${n.getFullYear()}/${String(n.getMonth() + 1).padStart(2, '0')}/${String(n.getDate()).padStart(2, '0')} ${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
  }
  function Avatar2({ name, me }) {
    return h('span', { style: { flexShrink: 0, width: 32, height: 32, borderRadius: 999, background: me ? 'var(--color-dark)' : 'var(--gray-100)', color: me ? '#fff' : 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 } }, (name || '?')[0]);
  }
  function ReplyComposer({ userName, onSend, participants }) {
    const [draft, setDraft] = React.useState('');
    const others = (participants || []).filter(p => p !== userName);
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 } },
      h('div', { style: { display: 'flex', gap: 8, alignItems: 'flex-end' } },
        h(Avatar2, { name: userName, me: true }),
        h('textarea', { value: draft, onChange: (e) => setDraft(e.target.value), placeholder: '回覆…', style: { flex: 1, minHeight: 40, padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--text-primary)', resize: 'vertical' } }),
        h('button', { onClick: () => { const t = draft.trim(); if (!t) return; onSend(t); setDraft(''); }, disabled: !draft.trim(), title: '送出回覆', style: { flexShrink: 0, width: 40, height: 40, borderRadius: 999, border: 'none', background: draft.trim() ? 'var(--color-dark)' : 'var(--gray-200)', color: '#fff', cursor: draft.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, h(Icons.arrowUp || Icons.plus, { size: 16, stroke: 2.2 }))),
      others.length > 0 && h('div', { style: { fontSize: 11, color: 'var(--gray-400)', paddingLeft: 40 } }, '送出後將通知討論串成員：' + others.join('、')));
  }

  function RemarkThread({ seed, userName, canDelete, onAdded }) {
    const norm = (arr) => (arr || []).map((r, i) => ({ id: r.id || 'r' + i + '-' + (r.time || ''), author: r.author, time: r.time, text: r.text, edited: r.edited, isMe: r.isMe || r.author === userName, replies: (r.replies || []).map((x, j) => ({ id: x.id || 'rr' + i + j, author: x.author, time: x.time, text: x.text, edited: x.edited, isMe: x.isMe || x.author === userName })) }));
    const [threads, setThreads] = React.useState(() => norm(seed));
    const [draft, setDraft] = React.useState('');
    const [openReply, setOpenReply] = React.useState(null); // thread id
    const [expanded, setExpanded] = React.useState({});

    const participantsOf = (t) => Array.from(new Set([t.author, ...t.replies.map(r => r.author)]));
    const notify = (t, extra) => { const others = participantsOf(t).filter(p => p !== userName); if (window.MTAToastFlash) window.MTAToastFlash(others.length ? '已通知討論串成員：' + others.join('、') : (extra || '已送出')); };

    const addThread = () => {
      const text = draft.trim(); if (!text) return;
      setThreads(ts => [...ts, { id: 'new-' + Date.now(), author: userName || '我', time: fmtNow(), text, isMe: true, replies: [] }]);
      setDraft('');
      if (onAdded) onAdded(text, false);
      if (window.MTAToastFlash) window.MTAToastFlash('已新增備註');
    };
    const addReply = (tid, text) => {
      setThreads(ts => ts.map(t => {
        if (t.id !== tid) return t;
        const nt = { ...t, replies: [...t.replies, { id: 're-' + Date.now(), author: userName || '我', time: fmtNow(), text, isMe: true }] };
        notify(t);
        return nt;
      }));
      setExpanded(e => ({ ...e, [tid]: true }));
      setOpenReply(null);
      if (onAdded) onAdded(text, true);
    };
    const delThread = (tid) => { setThreads(ts => ts.filter(t => t.id !== tid)); if (window.MTAToastFlash) window.MTAToastFlash('已刪除備註'); };
    const delReply = (tid, rid) => { setThreads(ts => ts.map(t => t.id === tid ? { ...t, replies: t.replies.filter(r => r.id !== rid) } : t)); if (window.MTAToastFlash) window.MTAToastFlash('已刪除回覆'); };
    const editThread = (tid, text) => { setThreads(ts => ts.map(t => t.id === tid ? { ...t, text, edited: true } : t)); if (window.MTAToastFlash) window.MTAToastFlash('已更新備註'); };
    const editReply = (tid, rid, text) => { setThreads(ts => ts.map(t => t.id === tid ? { ...t, replies: t.replies.map(r => r.id === rid ? { ...r, text, edited: true } : r) } : t)); if (window.MTAToastFlash) window.MTAToastFlash('已更新回覆'); };

    const [editingId, setEditingId] = React.useState(null);
    const [editDraft, setEditDraft] = React.useState('');
    const startEdit = (id, text) => { setEditingId(id); setEditDraft(text); };
    const editorBox = (onSave) => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 } },
      h('textarea', { value: editDraft, onChange: (e) => setEditDraft(e.target.value), style: { width: '100%', minHeight: 56, padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--text-primary)', resize: 'vertical' } }),
      h('div', { style: { display: 'flex', gap: 8 } },
        h('button', { onClick: () => { const t = editDraft.trim(); if (t) onSave(t); setEditingId(null); }, disabled: !editDraft.trim(), style: { padding: '6px 14px', border: 'none', borderRadius: 999, background: editDraft.trim() ? 'var(--color-dark)' : 'var(--gray-200)', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: editDraft.trim() ? 'pointer' : 'default', fontFamily: 'inherit' } }, '儲存'),
        h('button', { onClick: () => setEditingId(null), style: { padding: '6px 14px', border: '1px solid var(--border-default)', borderRadius: 999, background: '#fff', fontSize: 12.5, fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit' } }, '取消')));
    // per-message actions: own → edit + delete; boss on others → delete only
    const msgActions = (r, onEdit, onDel) => {
      const canEdit = r.isMe, canDel = r.isMe || canDelete;
      if (!canEdit && !canDel) return null;
      const btn = (label, color, onClick) => h('button', { onClick, style: { background: 'none', border: 'none', padding: 0, fontSize: 12, fontWeight: 600, color, cursor: 'pointer', fontFamily: 'inherit' } }, label);
      return h('div', { style: { display: 'flex', gap: 14, marginLeft: 'auto', flexShrink: 0 } },
        canEdit && btn('編輯', 'var(--gray-600)', onEdit),
        canDel && btn('刪除', 'var(--error-500)', onDel));
    };

    const msgHead = (r) => h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
      h('span', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' } }, r.author),
      r.isMe && h('span', { style: { fontSize: 11, fontWeight: 600, color: '#fff', background: 'var(--color-dark)', padding: '1px 8px', borderRadius: 999 } }, '我'),
      h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-mono)' } }, h(Icons.clock, { size: 12 }), r.time),
      r.edited && h('span', { style: { fontSize: 11, color: 'var(--gray-400)' } }, '（已編輯）'));

    return h('div', { style: { marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 } },
      threads.length === 0
        ? h('div', { style: { fontSize: 14, color: 'var(--gray-400)', padding: '20px', textAlign: 'center', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' } }, '尚無備註，於下方開始第一則討論。')
        : h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
          threads.map((t) => {
            const isOpen = expanded[t.id];
            const parts = participantsOf(t);
            return h('div', { key: t.id, style: { border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', background: '#fff', overflow: 'hidden' } },
              // root message
              h('div', { style: { display: 'flex', gap: 12, padding: '14px 16px' } },
                h(Avatar2, { name: t.author, me: t.isMe }),
                h('div', { style: { flex: 1, minWidth: 0 } },
                  h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 8 } }, msgHead(t), msgActions(t, () => startEdit(t.id, t.text), () => delThread(t.id))),
                  editingId === t.id
                    ? editorBox((text) => editThread(t.id, text))
                    : h('div', { style: { fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.7, marginTop: 5, whiteSpace: 'pre-wrap' } }, t.text),
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 } },
                    h('button', { onClick: () => setOpenReply(openReply === t.id ? null : t.id), style: { display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', padding: 0, fontSize: 12.5, fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'inherit' } }, h(Icons.inquiry, { size: 14 }), '回覆'),
                    t.replies.length > 0 && h('button', { onClick: () => setExpanded(e => ({ ...e, [t.id]: !isOpen })), style: { display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', padding: 0, fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit' } }, h(isOpen ? Icons.chevronDown : Icons.chevronRight, { size: 13 }), t.replies.length + ' 則回覆'),
                    parts.length > 1 && h('span', { style: { fontSize: 11, color: 'var(--gray-400)' } }, parts.length + ' 人參與')))),
              // replies
              isOpen && t.replies.length > 0 && h('div', { style: { borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)', padding: '6px 16px 10px 44px' } },
                t.replies.map((r) => h('div', { key: r.id, style: { display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' } },
                  h(Avatar2, { name: r.author, me: r.isMe }),
                  h('div', { style: { flex: 1, minWidth: 0 } },
                    h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 8 } }, msgHead(r), msgActions(r, () => startEdit(r.id, r.text), () => delReply(t.id, r.id))),
                    editingId === r.id
                      ? editorBox((text) => editReply(t.id, r.id, text))
                      : h('div', { style: { fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.7, marginTop: 4, whiteSpace: 'pre-wrap' } }, r.text))))),
              // reply composer
              openReply === t.id && h('div', { style: { borderTop: '1px solid var(--border-subtle)', padding: '10px 16px 14px 44px' } },
                h(ReplyComposer, { userName, participants: parts, onSend: (text) => addReply(t.id, text) })));
          })),
      // new top-level remark
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', paddingTop: 4 } },
        h('textarea', { value: draft, onChange: (e) => setDraft(e.target.value), placeholder: '新增備註／開啟新討論… （以 ' + (userName || '我') + ' 的身份）', style: { width: '100%', minHeight: 64, padding: '10px 14px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--text-primary)', resize: 'vertical' } }),
        h(Button, { variant: 'primary', size: 'sm', disabled: !draft.trim(), onClick: addThread }, '新增備註')));
  }

  window.MTAPropertyDetail = PropertyDetail;
})();
