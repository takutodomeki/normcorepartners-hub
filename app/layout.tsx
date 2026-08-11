import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://normcorepartners.net"),
  title: {
    default: "Normcore Partners",
    template: "%s — Normcore Partners",
  },
  description: "Normcore Partners is a political startup.",
};

export const viewport: Viewport = {
  themeColor: "#f0f7ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* .page holds the true, unstretched gutters. */}
        <div className="page">
          {/* .stretch scales its contents horizontally by 15%. Never nest. */}
          <div className="stretch">{children}</div>
        </div>
      </body>
    </html>
  );
}
