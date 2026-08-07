import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "厝边 · 闽南语学习",
  description: "每天十分钟，从生活里的第一句闽南语开始。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
