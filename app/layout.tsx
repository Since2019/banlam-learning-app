import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "咱来讲｜闽南话闯关学习";
const description = "用关卡、复习和文白读对照，每天学会几句真正用得上的闽南话。";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const imageUrl = `${origin}/og.png`;

  return {
    title,
    description,
    openGraph: { title, description, url: origin, siteName: "咱来讲", locale: "zh_CN", type: "website", images: [{ url: imageUrl, width: 1707, height: 907, alt: "咱来讲闽南话学习课程" }] },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
