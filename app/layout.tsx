import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumen — Spring '27 Release",
  description:
    "Lumen is a fictional AI creative suite for design teams. The Spring '27 release brings twelve new tools, from relighting images to shipping components straight to code.",
};

export const viewport: Viewport = {
  themeColor: "#0B0D1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        />
      </head>
      <body>
        <noscript>
          <style>{`.loader{display:none}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
