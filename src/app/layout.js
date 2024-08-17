import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/footer/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import { ThemeContextProvider } from "@/context/ThemeContext";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Legend of Mushrooms - Wiki",
  description: "Your ultimate guide to the Legend of Mushrooms game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body className={inter.className}>
        <AuthProvider>
          <ThemeContextProvider>
            <ThemeProvider>
              <div className="container">
                <div className="wrapper">
                  <Navbar />
                  {children}
				  <Analytics />
                  <Footer />
                </div>
              </div>
            </ThemeProvider>
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
