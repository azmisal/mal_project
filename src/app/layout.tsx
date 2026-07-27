import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mal | Fast, Fair Personal Loans in Pakistan — Join the Waitlist",
  description:
    "Mal is bringing instant, transparent personal loans to Pakistan. Join the waitlist to get early access, launch-day rates, and no hidden fees.",
  keywords: ["Mal", "loans Pakistan", "personal loan app Pakistan", "digital lending Pakistan", "waitlist"],
  openGraph: {
    title: "Mal | Fast, Fair Personal Loans in Pakistan",
    description: "Join the waitlist for early access to Mal — instant, transparent personal loans built for Pakistan.",
    url: siteUrl,
    siteName: "Mal",
    locale: "en_PK",
    type: "website",
  },
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Mal Pakistan Waitlist",
  url: siteUrl,
  description: "Join the waitlist for Mal, a lending product launching in Pakistan offering instant, transparent personal loans.",
  isPartOf: { "@type": "Organization", name: "Mal", url: siteUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}