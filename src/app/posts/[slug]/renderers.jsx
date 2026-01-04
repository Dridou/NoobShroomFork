import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import MarkdownIt from "markdown-it";
import styles from "./singlePage.module.css";
import SetSection from "@/components/sets/setSection/SetSection";
import Shop from "@/components/shop/Shop/Shop";
import { slugifyTitle } from "./helpers";

const EditSectionButton = dynamic(
  () => import("@/components/sets/EditSectionButton/EditSectionButton"),
  {
    ssr: false,
  }
);

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

markdown.renderer.rules.table_open = () => '<table class="custom-table">';

const renderMarkdownInline = (content) => {
  if (!content) return "";
  return markdown.renderInline(content);
};

const renderMarkdownBlock = (content) => {
  if (!content) return "";
  return markdown.render(content);
};

export const renderShopsSection = (shops) => {
  if (shops.length === 0) {
    return <div>Shops not found</div>;
  }
  const renderShopDescription = (shop) => {
    const blocks = renderContentBlocks(shop?.section?.contentBlocks);
    if (blocks) {
      return blocks;
    }
    const html = shop?.section?.content || shop?.desc || "";
    return html ? (
      <div dangerouslySetInnerHTML={{ __html: html }} />
    ) : null;
  };

  return (
    <>
      {shops.map((shop) => (
        <div
          key={shop.id}
          id={`${slugifyTitle(shop.title)}`}
          className={styles.shop}
        >
          <div className={styles.shopHeader}>
            <h2>{shop.title}</h2>
            <div>{renderShopDescription(shop)}</div>
          </div>
          <Shop shop={shop} />
        </div>
      ))}
    </>
  );
};

export const renderUpdatesSection = (updates) => {
  if (updates.length === 0) {
    return <div>Updates not found</div>;
  }

  return updates.map((update) => (
    <div key={update.id} className={styles.update}>
      <div className={styles.fullHeader}>
        <span className={styles.creationDate}>
          {update.createdAt.toLocaleDateString()}
        </span>
        <div className={styles.updateHeader}>
          <h2>{update.title}</h2>
          <span>
            {update.post && update.section ? (
              <div className={styles.references}>
                <span className={styles.postReference}>
                  {update.post.title}
                </span>
                <span className={styles.arrow}>-</span>
                <span className={styles.sectionReference}>
                  {update.section.title}
                </span>
              </div>
            ) : (
              <div className={styles.references}>
                <span className={styles.noReference}>General</span>
              </div>
            )}
          </span>
        </div>
      </div>
      <p dangerouslySetInnerHTML={{ __html: update.content }}></p>
      {update.post && update.section ? (
        <Link
          href={`/posts/${update.post?.slug}/#${slugifyTitle(
            update.section.title
          )}`}
        >
          <span>
             See{" "}
            <u>
              {update.post?.title}/{update.section?.title}
            </u>{" "}
            updated section
          </span>
        </Link>
      ) : null}
    </div>
  ));
};

const renderContentBlocks = (blocks) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return blocks.map((block, index) => {
    if (!block || typeof block !== "object") {
      return null;
    }

    const key = block.id ? `block-${block.id}` : `block-${index}`;

    switch (block.type) {
      case "paragraph": {
        const html = renderMarkdownInline(block.text);
        return html ? (
          <p key={key} dangerouslySetInnerHTML={{ __html: html }} />
        ) : null;
      }
      case "heading": {
        const level = Number(block.level) || 2;
        const safeLevel = Math.min(6, Math.max(2, level));
        const Tag = `h${safeLevel}`;
        const html = renderMarkdownInline(block.text);
        return html ? (
          <Tag key={key} dangerouslySetInnerHTML={{ __html: html }} />
        ) : null;
      }
      case "list": {
        const items = Array.isArray(block.items) ? block.items : [];
        const ListTag = block.ordered ? "ol" : "ul";
        return (
          <ListTag key={key}>
            {items.map((item, itemIndex) => {
              const html = renderMarkdownInline(item);
              return html ? (
                <li
                  key={`${key}-item-${itemIndex}`}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : null;
            })}
          </ListTag>
        );
      }
      case "html":
        return (
          <div
            key={key}
            dangerouslySetInnerHTML={{ __html: block.html || "" }}
          />
        );
      case "markdown": {
        const html = renderMarkdownBlock(block.text || "");
        return html ? (
          <div key={key} dangerouslySetInnerHTML={{ __html: html }} />
        ) : null;
      }
      default:
        return null;
    }
  });
};

const renderCodesTable = (codes) => {
  if (codes.length === 0) {
    return null;
  }

  const formatExpiredOn = (expiredOn) => {
    if (!expiredOn) {
      return "Active";
    }
    return new Date(expiredOn).toISOString().substring(0, 10);
  };

  return (
    <div className="codes-table-wrap">
      <table className="custom-table codes-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Source</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code.id}>
              <td>
                <span className="code-cell">
                  <span>{code.code}</span>
                  <button
                    type="button"
                    className="code-copy"
                    data-copy-code={code.code}
                    aria-label={`Copy code ${code.code}`}
                  >
                    Copy
                  </button>
                </span>
              </td>
              <td>{code.source}</td>
              <td>{formatExpiredOn(code.expiredOn)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderCodesSection = (title, codes, emptyLabel) => (
  <div className={styles.section}>
    <h2>{title}</h2>
    {codes.length ? renderCodesTable(codes) : <p>{emptyLabel}</p>}
  </div>
);

export const renderCodesContent = (codes) => {
  const activeCodes = codes.filter((code) => code.status === "ACTIVE");
  const expiredCodes = codes.filter((code) => code.status === "EXPIRED");
  const invalidCodes = codes.filter((code) => code.status === "INVALID");

  return (
    <>
      <div className={styles.section}>
        <p>
          Help us keep this list accurate. If a code stops working, please tell
          the team in the comments below so we can update it quickly &lt;3 !
        </p>
      </div>
      {renderCodesSection(
        "Active Codes",
        activeCodes,
        "No active codes available."
      )}
      {expiredCodes.length
        ? renderCodesSection(
            "Expired Codes",
            expiredCodes,
            "No expired codes available."
          )
        : null}
      {invalidCodes.length
        ? renderCodesSection(
            "Invalid Codes",
            invalidCodes,
            "No invalid codes available."
          )
        : null}
    </>
  );
};

export const renderSectionsContent = (post) => {
  return post.sections.map((section) => {
    if (section.type === "set" && section.sets.length > 0) {
      return (
        <div
          key={section.id}
          id={`${slugifyTitle(section.title)}`}
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <EditSectionButton sectionId={section.id} postId={post.id} />
            {section.icon && (
              <Image
                src={section.icon}
                alt=""
                width={32}
                height={32}
                className={styles.sectionIcon}
              />
            )}
          </div>
          {section.sets.map((set, setIndex) => (
            <SetSection
              key={setIndex}
              id={set.id}
              date={
                section.updatedAt
                  ? new Date(section.updatedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Unknown Date"
              }
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
    }

    const blocks = renderContentBlocks(section.contentBlocks);

    return (
      <div
        key={section.id}
        id={`${slugifyTitle(section.title)}`}
        className={styles.section}
      >
        <div className={styles.sectionHeader}>
          <EditSectionButton sectionId={section.id} postId={post.id} />
          {section.icon && (
            <Image
              src={section.icon}
              alt=""
              width={32}
              height={32}
              className={styles.sectionIcon}
            />
          )}
          <div className={styles.headerText}>
            <span className={styles.sectionDate}>
              {section.updatedAt
                ? new Date(section.updatedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Unknown Date"}
            </span>
            <h2>{section.title}</h2>
          </div>
        </div>
        {blocks ?? (
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        )}
      </div>
    );
  });
};


