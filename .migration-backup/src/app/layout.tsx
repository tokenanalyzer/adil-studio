import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adil Studio",
  description: "Adaptive Digital Studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
