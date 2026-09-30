import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://cavistore.pe";

export const metadata: Metadata = {
  title: {
    default: "CAVI STORE — Equípate para ir más lejos",
    template: "%s · CAVI STORE",
  },
  description:
    "Tienda de performance deportivo: running, natación, triatlón y endurance. Nutrición, equipamiento de élite y envíos a todo el Perú.",
  metadataBase: new URL(SITE_URL),
  applicationName: "CAVI STORE",
  keywords: [
    "running Perú",
    "nutrición deportiva",
    "trail",
    "triatlón",
    "natación",
    "ciclismo",
    "geles energéticos",
    "electrolitos",
    "Arequipa",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "CAVI STORE — Equípate para ir más lejos",
    description:
      "Nutrición y equipamiento técnico de endurance para atletas que entrenan con objetivos. Envíos a todo el Perú.",
    url: SITE_URL,
    siteName: "CAVI STORE",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAVI STORE — Equípate para ir más lejos",
    description:
      "Nutrición y equipamiento técnico de endurance. Envíos a todo el Perú.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "CAVI STORE",
    description:
      "Nutrición y equipamiento técnico de endurance: running, natación, triatlón y ciclismo.",
    url: SITE_URL,
    areaServed: "PE",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Arequipa",
      addressCountry: "PE",
    },
  };

  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
