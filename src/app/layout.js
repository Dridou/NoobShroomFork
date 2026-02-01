import Navbar from "@/components/layout/navbar/Navbar";
import "@/styles/colors.css";
import "./globals.css";
import { Poppins } from "next/font/google";
import Footer from "@/components/layout/footer/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics/GoogleAnalytics";
import { ThemeContextProvider } from "@/context/ThemeContext";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";
import Script from "next/script";
import {
  ADSENSE_PUBLISHER_ID,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/utils/seo";

const poppins = Poppins({ weight: ['100','200','300','400','500','600','700'],subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : SITE_URL
  ),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  other: {
    "google-adsense-account": ADSENSE_PUBLISHER_ID,
  },
};

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/noobshroom-full-logo.png`,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };

  return (
    <html lang="en">
      <body className={poppins.className}>
        <GoogleAnalytics />
        <Script
          id="quge5-tag"
          src="https://quge5.com/88/tag.min.js"
          data-zone="207550"
          data-cfasync="false"
          async
          strategy="beforeInteractive"
        />
        <Script
          id="adsense-script"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <AuthProvider>
          <ThemeContextProvider>
            <ThemeProvider>
              <div className="container">
                <Script
                  id="org-jsonld"
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationJsonLd),
                  }}
                />
                <Script
                  id="website-jsonld"
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteJsonLd),
                  }}
                />
                <Navbar />
                <div className="wrapper">
                  {children}
                </div>
                <Footer />
              </div>
            </ThemeProvider>
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
