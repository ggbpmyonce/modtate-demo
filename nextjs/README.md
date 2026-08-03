# Modtate Admin — Next.js

Modtate 商辦租賃平台後台管理系統，已包裝為可在本機執行的 **Next.js (App Router)** 專案。

## 快速開始

```bash
npm install
npm run dev
```

開啟 http://localhost:3000 即可看到系統。示範登入帳號（密碼一律 `modtate`）：

| 角色 | Email |
|------|-------|
| 老闆 | aven@modtate.com |
| 業務 | wu@modtate.com |
| 行政 | wang@modtate.com |

或走「系統初始化」流程建立第一位老闆帳號。

## 專案結構

```
app/
  layout.jsx      根 layout，載入 globals.css（設計系統 tokens）
  page.jsx        進入點，載入元件模組並掛載到 #root
  globals.css     設計系統 token @import + RWD / 動畫
public/
  _ds/…           Modtate 設計系統（tokens、styles.css、元件 bundle）
  app/            UI 元件模組（Sidebar、Properties、Tenants…）與假資料 data.js、logo、浮水印
next.config.mjs
package.json
```

## 目前的載入方式

為求快速搬遷，`app/page.jsx` 沿用原型的做法：以 React/ReactDOM (UMD) + Babel Standalone 在瀏覽器即時編譯 `public/app/*.jsx`，這些模組會註冊到 `window.MTA*` 全域，最後由 `App.jsx` 掛載到 `#root`。**功能與原型完全一致。**

## 建議的下一步（正式化為 Next.js 慣例）

`public/app/*.jsx` 每個檔案都是 IIFE，讀取 `window.React`、輸出 `window.MTA*`。要改為正規 ES 模組：

1. 每個檔改為 `import React from 'react'` + `export function Sidebar() {…}`，移除 window bridge。
2. `React.createElement(...)` 可保留，或改寫為 JSX（非必要，現況即可運作）。
3. 設計系統改以正式套件 build 匯入，取代 `window.ModtateDesignSystem_410f4d`。
4. 移除 `page.jsx` 的 Script 載入器，直接 `import App` 並 render。

元件邏輯無需改動，只需更換模組接線方式。

## 重要說明

- **純前端原型**：無後端／資料庫，資料存於記憶體，重新整理即重置。要正式上線需接資料庫與 API。
- **資料層**：所有假資料集中在 `public/app/data.js`（物件、來電紀錄、使用者、篩選選項）。
- **設計系統**：`public/_ds` 為綁定的 Modtate 設計系統，勿手動改動 token 值。
