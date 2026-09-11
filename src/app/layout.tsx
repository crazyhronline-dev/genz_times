import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminBar from "@/components/AdminBar";
import { SITE_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "GenZ Time | Next-Gen Tech Gadgets, Hardware Reviews & Benchmarks",
    template: "%s | GenZ Time",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Tech Gadgets",
    "Hardware Reviews",
    "GenZ Time",
    "Smartphones 2026",
    "Spatial Computing",
    "Vision Pro 2",
    "Laptops Benchmarks",
    "Noise Cancelling Headphones",
    "Consumer Tech News",
    "Gadget Specs",
  ],
  authors: [{ name: SITE_CONFIG.author, url: `${SITE_CONFIG.url}/about` }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "GenZ Time - The Future of Consumer Hardware & Gadgets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
    creator: SITE_CONFIG.twitterHandle,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "GenZ Time",
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    sameAs: [
      "https://twitter.com",
      "https://youtube.com",
      "https://linkedin.com",
    ],
    publishingPrinciples: `${SITE_CONFIG.url}/editorial-disclosure`,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GenZ Time",
    url: SITE_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Search Engine Organization & WebSite Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-tech-950 text-slate-100 min-h-screen flex flex-col tech-grid-bg selection:bg-tech-cyan selection:text-tech-950">
        <AdminBar />
        <Navbar />
        <main className="flex-1 tech-radial-glow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
