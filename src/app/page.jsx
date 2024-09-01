// app/page.jsx
import Link from "next/link";
import styles from "./homepage.module.css";
import Featured from "@/components/featured/Featured";
import CategoryList from "@/components/categoryList/CategoryList";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";

const getBaseUrl = () => {
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.noobshroom.com";
  } else if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  } else {
    return "http://localhost:3000";
  }
};

export default function Home({ searchParams }) {
	const page = parseInt(searchParams.page) || 1;

	return (
	  <div className={styles.container}>
		<Featured />
		<CategoryList />
		<div className={styles.content}>
		  <CardList page={page}/>
		  <Menu />
		</div>
	  </div>
	);
}