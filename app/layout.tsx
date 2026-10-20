import type { Metadata } from "next";
import { StoreProvider } from "@/components/store-provider";
import { Header, Footer } from "@/components/shell";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Edilcom Gru — Ricambi per gru e sollevamento",
    template: "%s | Edilcom Gru",
  },
  description:
    "Esplora il catalogo dimostrativo Edilcom Gru: ricambi per gru, radiocomandi, funi, motori e assistenza tecnica.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" data-scroll-behavior="smooth">
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
