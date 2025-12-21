// app/page.jsx
import styles from "./homepage.module.css";
import Featured from "@/components/featured/Featured";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from "@/utils/seo";

export const metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function Home({ searchParams }) {
	const page = parseInt(searchParams.page) || 1;

	return (
	  <div className={styles.container}>
		<Featured />
		<div className={styles.content}>
		  <CardList page={page}/>
		  <Menu />
		</div>
	  </div>
	);
}
