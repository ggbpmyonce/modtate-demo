import './globals.css';

export const metadata = {
  title: 'Modtate Admin — 商辦租賃後台',
  description: 'Modtate 商辦租賃平台後台管理系統',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
