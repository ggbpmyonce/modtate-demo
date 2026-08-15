/* ============================================================
   Modtate Admin — data layer (verbatim from reference spec)
   All field names, options and sample data mirror the source.
   Exposed as window.MTA
   ============================================================ */
(function () {
  // ── Role config ─────────────────────────────────────────────
  // DS-adherent: avatars are monochrome near-black. Role is read from label,
  // not hue (status colours are reserved for state only).
  const ROLE_CONFIG = {
    '老闆': { initial: 'A', name: 'Aven Hsu', title: '老闆', email: 'aven@modtate.com',
      nav: ['properties', 'tenants', 'members'] },
    '業務': { initial: '巫', name: '小巫', title: '業務', email: 'wu@modtate.com',
      nav: ['properties'] },
    '行政': { initial: '王', name: '王小美', title: '行政', email: 'wang@modtate.com',
      nav: ['properties', 'tenants'] },
    '業務/行政': { initial: '林', name: '林雅婷', title: '業務/行政', email: 'lin@modtate.com',
      nav: ['properties', 'tenants'] },
  };

  // 業務 sees contacts only for their own staff codes
  const MY_STAFF_CODES = { '小巫': ['V', 'A'], '張偉明': ['W'], '黃淑芬': ['H'], '林雅婷': ['V', 'A'] };
  const STAFF_MAP = { 'V': '林雅婷', 'W': '張偉明', 'H': '黃淑芬', 'A': '林雅婷', '-': '—' };

  // ── Filter option lists ─────────────────────────────────────
  const FILTERS = {
    districts: ['大安區', '內湖區', '士林區', '文山區', '北投區', '中山區', '信義區', '松山區', '萬華區', '中正區', '大同區', '南港區'],
    rent: ['2萬以下', '2-5萬', '5-8萬', '8-12萬', '12-20萬', '20-40萬', '40萬以上'],
    area: ['10坪以下', '10-30坪', '30-50坪', '50-70坪', '70-100坪', '100-150坪', '150坪以上'],
    floor: ['1樓以下', '1-3樓', '4-6樓', '7-9樓', '10-12樓', '12樓以上'],
    decoration: ['尚未裝潢', '簡易裝潢', '高檔裝潢', '豪華裝潢'],
    buildingType: ['公寓', '電梯大樓', '透天厝', '別墅', '店面(店鋪)'],
    propClass: ['純辦', '住辦'],
    houseType: ['公寓', '別墅', '透天厝', '店面(店鋪)', '電梯大樓'],
    storeType: ['商業街店面', '社區底商', '辦公樓配套', '購物/百貨中心店面', '路邊/臨街門面', '檔口攤位', '交通設施商鋪', '其他'],
    source: ['屋主', '代理人', '仲介'],
  };
  const RENT_RANGES = { '2萬以下': [0, 20000], '2-5萬': [20000, 50000], '5-8萬': [50000, 80000], '8-12萬': [80000, 120000], '12-20萬': [120000, 200000], '20-40萬': [200000, 400000], '40萬以上': [400000, Infinity] };
  const AREA_RANGES = { '10坪以下': [0, 10], '10-30坪': [10, 30], '30-50坪': [30, 50], '50-70坪': [50, 70], '70-100坪': [70, 100], '100-150坪': [100, 150], '150坪以上': [150, Infinity] };
  const FLOOR_RANGES = { '1樓以下': [0, 1], '1-3樓': [1, 3], '4-6樓': [4, 6], '7-9樓': [7, 9], '10-12樓': [10, 12], '12樓以上': [12, Infinity] };

  const STORE_TYPES = ['一樓店面', '店面', '樓店'];

  const OFFICE_PHOTOS = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80',
    'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1200&q=80',
  ];
  const STORE_PHOTOS = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&q=80',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&q=80',
    'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=1200&q=80',
    'https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=1200&q=80',
    'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=1200&q=80',
    'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=1200&q=80',
  ];
  // resource-id map (for standalone offline bundling via window.__resources)
  const URL_RES = {};
  OFFICE_PHOTOS.forEach((u, i) => { URL_RES[u] = 'off' + i; });
  STORE_PHOTOS.forEach((u, i) => { URL_RES[u] = 'st' + i; });
  function res(url) { try { const id = URL_RES[url]; return (id && window.__resources && window.__resources[id]) || url; } catch (e) { return url; } }

  // ── Properties (15 office + 6 store) ────────────────────────
  const PROPERTIES = [
    { id: 'A01', name: '站前運通', address: '台北市大同區鄭州街87號7樓之1', type: '整層辦公', floor: '12F', area: 137.45, rent: 222757, status: 'listing', created: '2023/10/18 09:06', mrt: '台北車站', mgmt: '現場問', ac: '中央空調', parking: '無車位', contactRole: '屋主', contactName: '廖先生', phone: '0932-344-801', staff: 'V', tax: '未稅' },
    { id: 'A02', name: '富享京王', address: '台北市大同區承德路一段23號3樓之3', type: '整層辦公', floor: '32F', area: 57.27, rent: 131835, status: 'negotiating', created: '2023/10/18 09:06', mrt: '台北車站', mgmt: '9,163', ac: '獨立冷氣', parking: '有車位另租', contactRole: '屋主', contactName: '陳小姐', phone: '0932-005-680', staff: 'V', tax: '未稅' },
    { id: 'A03', name: '中山TED', address: '台北市中山區中山北路二段118號2樓', type: '分間辦公', floor: '14F', area: 23, rent: 73888, status: 'signed', created: '2023/10/18 09:06', mrt: '中山站', mgmt: '5,100', ac: '獨立冷氣', parking: '無車位', contactRole: '屋主', contactName: '蕭先生', phone: '0932-332-707', staff: 'W', tax: '未稅' },
    { id: 'A04', name: '國泰敦南信義大樓', address: '台北市信義區敦化南路二段39號3樓本號', type: '整層辦公', floor: '19F', area: 156, rent: 452400, status: 'signed', created: '2023/10/18 09:06', mrt: '大安站', mgmt: '25,740', ac: '中央空調', parking: '無車位', contactRole: '屋主', contactName: '黃先生', phone: '02-2755-9149', staff: 'V', tax: '未稅' },
    { id: 'A05', name: '中農科技大樓', address: '台北市信義區東興路51號10樓', type: '整層辦公', floor: '11F', area: 30, rent: 60000, status: 'listing', created: '2023/10/18 09:06', mrt: '南京三民', mgmt: '含租金', ac: '中央空調', parking: '無車位', contactRole: '代理人', contactName: '李小姐', phone: '0971-688-64', staff: 'W', tax: '未稅' },
    { id: 'A06', name: '福爾摩沙', address: '台北市信義區松德路159號20樓之1', type: '整層辦公', floor: '30F', area: 61.51, rent: 129888, status: 'deposited', created: '2023/10/18 09:06', mrt: '永春站', mgmt: '9,815', ac: '獨立冷氣', parking: '含車位', contactRole: '屋主', contactName: '高先生', phone: '0902-310-198', staff: 'V', tax: '未稅' },
    { id: 'A07', name: '忠孝天廈', address: '台北市信義區忠孝東路五段410號16樓', type: '整層辦公', floor: '18F', area: 61.6, rent: 129888, status: 'listing', created: '2023/10/18 09:06', mrt: '永春站', mgmt: '6,290', ac: '獨立冷氣', parking: '有車位另租', contactRole: '屋主', contactName: '陳小姐', phone: '0966-680-985', staff: '-', tax: '未稅' },
    { id: 'A08', name: '國民大廈', address: '台北市大安區敦化南路二段267號11樓之1', type: '分間辦公', floor: '17F', area: 30.2, rent: 50000, status: 'signed', created: '2023/10/19 10:13', mrt: '六張犁', mgmt: '現場問', ac: '獨立冷氣', parking: '無車位', contactRole: '屋主', contactName: '袁先生', phone: '0922-592-188', staff: 'W', tax: '含稅' },
    { id: 'A09', name: '聯合第一大樓', address: '台北市中山區南京東路一段86號10樓之5', type: '分間辦公', floor: '11F', area: 14.06, rent: 29888, status: 'negotiating', created: '2023/10/19 10:13', mrt: '松江南京', mgmt: '2,000', ac: '獨立冷氣', parking: '無車位', contactRole: '員工', contactName: '李先生', phone: '0952-693-906', staff: 'W', tax: '含稅' },
    { id: 'A10', name: '忠孝天廈 2樓', address: '台北市信義區忠孝東路五段410號2樓之8', type: '分間辦公', floor: '2F', area: 21, rent: 29000, status: 'signed', created: '2023/10/19 10:13', mrt: '永春站', mgmt: '2,339', ac: '中央空調', parking: '無車位', contactRole: '總幹事', contactName: '謝先生', phone: '02-8780-4846', staff: 'W', tax: '未稅' },
    { id: 'A11', name: '春暉新世界', address: '台北市中山區錦州街46號8樓', type: '整層辦公', floor: '13F', area: 52.8, rent: 56000, status: 'listing', created: '2023/10/20 11:20', mrt: '中山國小', mgmt: '4,224', ac: '獨立冷氣', parking: '無車位', contactRole: '代理人', contactName: '黃先生', phone: '0930-116-092', staff: 'H', tax: '未稅' },
    { id: 'A12', name: '雅馨商辦', address: '台北市中山區民生東路三段3號8樓', type: '整層辦公', floor: '12F', area: 66.8, rent: 114257, status: 'deposited', created: '2023/10/20 11:20', mrt: '行天宮', mgmt: '7,000', ac: '獨立冷氣', parking: '無車位', contactRole: '代理人', contactName: '管理員先生', phone: '02-2509-3259', staff: 'V', tax: '未稅' },
    { id: 'A13', name: '瑞皇大樓', address: '台北市中山區民生東路一段40號1樓', type: '共享辦公', floor: '1F', area: 35, rent: 12000, status: 'deposited', created: '2023/10/20 11:20', mrt: '雙連站', mgmt: '1,573', ac: '獨立冷氣', parking: '無車位', contactRole: '大樓總幹事', contactName: '陳先生', phone: '0937-560-904', staff: 'H', tax: '含稅' },
    { id: 'A14', name: '任遠信義', address: '台北市信義區忠孝東路五段669號9樓之2', type: '整層辦公', floor: '10F', area: 73.95, rent: 125714, status: 'signed', created: '2023/10/20 11:20', mrt: '永春站', mgmt: '約150/坪', ac: '獨立冷氣', parking: '無車位', contactRole: '屋主', contactName: '黃小姐', phone: '0937-027-892', staff: 'V', tax: '未稅' },
    { id: 'A15', name: '建業大廈', address: '台北市松山區南京東路四段170號12樓', type: '分間辦公', floor: '12F', area: 17.1, rent: 24000, status: 'preparing', created: '2023/10/21 12:27', mrt: '台北小巨蛋', mgmt: '1,200', ac: '獨立冷氣', parking: '無車位', contactRole: '仲介', contactName: '張先生', phone: '0912-345-678', staff: 'W', tax: '含稅', contacts: [{ identity: '所有權人', honorific: '先生', surname: '張', phone: '0912-345-678' }, { identity: '代理人', honorific: '小姐', surname: '陳', phone: '0933-777-888' }] },
    { id: 'B01', name: '忠孝SOGO金店面', address: '台北市大安區忠孝東路四段45號1樓', type: '一樓店面', floor: '1F', area: 42, rent: 280000, status: 'listing', created: '2023/11/02 11:54', mrt: '忠孝復興', mgmt: '現場問', ac: '獨立冷氣', parking: '無車位', contactRole: '屋主', contactName: '林先生', phone: '0911-222-333', staff: 'V', tax: '含稅' },
    { id: 'B02', name: '西門町徒步區店面', address: '台北市萬華區漢中街50號1樓', type: '一樓店面', floor: '1F', area: 28, rent: 165000, status: 'preparing', created: '2023/11/03 12:01', mrt: '西門站', mgmt: '3,200', ac: '獨立冷氣', parking: '無車位', contactRole: '仲介', contactName: '王小姐', phone: '0922-333-444', staff: 'W', tax: '未稅' },
    { id: 'B03', name: '永康街美食店面', address: '台北市大安區永康街12號1樓', type: '店面', floor: '1F', area: 18, rent: 98000, status: 'signed', created: '2023/11/05 14:15', mrt: '東門站', mgmt: '含租金', ac: '獨立冷氣', parking: '無車位', contactRole: '屋主', contactName: '陳小姐', phone: '0933-444-555', staff: 'H', tax: '未稅' },
    { id: 'B04', name: '公館商圈店面', address: '台北市中正區羅斯福路三段286號1樓', type: '一樓店面', floor: '1F', area: 35, rent: 135000, status: 'signed', created: '2023/11/08 17:36', mrt: '公館站', mgmt: '4,500', ac: '獨立冷氣', parking: '無車位', contactRole: '代理人', contactName: '李先生', phone: '0944-555-666', staff: 'V', tax: '含稅' },
    { id: 'B05', name: '師大夜市樓店', address: '台北市大安區師大路39號2樓', type: '樓店', floor: '2F', area: 50, rent: 88000, status: 'listing', created: '2023/11/10 10:50', mrt: '台電大樓', mgmt: '2,800', ac: '獨立冷氣', parking: '無車位', contactRole: '屋主', contactName: '黃先生', phone: '0955-666-777', staff: 'H', tax: '未稅' },
    { id: 'B06', name: '南京三民角間店面', address: '台北市松山區南京東路五段123號1樓', type: '一樓店面', floor: '1F', area: 60, rent: 220000, status: 'negotiating', created: '2023/11/12 12:04', mrt: '南京三民', mgmt: '6,000', ac: '中央空調', parking: '含車位', contactRole: '屋主', contactName: '吳先生', phone: '0966-777-888', staff: 'V', tax: '含稅' },
  ];

  // ── Inquiries ───────────────────────────────────────────────
  const INQUIRIES = [
    { property: '信義商辦 A棟2F', name: '張偉明', phone: '0912-345-678', email: 'chang@example.com', date: '2026/06/15 14:23', status: 'new', message: '請問是否可提供公司網路設備？' },
    { property: '南港軟體園區辦公室', name: '林雅婷', phone: '0923-456-789', email: 'lin@techco.com', date: '2026/06/14 10:05', status: 'replied', message: '想了解停車位數量與收費資訊' },
    { property: '大安精品辦公室', name: '陳建宏', phone: '0934-567-890', email: 'chen@startup.tw', date: '2026/06/13 16:40', status: 'deal', message: '有意租用，想預約現場看屋時間' },
    { property: '松山區商辦', name: '王小明', phone: '0945-678-901', email: 'wang@corp.com', date: '2026/06/12 09:15', status: 'closed', message: '詢問租金是否可議，有意長租' },
    { property: '內湖科技廠辦', name: '李美玲', phone: '0956-789-012', email: 'li@factory.com', date: '2026/06/11 11:30', status: 'new', message: '請問電力供應規格及三相電是否可用？' },
  ];

  // ── Tenants (來電客戶) ──────────────────────────────────────
  const TENANTS = [
    { name: "賴先生", phones: [{ value: "02-8195-3000 分機8452" }, { value: "回撥 0975-131-821" }], phone: "02-8195-3000 分機8452\n回撥 0975-131-821", taxId: "29152146", industry: "鉅睿國際科技股份有限公司（電子業）", notes: "想了解使用坪數多少？廁內或廁外？屋主可否接受室內需重新裝潢？", staffName: "暫時不指派", date: "2026/06/25 10:12", status: "new" },
    { name: "賴先生", phones: [{ value: "0975-131-821" }], phone: "0975-131-821", taxId: "29152146", industry: "鉅睿國際科技股份有限公司（電子業）", notes: "第二次來電：確認可看屋時間，希望本週五下午帶看信義區兩間，預算調高到12萬。", staffName: "林雅婷", date: "2026/06/27 14:40", status: "scheduled" },
    { name: "王特助（鉅睿）", phones: [{ value: "02-8195-3000 分機8461" }], phone: "02-8195-3000 分機8461", taxId: "29152146", industry: "鉅睿國際科技股份有限公司（電子業）", notes: "同公司不同分機來電：老闆指定要有獨立會議室，請一併準備報價。", staffName: "林雅婷", date: "2026/06/30 09:20", status: "new" },
    { name: "莊小姐", phones: [{ value: "0910-021-663" }], phone: "0910-021-663", industry: "科技AI", notes: "回訪：上次看的物件覺得坪數偏小，想再看40坪以上、近綠線的。", staffName: "黃淑芬", date: "2026/06/28 11:05", status: "replied" },
    { name: "任先生", phone: "0925-418-951", industry: "網紅線上培訓", notes: "想盡快安排看/有裝潢佳/預算抓10萬/目前有多間辦公室，想集中成一間，同時設立新公司", staffName: "張偉明", date: "2024/03/26 17:02", status: "new" },
    { name: "莊小姐", phone: "0910-021-663", industry: "科技AI", notes: "本週三下午15:30 綠線區域 10分鐘步行 好停車為主 員工好幾位都有開車 5萬5-6萬 不要低於30坪 zuchuang125", staffName: "黃淑芬", date: "2024/03/26 17:02", status: "new" },
    { name: "陳小姐", phone: "0901-128-686", industry: "純卡拉OK", notes: "這間可以做卡拉OK嗎？ 之前在德惠街，3/15剛頂讓 1人作業無坐檯 屋主同意的話,可以直接電話搜尋加line回覆 H27", staffName: "黃淑芬", date: "2024/03/26 17:02", status: "new" },
    { name: "洪小姐", phone: "0922-254-911", industry: "沒有提供", notes: "問坪數多大？ 目前租約到七月，自己看就好，不喜歡被打擾 有Truecaller  號碼google有多張樂屋網圖片搜尋結果 H08", staffName: "張偉明", date: "2024/03/26 17:02", status: "scheduled" },
    { name: "楊先生", phone: "02-2596-6262", industry: "建設公司", notes: "在哪裡附近？在哪條路上？ W04", staffName: "張偉明", date: "2024/03/26 17:02", status: "new" },
    { name: "曹先生", phone: "0987-002-783", industry: "泰揚不動產", notes: "問店配 客戶是做舞蹈教室，這間可以做舞蹈教室嗎？ H24", staffName: "黃淑芬", date: "2024/03/27 09:09", status: "replied" },
    { name: "李先生", phone: "0989-673-278", industry: "電子模組", notes: "想約3/31下午13:30看 希望條件跟這物件相似 H37", staffName: "林雅婷", date: "2024/03/27 09:09", status: "scheduled" },
    { name: "甯小姐", phone: "0987-676-504", industry: "大師房屋總部", notes: "問店配 客戶想做芭蕾舞蹈教室 H08", staffName: "暫時不指派", date: "2024/03/27 09:09", status: "replied" },
    { name: "蔡先生", phone: "0915-356-990", industry: "電子貿易", notes: "這週日下午14:30 松江南京 長安東路 使用30坪 大概這個價格 H08", staffName: "黃淑芬", date: "2024/03/27 09:09", status: "new" },
    { name: "劉小姐", phone: "0913-333-778", industry: "直銷業", notes: "今晚18:00或是明天可以安排看嗎？ 目前在華視大樓 V34", staffName: "張偉明", date: "2024/03/27 09:09", status: "new" },
    { name: "李小姐", phone: "02-2755-6277", industry: "會計師事務所", notes: "使用坪數是多少？ 7、8月再簽約承租可以嗎？ 目前承租明年2月到期，在大安站附近，預計抓3個月裝潢期 這週都可以安排看，下週出國 ", staffName: "張偉明", date: "2024/03/27 09:09", status: "scheduled" },
    { name: "洪小姐", phone: "02-2775-1520", industry: "精神科診所", notes: "確切的位置在哪裡？ 希望在忠孝復興往敦化方向 使用60-70坪 20萬以下 電梯至少要有2部 目前在忠孝復興站2號出口200號，1", staffName: "黃淑芬", date: "2024/03/27 09:09", status: "new" },
    { name: "蔡先生", phone: "0976-410-764", industry: "健身場館體感娛樂", notes: "土地分區是不是住3？ 確切地址是在哪？ 要確認以上資訊才能預查可否營業登記 然後才申請公司 H25", staffName: "黃淑芬", date: "2024/03/28 10:16", status: "new" },
    { name: "張小姐", phone: "0978-082-066", industry: "才藝補習班", notes: "現在或者中下午可約帶看嗎？ 拓店需求 V28", staffName: "林雅婷", date: "2024/03/28 10:16", status: "scheduled" },
    { name: "張小姐", phone: "0979-687-370", industry: "加盟展行銷", notes: "正確的使用坪數是多少？ 還想問A07 找使用50以上 希望含稅含管15萬內 紅線最遠到信義安和  藍線國管、忠孝復興、新生、敦化 ", staffName: "張偉明", date: "2024/03/28 10:16", status: "replied" },
    { name: "梁小姐", phone: "02-2794-3939", industry: "律師事務所", notes: "想安排4月第一週安排看 條件像這樣的坪數 近捷運站 採光要好 V34 有whocalls顯示Meta Place共享辦公室", staffName: "張偉明", date: "2024/03/29 11:23", status: "new" },
    { name: "陳先生", phone: "02-2380-0944", industry: "國家資訊安全研究院", notes: "實際使用坪數多少？ 有很多院區因都更遷徙 30位員工 70-80坪 六張犁 小南門附近 希望既有裝潢 以能談短租為主 H13", staffName: "黃淑芬", date: "2024/03/29 11:23", status: "new" },
    { name: "王小姐", phone: "0981-840-889 (孫s)", industry: "婚友諮詢", notes: "松山 中山 大安 6萬上下 希望能隔3-4間 希望大廳不要是太舊爛的 週末要能進出 獨立冷氣佳 H08", staffName: "張偉明", date: "2024/03/29 11:23", status: "new" },
    { name: "周先生", phone: "0911-331-547", industry: "廣告行銷", notes: "V代接 明天下午想看 V38", staffName: "林雅婷", date: "2024/03/29 11:23", status: "new" },
    { name: "陳先生", phone: "0955-969-234", industry: "軟體科技業", notes: "現在可以看嗎？ 13:00以前 H37", staffName: "林雅婷", date: "2024/03/30 12:30", status: "new" },
    { name: "陳先生", phone: "0927-825-617", industry: "網路廣告行銷", notes: "今天下午16:00可以看嗎？ V32 H18", staffName: "張偉明", date: "2024/03/30 12:30", status: "new" },
    { name: "王先生", phone: "02-2956-7323 0972-771-478", industry: "天日發展有限公司 批發零售", notes: "隔間有幾間？ 找30坪以上 8-9萬 北車為中心 龍山寺 善導寺 雙連 會有另一個窗口聯絡約帶看時間 H03", staffName: "黃淑芬", date: "2024/03/30 12:30", status: "scheduled" },
    { name: "林小姐", phone: "0983-819-397", industry: "皮拉提斯", notes: "正確地址在哪？ 目前還在嗎？ 使用分區為何？ V38", staffName: "林雅婷", date: "2024/03/30 12:30", status: "new" },
    { name: "余小姐", phone: "02-2732-9386", industry: "電腦資訊", notes: "落地窗陽台坐向？ 使用坪數? 屋齡? 大樓垃圾怎麼收？ 不留手機 直接市話找余小姐 W11", staffName: "張偉明", date: "2024/04/02 11:54", status: "new" },
    { name: "羅先生", phone: "0937-659-378", industry: "生物製藥", notes: "有幾間隔間？ 管理費是多少？ 照片的桌椅在嗎？ 找大安 信義 至少要1-2個隔間 H40", staffName: "黃淑芬", date: "2024/04/02 11:54", status: "new" },
    { name: "陳小姐", phone: "0936-264-858", industry: "中信房屋 內湖店", notes: "問店配 A06", staffName: "暫時不指派", date: "2024/04/02 11:54", status: "replied" },
    { name: "沈先生", phone: "0980-168-188", industry: "業務辦公室", notes: "目前有的公司 85014032、53527427 今天下午可以安排看嗎？ H37", staffName: "張偉明", date: "2024/04/02 11:54", status: "new" },
    { name: "連小姐", phone: "0918-660-112", industry: "藝文產業", notes: "可以安排明天下午16:30看嗎？ 原在中山承租但無法營業登記 H37", staffName: "林雅婷", date: "2024/04/02 11:54", status: "new" },
    { name: "邱先生", phone: "0935-704-242", industry: "通訊科技", notes: "今天下午13:30可以看嗎？ H37", staffName: "林雅婷", date: "2024/04/03 12:01", status: "new" },
    { name: "包先生", phone: "02-7744-5392", industry: "電影製作", notes: "明天下午16:00-16:30可以約看嗎？ V07", staffName: "林雅婷", date: "2024/04/03 12:01", status: "scheduled" },
    { name: "許先生", phone: "02-7749-0838", industry: "住商仁愛光復店", notes: "問店配 A01", staffName: "暫時不指派", date: "2024/04/03 12:01", status: "replied" },
    { name: "許小姐", phone: "0933-029-530", industry: "服飾品牌", notes: "桌椅不要是屋主願意收走的嗎？ 隔間有幾間？ 目前有店面在松江南京 轉網路需要辦公空間 想找慶城街1+2F 中山區 松山區 辦公室5", staffName: "黃淑芬", date: "2024/04/03 12:01", status: "new" },
    { name: "楊先生", phone: "0987-600-567", industry: "多媒體", notes: "重複來電客 當時是簡r來電 下週一下午14:00後可以安排看嗎？ H37", staffName: "林雅婷", date: "2024/04/03 12:01", status: "new" },
    { name: "郭小姐", phone: "02-7710-9550", industry: "金融科技", notes: "明天下午17:30可以看嗎？ V12", staffName: "張偉明", date: "2024/04/03 12:01", status: "new" },
    { name: "王先生", phone: "02-2747-0670", industry: "保險經紀", notes: "地址在哪裡？ 離信義安和站多遠？ 明天10:30之後可以約 A07", staffName: "張偉明", date: "2024/04/03 12:01", status: "new" },
    { name: "賴先生", phone: "0958-139-109", industry: "餐酒館", notes: "等一下可以看嗎？ A10", staffName: "黃淑芬", date: "2024/04/03 12:01", status: "new" },
    { name: "朱小姐", phone: "0980-668-396", industry: "保健調理美妝", notes: "明天中午下午可以看嗎？ 總公司在台中，想再台北找店面 H40", staffName: "林雅婷", date: "2024/04/03 12:01", status: "new" },
    { name: "陳小姐", phone: "02-2721-0315", industry: "酒商", notes: "想安排4/9上午10:00開始看 會找老師一起看希望能看4間 再請提供物件參考 租作辦公室使用，目前承租在安東街即將到期 電話搜尋", staffName: "張偉明", date: "2024/04/04 13:08", status: "new" },
    { name: "陳小姐", phone: "0977-603-907", industry: "自有品牌服飾", notes: "想知道確切地址 在哪個方位？有什麼地標嗎？ 越靠近西門越好 租金可以談嗎？ 想約下週二晚上20:30以後 H21", staffName: "黃淑芬", date: "2024/04/09 09:43", status: "scheduled" },
    { name: "謝先生", phone: "0975-583-818", industry: "有巢氏大安復興店", notes: "問店配 W19", staffName: "張偉明", date: "2024/04/09 09:43", status: "replied" },
    { name: "周先生", phone: "0926-031-499", industry: "運動產業", notes: "明天早上10:00之後可看嗎 大直有承租要到期 W19", staffName: "張偉明", date: "2024/04/09 09:43", status: "new" },
    { name: "陳小姐", phone: "02-6605-7111", industry: "網路媒體行銷、資訊科技", notes: "這週都可以安排看 電話可加line 可否丟一些類似物件提供參考 希望四月終可以租到 來電號有True、Who顯示Step1ne T", staffName: "林雅婷", date: "2024/04/09 09:43", status: "new" },
    { name: "陳小姐", phone: "0970-882-328", industry: "住商不動產 北投店", notes: "問店配 A02", staffName: "黃淑芬", date: "2024/04/10 10:50", status: "replied" },
    { name: "王先生", phone: "0916-708-573", industry: "直銷業", notes: "新家坡商要來臺成立 今天下午可以看嗎？ A09", staffName: "林雅婷", date: "2024/04/10 10:50", status: "new" },
    { name: "陳小姐", phone: "0912-287-186", industry: "專利商標事務所", notes: "實際使用坪數是多少？ 是否如照片現場有隔間，隔間有幾間？ A02", staffName: "張偉明", date: "2024/04/10 10:50", status: "new" },
    { name: "魏先生", phone: "0933-722-875", industry: "牙科診所", notes: "實際使用坪數？ 租金含稅還是不含稅？ 大概在哪裡？ A10", staffName: "張偉明", date: "2024/04/11 11:57", status: "new" },
    { name: "詹先生", phone: "0926-628-058", industry: "台南市東山區農業產銷班", notes: "想約今天看 W19", staffName: "張偉明", date: "2024/04/11 11:57", status: "scheduled" },
    { name: "洪先生", phone: "0916-253-338", industry: "廣告公司", notes: "它還在不在？ V44", staffName: "張偉明", date: "2024/04/11 11:57", status: "new" },
    { name: "杜小姐", phone: "0987-608-523", industry: "建築師事務所", notes: "這間還在不在？ 還會裝修多久？ 有幾個隔間？ 可以登記嗎？ 租約6月到期 急找 V46", staffName: "林雅婷", date: "2024/04/12 12:04", status: "new" },
    { name: "李小姐", phone: "0905-094-421", industry: "藝廊", notes: "今天下午17:30可以看嗎 目前在仁愛路，空間不夠用 V38 號碼有Truecaller/2024/04/30 重複來電 問V07", staffName: "林雅婷", date: "2024/04/12 12:04", status: "replied" },
  ];

  // ── Members ─────────────────────────────────────────────────
  const MEMBERS = [
    { name: 'Aven Hsu', email: 'aven@modtate.com', role: '老闆', company: 'Modtate', joined: '2026/01/01', status: 'active' },
    { name: '林雅婷', email: 'lin@modtate.com', role: '業務/行政', company: 'Modtate', joined: '2026/02/10', status: 'active' },
    { name: '張偉明', email: 'zhang@modtate.com', role: '業務', company: 'Modtate', joined: '2026/02/15', status: 'active' },
    { name: '王小美', email: 'wang@modtate.com', role: '行政', company: 'Modtate', joined: '2026/03/01', status: 'active' },
    { name: '李建宏', email: 'li@modtate.com', role: '行政', company: 'Modtate', joined: '2026/03/20', status: 'active' },
    { name: '黃淑芬', email: 'huang@modtate.com', role: '業務', company: 'Modtate', joined: '2026/04/05', status: 'inactive' },
    { name: '吳宗翰', email: 'wu@modtate.com', role: '行政', company: 'Modtate', joined: '2026/05/10', status: 'active' },
  ];

  // 新增物件 — 表單選項 (verbatim)
  const FORM_OPTIONS = {
    city: ['台北市', '新北市', '桃園市', '台中市', '高雄市'],
    district: ['中山區', '信義區', '大安區', '松山區', '內湖區', '南港區', '大同區', '中正區', '萬華區', '文山區', '北投區', '士林區'],
    propType: ['辦公出租', '整層辦公', '分間辦公', '廠辦', '共享辦公'],
    status: ['招租中', '洽談中', '已收定', '準備簽約', '已簽約出租'],
    areaBasis: ['使用坪數', '權狀坪數'],
    bizReg: ['是', '否', '暫不確定'],
    partition: ['視情況而定', '可', '不可'],
    deposit: ['面議', '1個月', '2個月', '3個月'],
    taxType: ['未稅(個人)', '未稅(公司)', '含稅(個人)', '含稅(公司)'],
    minLease: ['2年', '1年', '6個月', '3個月', '1個月', '無限制'],
    freeRent: ['無', '半個月', '一個月', '兩個月', '其他'],
    decoration: ['尚未裝潢', '簡易裝潢', '高檔裝潢', '豪華裝潢'],
    toilet: ['廁內', '廁外', '衛浴廁', '無廁'],
    acSystem: ['獨立冷氣', '中央空調', '中央空調+獨立冷氣', '無冷氣'],
    parking: ['無車位', '有車位要另租', '租金含車位'],
    storeFacilities: ['客梯', '貨梯', '上水(自來水)', '下水(排污水)', '380V三相電', '排煙管道', '排污管道', '天然瓦斯', '中央空調', '寬頻網路', '獨立衛生間', '停車位', '獨立出入口', '熱水器'],
    facilities: ['寬頻網路', '中央空調', '辦公家具', '保全人員', '免費車位', '員工餐廳', '收發快遞', '訪客接待', '保潔服務', '洽談室', '會議室', '書吧', '休閒區', '多功能廳', '茶水間', '自助售賣機', '電冰箱', '微波爐', '空氣淨化器', 'WIFI覆蓋', '新風系統', '健身設備', '複印/打印'],
    industries: ['不限', '金融保險', '諮詢服務', 'IT科技', '文化傳媒', '教育培訓', '汽車製造', '數碼電子', '貿易零售', '服務類', '醫療化工', '高精產業', '信息通訊', '快消類', '房地產', '遊戲娛樂', '其他'],
    contactIdentity: ['所有權人', '代理人', '總幹事', '員工'],
    honorific: ['先生', '小姐'],
    // 出租店面專屬
    storeType: ['商業街店面', '社區底商', '辦公樓配套', '購物/百貨中心店面', '路邊/臨街門面', '檔口攤位', '交通設施商鋪', '其他'],
    storeBizStatus: ['空置中', '經營中', '出租中'],
    storeTraffic: ['上班族', '學生', '附近居民', '遊客', '其他'],
    storeIndustryCats: {
      '餐飲美食': ['早餐店', '速食店', '自助餐店', '麵店', '小吃店', '餐廳', '吃到飽餐廳', '連鎖快餐店', '烘焙坊', '咖啡館', '冷飲店', '甜品店', '水果食品店', '茶藝館', '涼茶店', '飲酒店'],
      '美容美髮': ['美容院', '美髮院及髮廊', '美甲店', '理髮店', 'SPA店', '化妝品零售業'],
      '服飾鞋包': ['服裝店', '內衣店', '泳裝店', '童裝店', '鞋店', '箱包店', '飾品店'],
      '休閒娛樂': ['網咖', '酒吧', '足浴', '水療', '養生館', '休閒中心', '夜總會', '歌舞廳', 'KTV', '麻將館', '棋牌俱樂部', '桌球俱樂部', '電玩城', '柏青哥店', '夾娃娃機店', '漫畫書屋', '溜冰場', '兒童樂園', '釣魚場', '釣蝦場'],
      '運動健身': ['網球場', '羽毛球館', '保齡球館', '道館', '瑜伽館', '健身房', '游泳俱樂部', '嬰兒游泳中心'],
      '百貨超市': ['便利店', '小賣鋪', '肉品店', '水產店', '乾貨雜貨店', '菸酒茶葉店', '化妝品店', '床上用品', '母嬰用品店', '運動用品店', '玩具店', '文具店', '書店', '樂器店', '音像店', '鐘錶店', '眼鏡店', '工藝品店'],
      '生活服務': ['家電維修', '樂器維修', '乾洗店', '家政中心', '鮮花店', '寵物店', '水族館', '彩票店', '報刊亭', '送水送氣點', '職介所', '婚介所', '照相館', '婚紗攝影店', '打印複印', '美鞋修鞋店', '病媒防治服務'],
      '電器通訊': ['手機店', '電腦店', '電器店', '維修店', '通訊用品店'],
      '汽修美容': ['汽修廠', '機車維修店', '汽配店', '輪胎店', '洗車店', '汽車美容店', '汽車租賃店', '車場'],
      '醫療器械': ['醫院', '診所', '居家護理所', '月子中心', '藥店', '保健品店', '情趣用品店'],
      '家具建材': ['家電設備店', '五金店', '建材店', '家具店', '燈飾店', '家居飾品店', '裝飾裝修材料店'],
      '教育培訓': ['幼兒園', '培訓機構', '補習班', '家教中心', '早教中心', '留學代辦機構'],
      '酒店賓館': ['旅店', '民宿', '賓館酒店', '招待所', '公寓房'],
      '其他': ['其他'],
    },
    bannedIndustries: ['無', '油煙餐飲業（輕食可）', '八大行業', '夾娃娃機', '寵物店', '洗車業', '遊藝場', '宗教團體', '其他'],
  };

  // 編輯物件 — 下拉選項
  const EDIT_OPTIONS = {
    type: ['整層辦公', '分間辦公', '共享辦公', '廠辦', '一樓店面', '店面', '樓店'],
    status: [['listing', '招租中'], ['negotiating', '洽談中'], ['deposited', '已收定'], ['preparing', '準備簽約'], ['signed', '已簽約出租']],
    tax: ['未稅', '含稅'],
    ac: ['獨立冷氣', '中央空調', '無'],
    parking: ['無車位', '含車位', '有車位另租'],
  };

  const STATUS_LABELS = {
    prop: { listing: '招租中', negotiating: '洽談中', deposited: '已收定', preparing: '準備簽約', signed: '已簽約出租' },
    inq: { new: '新詢問', replied: '已回覆', deal: '已成交', closed: '已關閉' },
    tenant: { new: '新來電', scheduled: '已約看', replied: '已回覆', deal: '已成交' },
    member: { active: '啟用', inactive: '停用' },
  };

  const ALL_ROLES = ['老闆', '業務', '行政', '業務/行政'];
  function seedNotifs() {
    return [
      { id: 'seed-1', kind: 'property', text: '張偉明 新增了物件「建業大廈」', time: '2024/04/03 11:20', read: false, forRoles: ALL_ROLES, propId: 'A15' },
      { id: 'seed-2', kind: 'remark', text: '王小美 在「站前運通」新增了備註', time: '2024/04/02 16:48', read: false, forRoles: ['老闆'], propId: 'A01' },
      { id: 'seed-3', kind: 'property', text: '林雅婷 新增了物件「南京三民角間店面」', time: '2024/04/01 09:32', read: true, forRoles: ALL_ROLES, propId: 'B06' },
    ];
  }

  function hashId(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function photosFor(p) {
    const pool = STORE_TYPES.includes(p.type) ? STORE_PHOTOS : OFFICE_PHOTOS;
    const base = hashId(p.id);
    const n = 6 + (base % 3); // 6–8 photos
    return Array.from({ length: n }, (_, k) => res(pool[(base + k) % pool.length]));
  }

  // seeded internal remark thread (author + timestamp + text), deterministic per property
  const REMARK_TEMPLATES = [
    '屋主希望承租方為公司登記用途，個人戶需先確認。',
    '租金有小幅議價空間，可談約 3–5%，押金維持兩個月。',
    '現場鑰匙在管理室，帶看請提前一天預約。',
    '屋主同意可隔間，但需復原；裝潢期約一個月免租。',
    '頂樓有自來水加壓馬達，水壓正常；冷氣為新機。',
    '同棟另有空層，若坪數不符可一併介紹。',
    '客戶反映採光佳、格局方正，回報意願高。',
    '管理費含公共區清潔與保全，水電另計，請向客戶說明。',
    '已預約 3/20 下午兩點帶看，客戶為科技業約 15 人團隊。',
    '電梯整修至月底，帶看暫走後棟貨梯，已知會管理員。',
    '屋主出國至下週三，急件請改聯絡代理人黃先生。',
    '本案照片已更新，請確認封面為大廳實景非示意圖。',
  ];
  function remarksFor(p) {
    const base = hashId(p.id + 'r');
    const authors = ['Aven Hsu', STAFF_MAP[p.staff] || '林雅婷', '王小美'];
    const n = 4 + (base % 3); // 4–6 entries
    const day0 = 14 + (base % 10);
    return Array.from({ length: n }, (_, k) => {
      const d = day0 + k * 2;
      const hh = String(9 + ((base + k * 7) % 8)).padStart(2, '0');
      const mm = String((base + k * 13) % 60).padStart(2, '0');
      const entry = {
        author: authors[(base + k) % authors.length],
        time: `2024/03/${String(d).padStart(2, '0')} ${hh}:${mm}`,
        text: REMARK_TEMPLATES[(base + k * 3) % REMARK_TEMPLATES.length],
      };
      // give the first remark a demo reply thread
      if (k === 0) {
        entry.replies = [
          { author: authors[1], time: `2024/03/${String(d).padStart(2, '0')} ${hh}:${String((base + 20) % 60).padStart(2, '0')}`, text: '收到，我今天下午回覆屋主確認。' },
          { author: 'Aven Hsu', time: `2024/03/${String(d + 1).padStart(2, '0')} 10:15`, text: '好，確認後把結果貼在這串，謝謝。' },
        ];
      }
      return entry;
    });
  }

  // 產權文件（使用分區/使用執照/地籍圖）— 內部限定，deterministic seed per property
  const DOC_CATS = ['使用分區', '使用執照', '地籍圖', '平面圖', '其他'];
  const DOC_UPLOADERS = [{ name: '林雅婷', role: '行政' }, { name: '陳建宏', role: '業務' }, { name: 'Aven Hsu', role: '業務/行政' }, { name: '王小美', role: '行政' }];
  function docsFor(p) {
    const base = hashId(p.id + 'doc');
    const out = [];
    const mk = (cat, k, ext) => {
      const u = DOC_UPLOADERS[(base + k) % DOC_UPLOADERS.length];
      out.push({ id: p.id + '-doc-' + out.length, cat, ext, name: p.id + '_' + cat + '.' + ext, uploader: u.name, uploaderRole: u.role, time: `2024/03/${String(10 + ((base + k * 3) % 18)).padStart(2, '0')} ${String(9 + ((base + k) % 8)).padStart(2, '0')}:${String((base + k * 17) % 60).padStart(2, '0')}`, sizeKB: 180 + ((base + k * 97) % 2600), demo: true });
    };
    if (base % 4 !== 0) mk('使用分區', 1, (base % 2) ? 'pdf' : 'png');
    if (base % 3 !== 0) mk('使用執照', 2, 'pdf');
    if (base % 5 !== 1) mk('地籍圖', 3, (base % 3) ? 'pdf' : 'png');
    return out;
  }


  // 台北捷運路線與站點（供「最近捷運站」選擇）
  const MRT_LINES = {
    '板南線（藍線）': ['頂埔', '永寧', '土城', '海山', '亞東醫院', '府中', '板橋', '新埔', '江子翠', '龍山寺', '西門', '台北車站', '善導寺', '忠孝新生', '忠孝復興', '忠孝敦化', '國父紀念館', '市政府', '永春', '後山埤', '昆陽', '南港', '南港展覽館'],
    '淡水信義線（紅線）': ['淡水', '紅樹林', '竹圍', '關渡', '忠義', '復興崗', '北投', '新北投', '奇岩', '唭哩岸', '石牌', '明德', '芝山', '士林', '劍潭', '圓山', '民權西路', '雙連', '中山', '台北車站', '台大醫院', '中正紀念堂', '東門', '大安森林公園', '大安', '信義安和', '台北101/世貿', '象山'],
    '中和新蘆線（橘線）': ['南勢角', '景安', '永安市場', '頂溪', '古亭', '東門', '忠孝新生', '松江南京', '行天宮', '中山國小', '民權西路', '大橋頭', '台北橋', '菜寮', '三重', '先嗇宮', '頭前庄', '新莊', '輔大', '丹鳳', '迴龍', '三重國小', '三和國中', '徐匯中學', '三民高中', '蘆洲'],
    '松山新店線（綠線）': ['新店', '新店區公所', '七張', '小碧潭', '大坪林', '景美', '萬隆', '公館', '台電大樓', '古亭', '中正紀念堂', '小南門', '西門', '北門', '中山', '松江南京', '南京復興', '台北小巨蛋', '南京三民', '松山'],
    '文湖線（棕線）': ['動物園', '木柵', '萬芳社區', '萬芳醫院', '辛亥', '麟光', '六張犁', '科技大樓', '大安', '忠孝復興', '南京復興', '中山國中', '松山機場', '大直', '劍南路', '西湖', '港墘', '文德', '內湖', '大湖公園', '葫洲', '東湖', '南港軟體園區', '南港展覽館'],
    '環狀線（黃線）': ['大坪林', '十四張', '秀朗橋', '景平', '景安', '中和', '橋和', '中原', '板新', '板橋', '新埔民生', '頭前庄', '幸福', '新北產業園區'],
  };

  window.MTA = {
    MRT_LINES,
    ROLE_CONFIG, MY_STAFF_CODES, STAFF_MAP, STORE_TYPES,
    FILTERS, RENT_RANGES, AREA_RANGES, FLOOR_RANGES,
    PROPERTIES, INQUIRIES, TENANTS, MEMBERS,
    FORM_OPTIONS, EDIT_OPTIONS, STATUS_LABELS,
    photosFor, remarksFor, seedNotifs, hashId,
    DOC_CATS, docsFor,
    staffName: (code) => STAFF_MAP[code] || code || '—',
    fmt: (n) => Number(n).toLocaleString('zh-TW'),
  };
})();
