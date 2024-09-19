import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Poppins  } from "next/font/google";
import Footer from "@/components/footer/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import { ThemeContextProvider } from "@/context/ThemeContext";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";

const poppins = Poppins({ weight: ['100','200','300','400','500','600','700'],subsets: ["latin"] });

export const metadata = {
  title: "Legend of Mushroom - Wiki",
  description: "Your ultimate guide to the Legend of Mushroom game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body className={poppins.className}>
        <AuthProvider>
          <ThemeContextProvider>
            <ThemeProvider>
              <div className="container">

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
