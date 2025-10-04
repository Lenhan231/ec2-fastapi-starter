import type { Metadata } from "next";
import "./globals.css";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export const metadata: Metadata = {
  title: "Easy Body",
  description: "Khám phá phòng gym và PT uy tín, quản lý ưu đãi thông minh."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main className="container">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
