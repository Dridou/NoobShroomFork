import { SITE_URL } from "@/utils/seo";

export const metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
};

export default function LoginLayout({ children }) {
  return children;
}
