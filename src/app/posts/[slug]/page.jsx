import Menu from "@/components/Menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import SetSection from "@/components/setSection/SetSection";
import CardList from "@/components/cardList/CardList";
import "../../styles/colStyles.css"; // Import custom table styles
import "../../styles/tableStyles.css"; // Import custom table styles

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getData = async (slug) => {
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

const SinglePage = async ({ params }) => {
  const { slug } = params;

  const data = await getData(slug);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data?.title}</h1>
          <div className={styles.user}>
            {data?.user?.image && (
              <div className={styles.userImageContainer}>
                <Image
                  src={data.user.image}
                  alt=""
                  fill
                  className={styles.avatar}
                />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{data?.user.name}</span>
              <span className={styles.date}>01.01.2024</span>
            </div>
          </div>
        </div>
        {data?.imgBig && (
          <div className={styles.imageContainer}>
            <Image src={`/images/${data.imgBig}`} alt="" width={300} height={400} className={styles.image} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        {data?.sections?.map((section, index) => (
          <div key={index} className={styles.section}>
            <div className={styles.sectionHeader}>
              {section.icon && (
                <Image
                  src={section.icon}
                  alt=""
                  width={32}
                  height={32}
                  className={styles.sectionIcon}
                />
              )}
              <h2>{section.title}</h2>
            </div>
			{section.type === 'set' && section.sets.length > 0 ? (
              section.sets.map((set, setIndex) => (
                <SetSection
                  key={setIndex}
                  id={set.id}
                  title={set.title}
                  standardImage={set.standardImage}
                  opponentImage={set.opponentImage}
                  opponentSpells={set.opponentSpells}
                  explanation={set.explanation}
                  timings={set.timings}
                  alternatives={set.alternatives}
                  palsImage={set.palsImage}
                  palsAlternatives={set.palsAlternatives}
                  relicsImage={set.relicsImage}
                  relicsAlternatives={set.relicsAlternatives}
				  talentImage={set.talentImage}
                  talents={set.talents}
                  mounts={set.mounts}
                  artifacts={set.artifacts}
                  accessories={set.accessories}
                  avians={set.avians}
                />
              ))
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
          </div>
          // </div>
        ))}
        <div className={styles.comment}>
          <Comments postSlug={slug} />
        </div>
		<div className={styles.bottomContent}>
			<CardList page={1}/>
	        <Menu />
		</div>
      </div>
    </div>
  );
};

export default SinglePage;
