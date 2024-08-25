import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import styles from "./singlePage.module.css";
import SetSection from "@/components/setSection/SetSection";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";
import Link from "next/link";
import Comments from "@/components/comments/Comments";
import "../../styles/colStyles.css"; // Import custom table styles
import "../../styles/tableStyles.css"; // Import custom table styles

const prisma = new PrismaClient();

const getBaseUrl = () => {
	if (process.env.VERCEL_ENV === "production") {
	  return "https://www.noobshroom.com";
	} else if (process.env.VERCEL_ENV === "preview") {
	  return `https://${process.env.VERCEL_URL}`;
	} else {
	  return "http://localhost:3000";
	}
  };

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist.",
    };
  }

  return {
    title: post.title,
    description: post.desc || "Read this amazing post on our blog.",
    openGraph: {
      title: post.title,
      description: post.desc || "Read this amazing post on our blog.",
      images: [
        {
          url: post.imgBig || "/default-image.png",
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: {
      slug: true,
    },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getData(slug) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      user: true,
      sections: {
        include: {
          sets: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}

async function getUpdates() {
  const updates = await prisma.update.findMany({
    include: {
      post: true,
      section: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!updates) {
    throw new Error("Updates not found");
  }

  return updates;
}

export default async function SinglePage({ params }) {
  const { slug } = params;

  try {
    const post = await getData(slug);
    let sectionsContent = null;
    if (post.slug === "updates") {
      const updates = await getUpdates();
      sectionsContent = updates.map((update) => (
        <div key={update.id} className={styles.update}>
          <div className={styles.updateHeader}>
            <h2>{update.title}</h2>
            <span>
              {update.post && update.section ? (
                <div className={styles.references}>
                  <span className={styles.postReference}>{update.post.title}</span>
                  <span className={styles.arrow}>→</span>
                  <span className={styles.sectionReference}>
                    {update.section.title}
                  </span>
                </div>
              ) : (
                <div className={styles.references}><span className={styles.noReference}>General</span></div>
              )}
            </span>
          </div>
          <p>{update.content}</p>
		  {update.post && update.section ? (
		  <Link
          href={`${getBaseUrl()}/posts/${update.post?.slug}/#section-${update.sectionId}`}
        >
          <span>→ See <u>{update.post?.title}/{update.section?.title}</u> updated section</span>
        </Link>) : null}
        </div>
      ));
      // sectionsContent = "coucou"
    } else {
      // Préparer le contenu de chaque section avant le return principal
      sectionsContent = post.sections.map((section) => {
        if (section.type === "set" && section.sets.length > 0) {
          return (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className={styles.section}
            >
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
              {section.sets.map((set, setIndex) => (
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
              ))}
            </div>
          );
        } else {
          return (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className={styles.section}
            >
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
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          );
        }
      });
    }

    // Le return principal retourne le contenu préparé
    return (
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>{post?.title}</h1>
            <div className={styles.user}>
              {post?.user?.image && (
                <div className={styles.userImageContainer}>
                  <Image
                    src={post.user.image}
                    alt=""
                    fill
                    className={styles.avatar}
                  />
                </div>
              )}
              <div className={styles.userTextContainer}>
                <span className={styles.username}>{post?.user.name}</span>
                {post?.updatedAt
                  ? "Last update: " +
                    new Date(post.updatedAt).toISOString().substring(0, 10)
                  : "Date not available"}{" "}
              </div>
            </div>
          </div>
          {post?.imgBig && (
            <div className={styles.imageContainer}>
              <Image
                src={`/images/${post.imgBig}`}
                alt=""
                width={300}
                height={400}
                className={styles.image}
              />
            </div>
          )}
        </div>

        <div className={styles.tableOfContents}>
          <h2>Table of Contents</h2>
          <ul>
            {post.sections.map((section) => (
              <li key={section.id}>
                <a href={`#section-${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.content}>
          {sectionsContent}
          <div className={styles.bottomContent}>
            <CardList page={1} />
            <Menu />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading post:", error.message);
    return <div>Post not found or an error occurred.</div>;
  }
}
