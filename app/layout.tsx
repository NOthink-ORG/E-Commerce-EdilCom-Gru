import type { Metadata } from "next";
import type { CSSProperties } from "react";
import localFont from "next/font/local";
import { site } from "@/lib/site-config";
import { assetPath } from "@/lib/site-path";
import { pageMetadata } from "@/lib/seo";
import { StoreProvider } from "@/components/store-provider";
import { Header, Footer } from "@/components/shell";
import "./globals.css";
const inter = localFont({
  src: "../public/fonts/inter-latin-variable.woff2",
  variable: "--font-inter",
  display: "swap",
});
export const metadata: Metadata = {
  ...pageMetadata(
    "Edilcom Gru — Ricambi per gru e sollevamento",
    "Esplora il catalogo dimostrativo Edilcom Gru: ricambi per gru, radiocomandi, funi, motori e assistenza tecnica.",
    undefined,
  ),
  metadataBase: site.siteUrl ? new URL(site.siteUrl) : null,
  title: {
    default: "Edilcom Gru — Ricambi per gru e sollevamento",
    template: "%s | Edilcom Gru",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="it"
      data-scroll-behavior="smooth"
      className={inter.variable}
      style={
        {
          "--hero-image": `url("${assetPath("/images/hero-positano.webp")}")`,
          "--support-image": `url("${assetPath("/images/support.webp")}")`,
        } as CSSProperties
      }
    >
      <body>
        <StoreProvider>
          <a className="skip-link" href="#contenuto">
            Vai al contenuto
          </a>
          <Header />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
