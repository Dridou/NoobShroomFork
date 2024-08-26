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

async function getInitialPosts() {
	const res = await fetch(`${getBaseUrl()}/api/posts`, {
	  next: { revalidate: 60 }, // ISR: Revalider toutes les 60 secondes
	});
	if (!res.ok) {
	  console.error("Failed to fetch initial posts");
	  return [];
	}

	const { posts } = await res.json();
	return posts;
  }

export default async function Home({}) {
  const initialPosts = await getInitialPosts(); // Récupérer les posts initiaux

  return (
    <div className={styles.container}>
      <Featured />
      <CategoryList />
      <div className={styles.content}>
        {/* Passez les posts initiaux au composant client */}
        <CardList initialPosts={initialPosts} />
        <Menu />
      </div>
    </div>
  );
}
