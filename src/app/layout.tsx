import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminBar from "@/components/AdminBar";
import { SITE_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "GenZ Time | Gen Z Tech Reviews, Hands-On Benchmarks & Next-Gen Gadgets",
    template: "%s | GenZ Time",
  },
  description: "GenZ Time is the authoritative Gen Z tech publication for real hands-on gadget reviews, smartphone benchmarks, AI hardware deep-dives, and laptop buying guides tested by Sahil.",
  keywords: [
    "GenZ Time",
    "Gen Z Time",
    "GenZ tech reviews",
    "Gen Z gadget reviews",
    "Gen Z tech blog",
    "GenZ smartphone benchmarks",
    "Gen Z tech trends 2026",
    "best laptops for Gen Z",
    "honest gadget reviews",
    "Sahil tech reviews",
    "Sahil GenZ Time",
    "AI gadgets for Gen Z",
    "gaming handheld benchmarks",
    "wireless earbuds test",
    "foldable phone review",
    "spatial computing review",
    "VR headset Gen Z",
    "smart home gadgets",
    "drone camera review",
    "independent hardware lab",
    "consumer electronics benchmark"
  ],
  authors: [{ name: SITE_CONFIG.author, url: `${SITE_CONFIG.url}/about` }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
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
  verification: {
    google: "google-site-verification-genztime",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: "GenZ Time | Gen Z Tech Reviews, Hands-On Benchmarks & Next-Gen Gadgets",
    description: "The authoritative Gen Z tech publication. Real hands-on smartphone reviews, laptop benchmarks, AI gadget deep-dives, and gaming hardware guides tested by Sahil.",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "GenZ Time - Independent Hands-On Gen Z Tech & Gadget Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GenZ Time | Gen Z Tech Reviews & Hardware Benchmarks",
    description: "Hands-on gadget reviews, smartphone benchmarks, AI gear, and laptop tests for Gen Z. Real lab data tested by Sahil.",
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
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: "GenZ Time",
    alternateName: ["Gen Z Time", "GenZ Tech", "GenZ Reviews"],
    url: SITE_CONFIG.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_CONFIG.url}/logo.png`,
      width: 512,
      height: 512,
    },
    founder: {
      "@type": "Person",
      name: "Sahil",
      jobTitle: "Founder & Lead Hardware Editor",
      url: `${SITE_CONFIG.url}/about`,
    },
    sameAs: [
      "https://twitter.com/GenZTimeTech",
      "https://youtube.com",
      "https://linkedin.com",
    ],
    publishingPrinciples: `${SITE_CONFIG.url}/editorial-disclosure`,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    name: "GenZ Time",
    alternateName: "Gen Z Tech & Gadget Reviews",
    url: SITE_CONFIG.url,
    publisher: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
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
