import React from "react";
import SetSpell from "../setSpell/SetSpell";
import SetPal from "../setPal/SetPal";
import SetSectionList from '../SetSectionList/SetSectionList';
import SetTalent from '../SetTalent/SetTalent';
// import SetMount from './SetMount';
// import SetArtifact from './SetArtifact';
// import SetBackAccessory from './SetBackAccessory';
// import SetAvian from './SetAvian';
import styles from "./SetSection.module.css";

const SetSection = ({
  id,
  title,
  standardImage,
  opponentImage,
  opponentSpells,
  explanation,
  timings,
  alternatives,
  palsImage,
  palsAlternatives,
  relicsImage,
  relicsAlternatives,
  talentImage,
  talents,
  mounts,
  artifacts,
  accessories,
  avians,
}) => {
  return (
    <section id={id} className={styles.setSection}>
      <div className={styles.fullSet}>
        <div className={styles.cardBody}>
          <nav>
            <div className={styles.navTabs} id="nav-tab">
              <button
                className={`${styles.navLink} active`}
                id={`nav-set-${id}`}
                data-target={`#pill-set-${id}`}
                role="tab"
                aria-controls={`nav-set-${id}`}
                aria-selected="true"
              >
                Standard
              </button>
            </div>
          </nav>
          <div className={styles.tabContent} id="nav-tabContent">
            <div
              className={`${styles.tabPane} active`}
              id={`pill-set-${id}`}
              role="tabpanel"
              aria-labelledby={`nav-set-${id}`}
            >
              <SetSpell
                standardImage={standardImage}
                opponentImage={opponentImage}
                opponentSpells={opponentSpells}
                explanation={explanation}
                timings={timings}
                alternatives={alternatives}
              />
              <hr />

              <SetPal
                palsImage={palsImage}
                palsAlternatives={palsAlternatives}
				title={"Pal"}
              />
			  <hr />
              <SetPal
                palsImage={relicsImage}
                palsAlternatives={relicsAlternatives}
				title={"Relics"}
              />
              <hr />
              <SetTalent
			  	talentImage={talentImage}
                talents={talents}
				title={"Talents"}
              />
              <hr />
			  <SetSectionList
			  	list={mounts}
				title={"Mounts"}
			  />
              <hr />
              {/* <SetPal
                palsImage={artifacts}
                palsAlternatives={relicsAlternatives}
				title={"Artifacts"}
              />
              <hr />
              <SetPal
                palsImage={accessories}
                palsAlternatives={relicsAlternatives}
				title={"Accessories"}
              />
              <hr />
              <SetPal
                palsImage={avians}
                palsAlternatives={relicsAlternatives}
				title={"Avians"}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetSection;
