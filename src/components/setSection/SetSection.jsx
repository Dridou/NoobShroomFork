import React from "react";
import SetSpell from "../setSpell/SetSpell";
import SetPal from "../setPal/SetPal";
import SetSectionList from '../SetSectionList/SetSectionList';
import SetTalent from '../setTalent/SetTalent';
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
          <div className={styles.tabContent} id="nav-tabContent">
			<div>
			  <div className={styles.title}>{title}</div>
              <SetSpell
                standardImage={standardImage}
                opponentImage={opponentImage}
                opponentSpells={opponentSpells}
                explanation={explanation}
                timings={timings}
                alternatives={alternatives}
              />
              <SetPal
                palsImage={palsImage}
                palsAlternatives={palsAlternatives}
				title={"Pal"}
              />
              <SetPal
                palsImage={relicsImage}
                palsAlternatives={relicsAlternatives}
				title={"Relics"}
              />
              <SetTalent
			  	talentImage={talentImage}
                talents={talents}
				title={"Talents"}
              />
			  <SetSectionList
			  	list={mounts}
				title={"Mounts"}
			  />
			  <SetSectionList
			  	list={artifacts}
				title={"Artifacts"}
			  />
			   <SetSectionList
			  	list={accessories}
				title={"Back Accessories"}
			  />
			  {/* <SetSectionList
			  	list={avians}
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
