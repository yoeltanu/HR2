import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Assessment Platform",
  description: "DISC Personality Test + Cognitive Ability Screening untuk HR internal."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
