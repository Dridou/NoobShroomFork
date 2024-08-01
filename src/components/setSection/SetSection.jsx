import React from 'react';
import SetSpell from '../setSpell/SetSpell';
// import SetPal from './SetPal';
// import SetRelic from './SetRelic';
// import SetTalents from './SetTalents';
// import SetMount from './SetMount';
// import SetArtifact from './SetArtifact';
// import SetBackAccessory from './SetBackAccessory';
// import SetAvian from './SetAvian';
import styles from './SetSection.module.css';

const SetSection = ({ id, title, standardImage, opponentImage, opponentSpells, explanation, timings, alternatives, palsImage, palsAlternatives, relicsImage, relicsAlternatives, talents, mounts, artifacts, accessories, avians }) => {
  return (
    <section id={id} className={styles.setSection}>
      <div className={styles.fullSet}>
        <div className={styles.cardBody}>
          <nav>
            <div className={styles.navTabs} id="nav-tab">
              <button className={`${styles.navLink} active`} id={`nav-set-${id}`} data-target={`#pill-set-${id}`} role="tab" aria-controls={`nav-set-${id}`} aria-selected="true">Standard</button>
            </div>
          </nav>
          <div className={styles.tabContent} id="nav-tabContent">
            <div className={`${styles.tabPane} active`} id={`pill-set-${id}`} role="tabpanel" aria-labelledby={`nav-set-${id}`}>
              <SetSpell
                standardImage={standardImage}
                opponentImage={opponentImage}
                opponentSpells={opponentSpells}
                explanation={explanation}
                timings={timings}
                alternatives={alternatives}
              />
              {/* <hr />
              <SetPal
                palsImage={palsImage}
                palsAlternatives={palsAlternatives}
              />
              <hr />
              <SetRelic
                relicsImage={relicsImage}
                relicsAlternatives={relicsAlternatives}
              />
              <hr />
              <SetTalents talents={talents} />
              <hr />
              <SetMount mounts={mounts} />
              <hr />
              <SetArtifact artifacts={artifacts} />
              <hr />
              <SetBackAccessory accessories={accessories} />
              <hr />
              <SetAvian avians={avians} /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetSection;
