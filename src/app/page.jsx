// app/page.jsx
import styles from "./homepage.module.css";
import Featured from "@/components/featured/Featured";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";
import { SITE_URL } from "@/utils/seo";

export const metadata = {
  title: "Legend of Mushroom - Wiki",
  description: "Your ultimate guide to the Legend of Mushroom game",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    title: "Legend of Mushroom - Wiki",
    description: "Your ultimate guide to the Legend of Mushroom game",
  },
  twitter: {
    card: "summary",
    title: "Legend of Mushroom - Wiki",
    description: "Your ultimate guide to the Legend of Mushroom game",
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
