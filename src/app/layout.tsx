import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "화장품 원료성분 검색",
  description:
    "한국 데이터 포털의 원료성분 정보 검색 서비스입니다. 원료성분의 한글명, 영문명, CAS 번호, 원료 설명, 동의어 등을 검색할 수 있습니다.",
  keywords:
    "원료성분, 성분검색, CAS번호, 화장품원료, 식품원료, 의약품원료, 데이터포털",
  authors: [{ name: "한국 데이터 포털" }],
  openGraph: {
    title: "원료성분 정보 검색 | 한국 데이터 포털",
    description:
      "한국 데이터 포털의 원료성분 정보 검색 서비스입니다. 원료성분의 한글명, 영문명, CAS 번호, 원료 설명, 동의어 등을 검색할 수 있습니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
