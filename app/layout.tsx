import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Wheelo.fit - Premium Cycling Experiences & Midnight Rides in Mumbai",
  description: "Join Wheelo.fit for high-octane cycling classes, midnight rides in Mumbai, scenic Sunday morning rides, and premium cycle rentals. Book your cycling experience today.",
  keywords: ["cycling in mumbai", "midnight cycling", "cycle rentals", "cycling classes", "sunday morning rides", "wheelo.fit", "mumbai cycling community", "cycle tours"],
  authors: [{ name: "Wheelo.fit" }],
  creator: "Wheelo.fit",
  publisher: "Wheelo.fit",
  metadataBase: new URL("https://www.wheelofit.in"),
  openGraph: {
    title: "Wheelo.fit - Premium Cycling Experiences in Mumbai",
    description: "Join Wheelo.fit for high-octane cycling classes, midnight rides, scenic Sunday morning rides, and premium cycle rentals.",
    url: "https://www.wheelofit.in",
    siteName: "Wheelo.fit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Wheelo.fit Premium Cycling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wheelo.fit - Premium Cycling Experiences in Mumbai",
    description: "Join Wheelo.fit for high-octane cycling classes, midnight rides, and premium cycle rentals.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "/",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Wheelo.fit",
    "url": "https://www.wheelofit.in",
    "logo": "https://www.wheelofit.in/logo.png",
    "sameAs": [
      "https://instagram.com/wheelo.fit"
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={outfit.className}>
        {children}
      </body>
    </html>
  );
}
