import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";

const getPost = async (slug) => {
	// Utiliser Prisma pour récupérer les données du post avec les sections et les sets associés
	const post = await prisma.post.findUnique({
	  where: { slug: slug },
	  include: {
		user: true,
		sections: {
		  include: {
			sets: true,
		  },
		  orderBy: {
			displayOrder: 'asc',  // Order sections by the 'order' field in ascending order
		  },
		},
	  },
	});

	if (!post) {
	  throw new Error("Post not found");
	}

	return post;
  };

const Featured = async () => {
	const post = await getPost("prophet-preblitz-class-guide");
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Your ultimate Legend of Mushrooms reference</b>
      </h1>
      <h2 className={styles.subtitle}>
        Most in-depth guides by the most experienced players.
      </h2>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image src="/p1.jpeg" alt="" fill className={styles.image} />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>
            <b>{post?.title}</b>
          </h1>
          <p className={styles.postDesc}>
            Discover all the knowledge acumulated by the best Prophet players, avoid mistakes and learn from the best how to play your pre-blitz Prophet !
          </p>
          <button className={styles.button}><a href="http://localhost:3000/posts/prophet-preblitz-class-guide">Read more</a></button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
