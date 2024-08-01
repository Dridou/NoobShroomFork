﻿const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateSections(postId, sectionsData, setData) {
  // Fetch the post along with its sections
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { sections: { include: { sets: true } } },
  });

  if (!post) {
    throw new Error(`Post with ID ${postId} not found`);
  }

  // Update each section with specific content
  for (const sectionData of sectionsData) {
    const existingSection = post.sections.find(
      (section) => section.title === sectionData.title
    );
    if (existingSection) {
      // Update existing section
      await prisma.section.update({
        where: { id: existingSection.id },
        data: {
          title: sectionData.title,
          content: sectionData.content,
          type: sectionData.type,
        },
      });

      // Update or create sets for the section
      if (setData) {
        for (const set of setData) {
          const existingSet = existingSection.sets.find(
            (s) => s.title === set.title
          );

          if (existingSet) {
            await prisma.set.update({
              where: { id: existingSet.id },
              data: {
                ...set,
                sectionId: existingSection.id,
              },
            });
          } else {
            await prisma.set.create({
              data: {
                ...set,
                sectionId: existingSection.id,
              },
            });
          }
        }
      }
    } else {
      // Create new section
      const newSection = await prisma.section.create({
        data: {
          title: sectionData.title,
          content: sectionData.content,
          type: sectionData.type,
          postId: postId, // Link the new section to the post
        },
      });

      // Create sets for the new section
      if (setData) {
        for (const set of setData) {
          await prisma.set.create({
            data: {
              ...set,
              sectionId: newSection.id,
            },
          });
        }
      }
    }
  }

  console.log("Sections updated successfully");
}

const sectionsData = [
  {
    title: "Introduction",
    content:
      "<p>Arrowgod, and its evolved form Plume Monarch, is a very versatile class. It's more complex than it seems. Success in this class isn't just about dealing massive damage, whether in PvE (Player versus Environment) or PvP (Player vs Player).</p>",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Who am I ?",
    content:
      "<p>My in-game name is Kitsu. I've been playing Arrowgod since I started. I currently have around 55 million power and often switch between Arrowgod and Hunter.</p><p>I'm not the best player, but I love theorycrafting and testing to push my character's limits. This has given me a decent understanding of the class and and how to play it effectively.</p>",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Kitsu adventure levels",
    content:
      "<p>To give you an idea of what you can achieve with my recommended setups and knowledge at this power level, here are my current PvE achievements (Updated frequently):</p><ul><li>Lamp Dungeon: 145</li><li>Molten ruins Dungeon: 131</li><li>Chrono Tower Dungeon: 130</li><li>Mage Dark Trial: 10-5 (max level)</li><li>Archer Dark Trial: 10-5 (max level)</li><li>Warrior Dark Trial: 10-5 (max level)</li><li>Cloud Ascension: 20 (max level)</li><li>Grumpy: ~ 4.000.000B dammage (difficulty 96)</li><li>Lava Dungeon: ~ 15.000.000B dammage</li><li>Adventure: Revelation V - 6</li><li>PvP Cross Server: Elite Champion</li></ul>",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Guide important information",
    content:
      "<p>Disclaimer: this guide shows you the methods and sets I use or have used in my adventure. However, many other choices are possible, and some might be even better than those suggested here. Testing everything thoroughly takes a lot of time, but I hope this guide will help you as much as possible.</p>If you need further help or want to discuss the strategies, feel free to join our Discord server: <a href='https://discord.gg/XFf9mP3V'>NoobShroom Community</a>",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Class presentation",
    content:
      "<p>Playing Arrowgod will eventually be necessary to advance in PvE content because of its high and consistent damage output, often referred to as DPS (Damage Per Second). This will help you gather more resources, directly increasing your power.</p><p>In PvP, Arrowgod becomes viable when you have enough red feathers to upgrade your back accessory talents, allowing you to compete with warriors and mages. We'll go into more detail on this later.</p><br><table class='table custom-table'><thead><tr><th><b>Class skill</b></th><th>Skill description<hr>Explanation</th></tr></thead><tbody><tr><td class='text-center'><img src='/images/crossbow/crossbow-skill-active.png' class='img-fluid' style='width: 3rem;' alt='Crossbow passive skill icon'></td><td><p style='font-weight: bold;'>Deal 4263% <span style='color: aqua;'>(9591%)</span> AoE Dmg and increasing Combo Dmg received by the range by 60 during 5 <span style='color: aqua;'>(8)</span> seconds.<br><span style='color: aqua;'>Additionally, ignore enemy evasion for 10 seconds.</span></p><hr>Your class spell gives you 5 seconds of burst damage. Make sure to activate it at the same time as your damage spells.</td></tr><tr><td class='text-center'><img src='/images/crossbow/crossbow-skill-1.png' class='img-fluid' style='width: 3rem;' alt='Crossbow active skill 1 icon'></td><td><p style='font-weight: bold;'>Combo +30%</p><hr>Our main damage will come from our combo attacks</td></tr><tr><td class='text-center'><img src='/images/crossbow/crossbow-skill-2.png' class='img-fluid' style='width: 3rem;' alt='Crossbow active skill 2 icon'></td><td><p style='font-weight: bold;'>Atk Speed +15%, Ignore Evasion +10%</p><hr>As a DPS class, we want to hit a maximum of attacks</td></tr><tr><td class='text-center'><img src='/images/crossbow/crossbow-skill-3.png' class='img-fluid' style='width: 3rem;' alt='Crossbow active skill 3 icon'></td><td>Combo Dmg +140%<hr>A bonus to our base combo dmg</td></tr><tr><td class='text-center'><img src='/images/crossbow/crossbow-skill-4.png' class='img-fluid' style='width: 3rem;' alt='Crossbow active skill 4 icon'></td><td><p style='font-weight: bold;'>Shoot an additional 2 <span class='tip'>(3)</span> <s>basic attack</s> bullets during combos</p><hr>Since basic attacks trigger combo attacks, it's important to know that this spell will fire 2 bullets (or 3 when awakened) each time you trigger a combo. These bullets use your basic attack damage coefficient but <span class='tip'>are not counted as basic attacks</span>. They don't trigger combo attacks or use the combo coefficient.</td></tr><tr><td class='text-center'><img src='/images/crossbow/crossbow-skill-5.png' class='img-fluid' style='width: 3rem;' alt='Crossbow active skill 5 icon'></td><td><p style='font-weight: bold;'>Shoot twice during basic attacks</p><hr>If you have 4.0 Attack Speed you'll hit 8 <b>basic attacks</b> per second, it's essential to understand that because basic attacks are the one triggering combos, see <a href='http://localhost:3000/tips/stats-information#stats-explanation-advanced-basic-atk'>Basic Attack explanation</a></td></tr></tbody></table>",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Stats to focus on",
    content:
      '<p>You really want to prioritize these characteristics: Either Crit Or Combo, both is the best, a good substat is stun.</p>\r\n<div class="custom-row">\r\n    <div class="custom-col">\r\n        <figure class="figure">\r\n<img class="figure-img" src="/images/crossbow/bad-item.png" alt="Wrong item for a crossbow">\r\n            <figcaption class="figure-caption">BAD Item</figcaption>\r\n        </figure>\r\n    </div>\r\n    <div class="custom-col">\r\n        <figure class="figure">\r\n            <img class="figure-img" src="/images/crossbow/mid-item.png" alt="Correct item for a crossbow">\r\n            <figcaption class="figure-caption">Good Item</figcaption>\r\n        </figure>\r\n    </div>\r\n    <div class="custom-col">\r\n        <figure class="figure">\r\n            <img class="figure-img" src="/images/crossbow/excellent-item.png" alt="Perfect item for a crossbow">\r\n            <figcaption class="figure-caption">Excellent Item</figcaption>\r\n        </figure>\r\n    </div>\r\n</div>\r\n',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Gear rarity upgrade",
    content:
      '<p>From <span style="color: pink;">immortal</span> equipment, you want to start focusing on substats.<br> Each time you\'ll start to get good stats on your equipment, once comes the moment you have to up its rarity.<br> Especially for <span style="color: gold">gold</span> equipements, you only change your Aurous for a Supreme if it has Crit AND combo.</p><div class=custom-row><div class=custom-col><figure class=figure><img alt="Item two good stats: crit and combo"class=figure-img src=/images/crossbow/crossbow-item-better.png><figcaption class=figure-caption>The two stats we want</figcaption></figure></div><div class=custom-col><figure class=figure><img alt="Item with only one good stat: Combo and Skill Crit"class=figure-img src=/images/crossbow/crossbow-item-lower.png><figcaption class=figure-caption>Only one good stat</figcaption></figure></div></div>',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Stats ratio",
    content:
      "<p>Concerning Plume Monarch, we really want to have a good balance between our Combo % and our Crit Rate (CC) %. This of course depends of your Combo Damage and your Crit Damage.<br>Usually, you want to aim at 80% Combo and 50% Crit Rate, but this can change depending of your equipment and your level. The more you have CC damage the more you should balance your Combo and CC equally (with always combo priorized).<br><br>Here's a list of good ratios:<br><ul><li>80% Combo / 50% CC<li>85% Combo / 55% CC<li>90% Combo / 65% CC<li>100% Combo / max possible CC</ul><br><p>As crossbow, the mask relic allows up to exchange 10% Combo for 10% CC and vice versa, use this to be more versatile and build a good ratio<br>Some examples of ratios comparison, assuming you have a decent combo and crit dmg<ul><li>70% Combo / 30% CC > 80% Combo / 20% CC<li>80% Combo / 15% CC > 90% Combo / 5% CC<li>80% Combo / 70% CC > 90% Combo / 60%% CC<li>90% Combo / 50% CC > 100% Combo / 40% CC</ul>",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Offensive Spells",
    content:
      '<table class="custom-table table"><thead><tr><th>Skill<th>Cooldown<th>Effect<th>Explanation<tr><td class=text-center><img alt="Speed Surge skill icon"class=img-fluid src=/images/skill-speed-surge.png style=width:5rem><td>14<td>Deal 656% Dmg to the nearest target<br>Increase Atk Speed by 30% for 5 seconds<td>Combined with other burst skills, this one can be very strong, especially in PvE when you really need to deal huges dmg (Lava boss, dark trials, cross server showdown relics, etc.)<tr><td class=text-center><img alt="Coin Bomb skill icon"class=img-fluid src=/images/skill-coin-bomb.png style=width:5rem><td>13<td>Deal 1450% AoE Dmg<br>Increase basic Atk Dmg by 35% for 5 seconds<td>Usefull in early / mid game when you don\'t have other essentials spells<tr><td class=text-center><img alt="Slime Bomb skill icon"class=img-fluid src=/images/skill-slime-bomb.png style=width:5rem><td>13<td>Deal 1887% AoE Dmg<br>Increase pals\' Dmg by 30% for 5 seconds<td>Currently not used but in my opinion it may be used in the future meta<tr><td class=text-center><img alt="Grirm Reaper skill icon"class=img-fluid src=/images/skill-grim-reaper.png style=width:5rem><td>9<td>Deal 1443% Dmg<br>Instantly kill targets below 5% HP.<td>Never use it, except maybe for the lamp magic dungeon<tr><td class=text-center><img alt="Heroic Descent skill icon"class=img-fluid src=/images/skill-heroic-descent.png style=width:5rem><td>19<td>Summon an untargetable Hero Spirit with 3 Atk Speed, dealing 148% Dmg per basic atk for 10 seconds.<td>Prety useless, even associated with the relic<tr><td class=text-center><img alt="Wild Gust skill icon"class=img-fluid src=/images/skill-wild-gust.png style=width:5rem><td>16<td>Summon a gale dealing 2642% AoE Dmg over a few seconds<br>Increase Atk by 15% for 5 seconds<td>Great skill in mid game, but smoke bomb is way beter<tr><td class=text-center><img alt="Blade Pierce skill icon"class=img-fluid src=/images/skill-blade-pierce.png style=width:5rem><td>19<td>Deal 4663% Dmg<br>The target also lose 1.5% of their max HP per second for 5 seconds, so 7.5% max HP in 5 seconds.<td>Can be usefull in PvE knowing that monsters have more and more hp with time<tr><td class=text-center><img alt="Bliz Assault skill icon"class=img-fluid src=/images/skill-blitz-assault.png style=width:5rem><td>24<td>Deal 5829% Dmg<br>Provide you dommage immunity for 3 seconds<td>Excellent and largely used in Pvp. Very good in PvE and waves too because it allows to buy some time to get back your skills (and not dying :D).<tr><td class=text-center><img alt="Clone Strike skill icon"class=img-fluid src=/images/skill-clone-strike.png style=width:5rem><td>29<td>Generate a Clone with 30% of your HP, and (apparently) the same other stats as yours.<br>The clone lasts for 10 seconds dealing 200% Dmg (+5% per level) with each basic atk.<td>Surely the best crossbow skill ever, use it nearly everywhere. It tanks for your, deal a ton of dmg, only becomes useless in PvP late game<tr><td class=text-center><img alt="Hundred Slashes skill icon"class=img-fluid src=/images/skill-hundred-slashes.png style=width:5rem><td>19<td>Deal 4463% Dmg<br>Gain 20% basic Atk Dmg Res & gain 0.5% of your current HP as Atk bonus for 5 seconds.<td>Prety usefull in late game, brings you 20% basic dmg res; effective in PvE and PvP, + a bit of atk<tr><td class=text-center><img alt="Windborne Arrow skill icon"class=img-fluid src=/images/skill-windborne-arrow.png style=width:5rem><td>19<td>Deal 2665% Dmg<br>During 5 seconds 100% (+5% per level) of your basic atk dmg will be added to any non-skill Dmg dealt to the target.<td>I know it seems OP, but I described the real skill effect and... it sucks except when we purely want to put dmg (relic in cross server showdown for example)<tr><td class=text-center><img alt="Worldy snare skill icon"class=img-fluid src=/images/skill-worldly-snare.png style=width:5rem><td>24<td>Deal 5413% Dmg<br>Increase Crit Rate by 10%. For every 1% Crit Rate you have, you gain +3% Crit Dmg during 5 seconds.<td>Once you have a decent Crit Rate and Crit Dmg, this skill is really strong, especially combined with smoke bomb / speed surge<tr><td class=text-center><img alt="Smoke bomb skill icon"class=img-fluid src=/images/skill-smoke-bomb.png style=width:5rem><td>13<td>Throw a smoke which takes around 0.5 to be activated<br>Deal 2176% DMG<br>Increase the total damage received by targets within the range by 30% for 5 seconds.<td>One of the best skills for crossbow, it\'s a must have in every situation adding 30% <b>total dmg</b> received by targets</table>',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Crowd Control Spells",
    content:
      '<table class="custom-table table"><thead><tr><th>Skill<th>Cooldown<th>Effect<th>Explanation<tbody><tr><td class=text-center><img alt="Thorn thicket skill icon"class=img-fluid src=/images/skill-thorn-thicket.png style=width:5rem><td>8<td>Slow enemy in the range of the thorn by 40% for 5 seconds, deals 53% dmg every second<td>One of the best PvE spell; very short CD (even shorter with redslime), completely OP for ranged bosses and even usefull for close ranged ones, + essential for waves<tr><td class=text-center><img alt="Entangling vines skill icon"class=img-fluid src=/images/skill-entangling-vines.png style=width:5rem><td>8<td>Root the ennemy for 1 second<td>Can be used in combination with slowing spells, especially for dragon dungeon / dragon bosses or any bosses having a slow atk speed and big dmg<tr><td class=text-center><img alt="Sprawling vine skill icon"class=img-fluid src=/images/skill-sprawling-vine.png style=width:5rem><td>11<td>Root the ennemies within the range for 1 second, deals 789% AoE Dmg<td>Can be used in really special situation for fully controling ennemies, but rarely<tr><td class=text-center><img alt="Durian bomb skill icon"class=img-fluid src=/images/skill-durian-bomb.png style=width:5rem><td>18<td>Continuously summons 3 bombs dealing 888% Aoe Dmg, slowing targets by 40% for 5 seconds<td>Seems to be a good spell, it even has a relic appropriate, but it\'s not used at all because the entangling vines is way better with a much shorter CD<tr><td class=text-center><img alt="Easy breasy skill icon"class=img-fluid src=/images/skill-easy-breasy.png style=width:5rem><td>15<td>Reduce Atk of targets within the range by 20% for 5 seconds, deals 1657% AoE Dmg<td>Can be used in combination with slowing spells, especially for dragon dungeon / dragon bosses or any bosses having a slow atk speed and big dmg. Though we will prefer the next spell with atk speed reduction<tr><td class=text-center><img alt="Take it slow skill icon"class=img-fluid src=/images/skill-take-it-slow.png style=width:5rem><td>12<td>Reduce Atk Speed of targets whithin the range by 40% for 5 seconds, deals 1635%<td>Very good spell, especially to give you time to do a second rotation of your skills (see my sets and explanations in the end of the guide)<tr><td class=text-center><img alt="Disarm skill icon"class=img-fluid src=/images/skill-disarm.png style=width:5rem><td>16<td>~0.5 sec of activation. The targets within the range (except pals in pvp) cannot attacks for 3 (4.5) seconds, deals 2682% Aoe Dmg<td>One of the best spell, associate with the rune it gives <b>4,5 seconds</b> of disarm with is huge. It\'s a must have everywhere for crossbows<tr><td class=text-center><img alt="Dazzled skill icon"class=img-fluid src=/images/skill-dazzled.png style=width:5rem><td>19<td>~0.5 sec of activation. The targets within the range (except pals in pvp) are stunned for 1.5 (2.25) seconds, deals 3134% Aoe Dmg<td>Also a really good spells, even if it\'s a shorter duratio (2.25 with relic). It will always be chained before or after the disarm spell.</table>',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Defensive Spells",
    content:
      '<table class="custom-table table"><thead><tr><th>Skill<th>Cooldown<th>Effect<th>Explanation<tbody><tr><td class=text-center><img alt="Nature renewal skill icon"class=img-fluid src=/images/skill-natures-renewal.png style=width:5rem><td>25<td>Recover 30% (~10% in PVP) of max HP within 5 seconds, deals 1775% Dmg to the nearest target<td>Before atk pink soul, you won\'t get any significant lifesteal, though you may use this spell for your waves or dungeons. After that... you\'ll still need it because waves will tri shot you and your waves runs will be clutching with a few dodged / tanked auto; time for you to get back your skills.<tr><td class=text-center><img alt="Shroom shield skill icon"class=img-fluid src=/images/skill-shroom-shield.png style=width:5rem><td>19<td>Gain a shield equal to 20% (8% in PvP) of your max HP, lasting 10 seconds. Deals 1183% Dmg.<td>The main advantage of this one is that the shield last 10 seconds which is pretty huge because the CD is getting back meanwhile, though if nobbody is hitting you well.. it\'s wasted.<br>Knowing we will try to slow as much as possible ennemies; it\'s kinda tricky to use it.</table>',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Useless pals",
    content:
      '<table class="custom-table table"><thead><tr><th>Pal<th>Effect<th>Explanation<tbody><tr><td class=text-center><img alt="Cat prince pal icon"class=img-fluid src=/images/aco-cat-prince.png style=width:5rem><td>After using any skill, deal 200% dmg<td>Only for mage<tr><td><img alt="Red Chicken pal icon"class=img-fluid src=/images/aco-chicken.png style=width:5rem><td>Basic atk Dmg +30%<td>Basic atk is completely negligible for us compare to combo / crit<tr><td><img alt="Fiery tail pal icon"class=img-fluid src=/images/aco-fiery-tail.png style=width:5rem><td>Skill Dmg +60%<td>I hope you can find by yourself why it\'s useless :3 (it\'s for mages)<tr><td><img alt="Rainbow guardian pal icon"class=img-fluid src=/images/aco-rainbow-guardian.png style=width:5rem><td>Counter +10%, Counter Dmg +100%<td>It\'s for tanks<tr><td><img alt="Pepe pal icon"class=img-fluid src=/images/aco-pepe.png style=width:5rem><td>Healing +0.1%<td>0.1% if not bad for healing chance, but you will fast get 0.2%/0.3%/0.4% with runes, and we have more important pals to place than this one, sorry pepe<tr><td><img alt="Electric pup (dog) pal icon"class=img-fluid src=/images/aco-dog.png style=width:5rem><td>Increase counter Dmg by 60%, restore 1% of lost HP when a counter is triggered<td>Only for tanks<tr><td><img alt="Pink lizard pal icon"class=img-fluid src=/images/aco-lizard.png style=width:5rem><td>Pal Dmg +60%<td>Only for tanks<tr><td><img alt="Octopus pal icon"class=img-fluid src=/images/aco-octopus.png style=width:5rem><td>Increase Combo Dmg by +60%, and every 3 auto of the octopus deal an extra 200%<td>I know, it seems strong but it\'s not because 60% Combo Dmg are added to Comgo Dmg Total, so it will roughly will up your global combo by 200% which is negligible</table>',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Situational pals",
    content:
      '<table class="custom-table table"><thead><tr><th>pal<th>Effect<th>Explanation<tbody><tr><td><img alt="Cactus pal icon" class="img-fluid" src="/images/aco-cactus.png" style="width:5rem"><td><span class="update">(Updated)</span> Every 3 basic attacks (yours) , deal an extra 40% Dmg<td>Actually it\'s on every 3 attacks of the pal, so pretty useless<tr><td><img alt="Panda pal icon" class="img-fluid" src="/images/aco-panda.png" style="width:5rem"><td>HP regeneration +40%<td>Can be useful if we really need to tank (for Grumpy for example somehow)<tr><td><img alt="Snow general pal icon" class="img-fluid" src="/images/aco-snow-general.png" style="width:5rem"><td>Reduce enemy attack speed by 15%<td>Well it\'s not bad and can be used in combination with \'Take it Slowly\' to really reduce opponent attack speed<tr><td><img alt="Fox pal icon" class="img-fluid" src="/images/aco-fox.png" style="width:5rem"><td>Extend stun duration by 30%, and deal extra 25% Dmg to stunned enemies.<td>Mainly for mages, that can be used in association with \'Dazzled\' skill to maximize the CC sometimes<tr><td><img alt="Tortoise pal icon" class="img-fluid" src="/images/aco-tortoise.png" style="width:5rem"><td>When HP is below 50%, gain a shield of 30% max HP (Cooldown: 60 sec)<td>This one can totally be useful in PvE or PvP, depending on your strategy</table>',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Essential pals",
    content:
      '<table class="custom-table table"><thead><tr><th>pal<th>Effect<th>Explanation<tbody><tr><td><img alt="Benny pal icon" class="img-fluid" src="/images/aco-benny.png" style="width:5rem"><td>Crit +5%, have 30% chance to airborne the target for 0.5 second (at each bunny attack)<td>First, brings some cc which is very good, secondly can airborne which is very good in PvE AND PvP because airborne res is much harder to get than stun res<tr><td><img alt="Red slime pal icon" class="img-fluid" src="/images/aco-red-slime.png" style="width:5rem"><td>Every skills Cooldown -25%<td>Best pal ever in PvE when you aim to do 2 spell rotations.<tr><td><img alt="Red bird pal icon" class="img-fluid" src="/images/aco-hero-bird.png" style="width:5rem"><td>Attack speed +15%<td>Also a very essential one since we want to hit a lot per second<tr><td><img alt="Red snail pal icon" class="img-fluid" src="/images/aco-snail.png" style="width:5rem"><td>Enemy movement speed -40%<td>The best in PvE, can be cumulated with thorn thicket skill to reduce enemies speed by 80%<tr><td><img alt="Red deer pal icon" class="img-fluid" src="/images/aco-deer.png" style="width:5rem"><td>Dmg Res +15%<td>Reducing every damage by 15% is really strong, though its utilization is situational, the best defense is attack<tr><td><img alt="Red banana pal icon" class="img-fluid" src="/images/aco-banana.png" style="width:5rem"><td>Combo +10%, Combo Dmg+100%<td>This is the really octopus we should have had. It\'s a paid one but definitely so strong obviously.<tr><td><img alt="Pink dragon pal icon" class="img-fluid" src="/images/aco-dragon.png" style="width:5rem"><td>Increase Base Crit Dmg by 50%, and skill crit Rate by 20%<td>Please note it\'s base Crit, which is normally 200%, which is upped to 250%! That\'s just insane when you start having decent Crit and crit dmg</table>',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Relics",
    content:
      '<table class="custom-table table"><thead><tr><th>Relic<th>Effect<th>Explanation<tbody><tr><td class="text-center"><img alt="Combo mask relic icon" class="img-fluid" src="/images/relic-mask-combo.png" style="width:5rem"><td>Combo +10%<td>Either choose this one or the crit one<tr><td class="text-center"><img alt="Crit mask relic icon" class="img-fluid" src="/images/relic-mask-crit.png" style="width:5rem"><td>Crit +10%<td>Either choose this one or the combo one<tr><td class="text-center"><img alt="Thundercaller Kite relic icon" class="img-fluid" src="/images/relic-thunder.png" style="width:5rem"><td>After using a skill, deal 1106% Dmg<td>Can be a good amount of dmg waiting we know how pals are useful<tr><td class="text-center"><img alt="Magic box relic icon" class="img-fluid" src="/images/relic-magic-box.png" style="width:5rem"><td>Increase Cat and Deer Pals\' Dmg by X%<td>Well this relic category is pretty useless but that one can fit<tr><td class="text-center"><img alt="Flame book relic icon" class="img-fluid" src="/images/relic-flame-book.png" style="width:5rem"><td>Increase Atk by 1% per second up to 10%<td>Very strong one, 10 seconds is really short, useful in PvE (waves) or PvP for maximize dmg<tr><td class="text-center"><img alt="Beasthide Book relic icon" class="img-fluid" src="/images/relic-beasthide-book.png" style="width:5rem"><td>Dmg to bosses +20%<td>For bosses you\'ll alternate between this one to defeat boss in one skill rotation, or immune one in 2 skill rotations.<tr><td class="text-center"><img alt="Immunity book relic icon" class="img-fluid" src="/images/relic-immunity-book.png" style="width:5rem"><td>In boss levels, become immune to damage for 3 seconds when HP drops below 70% (one time)<td>For bosses you\'ll alternate between this one to defeat boss in one skill rotation, or immune one in 2 skill rotations.<tr><td class="text-center"><img alt="Stonewrit book relic icon" class="img-fluid" src="/images/relic-stonewrit-tome.png" style="width:5rem"><td>Basic Atk Dmg Res, Pal Dmg Res, Counter Dmg Res, Combo Dmg Res and Skill Dmg Res +5%<td>A very good one in PvP and for PvE (waves) if you need to survive more than hitting<tr><td class="text-center"><img alt="Time statue relic icon" class="img-fluid" src="/images/relic-statue-time.png" style="width:5rem"><td>Duration of Disarm, Dazzled and Smoke bomb +50%<td>A huge buff on 3 of our main spells? Perfect, except for PvP maybe in the future<tr><td class="text-center"><img alt="Storm necklace relic icon" class="img-fluid" src="/images/relic-storm-necklace.png" style="width:5rem"><td>Clone Strike clone and Heroic Descent +30% Dmg<td>Knowing we use the clone nearly everywhere, this is surely the best necklace<tr><td class="text-center"><img alt="Stellar statue relic icon" class="img-fluid" src="/images/relic-stellar-statue.png" style="width:5rem"><td>Extend the effect duration of Hundred Slashes, Wordly Snare, and Star array by 50%<td>A huge buff on 3 of classes burst spells. In late game it\'s actually pretty strong</table>',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Statue",
    content:
      "<p>I've been testing by myself and seeing the different calculations done on the official discord by different people.<br>Understanding the formulas of the game allow these people, and I confirm, that the best statue for CrossBow is definitely <span class=tip>5x Global Combo</span> , it's simple.</p>",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Souls",
    content:
      '<h3>Usage tips</h3><p>Several essential facts to know concerning souls:<ul><li>Salvage any soul below a red one will destroy it permanently and refund you the entiere xp amount spent on it.<li>You cannot salvage a red one, though you can reset its level with the <img alt="Soul reset icon"class=img-fluid src=/images/reset-icon.png style=width:1.5rem> on top of it for 500<img alt="Red diamond"class=img-fluid src=/images/red-diamond.png style=width:1.75rem><li>All the extra red runes you have will be used to reroll the bonus stat of your pink rune. Then you\'ll be able to choose the one to retain:<br><img alt="Fusion of two tier 2 red soul into a pink soul"class=img-fluid src=/images/soul-fusion-result.png width=33%></ul><h3>Pink soul acquisition order</h3><p>The \'default\' way and the most ballanced one is: ATK > COMBO > HP > DEF > BASIC ATK<p>Note that you can take Combo first if you priorize PvE content to get more rewards.<br>You can also take DEF before HP if you lack def more then hp.<h3>Souls levels ratio</h3><p>For the soul levels, and assuming you have every rune in red rarity (else it priorize your red offensive souls), here is a good ballanced example:<ul><li><span style=font-weight:700>lv20</span> | <span>Combo Dmg</span><li><span style=font-weight:700>lv20</span> | <span>Crit Dmg</span><li><span style=font-weight:700>lv20</span> | <span>Atk</span><li><span style=font-weight:700>lv15</span> | <span>HP</span><li><span style=font-weight:700>lv15</span> | <span>DEF</span><li><span style=font-weight:700>lv12</span> | <span>Res Crit Damage</span><li><span style=font-weight:700>lv15</span> | <span>Basic atk</span><li><span style=font-weight:700>lv1 </span>| <span>Counter Dmg</span></ul><br><p>Since it is posible to reset souls, It is advised to take 1/2 days per week where you only level up your atk/critDmg/ComboDmg souls and try to push the PvE content as much as posible, then reverting to a ballanced set.<p>I don\'t think there is, for now, a perfect strategy for souls level up and I also encourage you to test by yourself!',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Talents",
    content:
      '<p>Any class you play, I can already assure you it\'s so worth to <span class="tip-detailled">equalize Atk/Def/HP</span> (either to lv10/12/14/16, depending your divine feather amount) on the your 3 different branches: fury, archery and sorcery. Indeed, these nodes are really cheap and so really worth, and the 3 first nodes are always the same (in a different order but whatever) on the 3 branches.</p><p>Then, <span class="tip">for Crossbow</span> you absolutely want the <span class="tip-detailled">combo damage node</span> in the Archery branch.</p><p>So this is the basic for a crossbow player:</p><img alt="Example of crossbow talent points distribution" class="img-fluid" src="/images/talent-combo-dmg.png" style="width:33%"><br><p>Then you have multiple strategies depending on what you want:</p><ul><li><p><span class="tip">PvE Dmg build:</span> get the <span class="tip">Basic Atk Damage</span> nodes to the maximum, only putting points in the required nodes to reach them, in the Sorcery blue path, and in the Fury Yellow path - for Lamp Dungeon for example.</p></li><li><p><span class="tip">PvE Def build:</span> get the <span class="tip">Basic Atk Resistance</span> nodes to the maximum, only putting points in the required nodes to reach them, for waves, Cloud Ascension Trial, Chrono Tower and so on. <span class="tip-detailled">Most of monsters only hit with basic attacks, including most bosses</span>.</p></li><li><p><span class="tip">PvP balanced build:</span> get the <span class="tip">Skill Dmg Resistance</span> and/or <span class="tip">Counter Dmg Resistance</span> nodes depending on the fights where you struggle. Associated with your artefact right rune you can achieve ~35% counter resistance for example.</p></li></ul><p>You have plenty other strategies, but these are some useful ones, join our discord to discuss about them and discover new ones!<br>Also, <span class="tip">don\'t forget to have fun</span>, you can infinitely reset these talents for free so why not try different strategies?</p>',
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Awakening nodes",
    content:
      "<p>Up everything to lv10, then up ATK/BASIC ATK equaly. Your Basic Atk node counts into your combo coefficient.</p>",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Artifact Runes",
    content:
      "<p>For reminder, you should first consider reading the <a href=/tips/artifact-rune-system>Artifact rune systemement Rune system</a><p>Sets: at first don't bother with sets and focus on substats,<br>then you must try to get 3x Global Crit since this is the only place we can get global crit<div>You must rapidly:<ul><li>get a top right <span class=tip>Combo Dmg</span> rune<li>get a bottom right <span class=tip>Crit Dmg</span> rune</ul></div><br><p><span class=tip>Substats</span> to prioritize:<ul><li>(S tier) Ignore Evasion<li>(S tier) Global basic Atk Dmg<li>(A tier) Counter Dmg Res<li>(A tier) Skill Dmg Res<li>(B tier) Global Combo Dmg<li>(C tier) Airborne<li>(C tier) Evasion</ul><p>With Eteneral Gears, fights will last much longer and yes, we want to do big damages, but also surviving in PvP",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Mount, Artifacts and Back Accessory",
    content:
      "<p>For a starting point for free-to-play players:<ul><li><b>Mounts:</b> To take: Ox mount through wheel, Sword then Slime in Rush Shop.<br>Ox for PvP versus Crossbow, Archers & Mages, Slime for PvP versus Warrior, Sword for PvE.<li><b>Artifact:</b> Hammer (the only free artifact currently available from the wheel).<li><b>Back accessory:</b> Emerald Embrace (the only free back accessory available through the wheel).</ul><p>The question of which mount is the best is very common. Unfortunately, <span class=tip>the answer depends on the specific game activity you're engaged in</span>. The effectiveness of mounts, artifacts, back accessories, and avian pets varies based on the activity. For example, some mounts, like the Ox, are excellent in PvP but only average in PvE. The same applies to artifacts and back accessories. Even avian pets' usefulness depends on the activity. For more precise information and details, please refer to the recommended sets section.",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
  {
    title: "Dark Trial versus Warrior",
    type: "set",
    content: "",
    id: "clz9n88l60000ynoiwwz3fqu0",
  },
];

const darkWarriorData = [{
    title: "Dark Trials - Versus Warrior",
    standardImage: "/images/crossbow-dark-warrior-spells.png",
    opponentImage: "/images/dark-warrior-spells.png",
    opponentSpells: "Sword Master or Warbringer",
    explanation:
      "The goal is to delay damage spells to avoid debuffs from his spells and to avoid wasting damage on his 20% HP shield.",
    timings:
      "<img src='/images/skill-blitz-assault.png' class='img-fluid' alt='Clone Strike skill icon' style='width: 30px;'> Set to 1.5s max to avoid taking its spells (except bliz, unavoidable), as animations strike at this moment and main damages come from there.<br><img src='/images/skill-disarm.png' class='img-fluid' alt='Disarm skill icon' style='width: 30px;'> -> 10s to align with the disarm, ensuring the clone hits for the maximum amount of time.",
    alternatives:
      "<img src='/images/skill-hundred-slashes.png' class='img-fluid' alt='Hundred slashes skill icon' style='width: 30px;'> or <img src='/images/skill-wild-gust.png' class='img-fluid' alt='Wild gust skill icon' style='width: 30px;'> <br> <img src='/images/skill-blitz-assault.png' class='img-fluid' alt='Clone Strike skill icon' style='width: 30px;'> or <img src='/images/skill-natures-renewal.png' class='img-fluid' alt='Blitz Assault skill icon' style='width: 30px;'> to allow more tankiness. <br> <img src='/images/skill-clone-strike.png' class='img-fluid' alt='Clone Strike skill icon' style='width: 30px;'> or <img src='/images/skill-speed-surge.png' class='img-fluid' alt='Blitz Assault skill icon' style='width: 30px;'>.",
    palsImage: "/images/crossbow-dark-warrior-pals.png",
    palsAlternatives:
      "<img src='/images/aco-benny.png' class='img-fluid' alt='Speed Surge skill icon' style='width: 30px;'> or <img src='/images/aco-cactus.png' class='img-fluid' alt='Speed Surge skill icon' style='width: 30px;'> <br> <img src='/images/aco-deer.png' class='img-fluid' alt='Speed Surge skill icon' style='width: 30px;'> or <img src='/images/aco-banana.png' class='img-fluid' alt='Speed Surge skill icon' style='width: 30px;'> If you survive easily, use the deer for more tankiness.",
    relicsImage: "/images/crossbow-adventure-bosses-relics.png",
    relicsAlternatives:
      "<img src='/images/relic-immunity-book.png' class='img-fluid' alt='Red Slime skill icon' style='width: 40px;'> or <img src='/images/relic-beasthide-book.png' class='img-fluid' alt='Speed Surge skill icon' style='width: 40px;'> if you can tank 10s and need more damage.",
    talents:
      "Your usual talent tree, balanced for damage and tankiness, you can up damage talents and lower def/hp if you tank enough. Grab a few points in <span class='tip'>basic attack resistance</span> since the boss mainly deals that type of damage. <span class='tip'>Increase a basic attack resistance rune</span> (the right one) to level 10/12 without worrying about sub stats to boost your tankiness (also useful for the archer and general PvE).",
    mounts: [
      {
        name: "Holy Dragon",
        description: "defense+++, set your clone to 0.5s",
      },
      { name: "Watermelon Ship", description: "defense+,bump" },
      { name: "Pyrebreaker", description: "damage+, crit rate %+." },
      { name: "Adapto slime", description: "Attack+, defense+, shield" },
    ],
    artifacts: [
      {
        name: "Flaming Carnage",
        description: "lowering boss / mob crit res -> up damage",
      },
      { name: "Eye of Raven", description: "Rng but randomly pass your boss" },
    ],
    accessories: [
      { name: "Shell blade", description: "shield+, spell recovery+++" },
      { name: "Arackar Lock", description: "Combo Damage+" },
      { name: "Summer parasol", description: "defense+ , spell recovery+" },
      { name: "Emerald Embrace", description: "Combo Damage++" },
      { name: "Ingredient for Dinner", description: "up damage" },
    ],
    avians: {
      list: "Midnight Firefly or Atronaut (blue) B.Duck or 3-Round Shooter",
      affixes: [
        "All-Roud Hit / Shroom Combo / Super Crowd Combo",
        "Rage Bonus",
        "Enhanced Attack / Super Attack",
        "Against the Strong",
      ],
    },
  }];

updateSections("clz9n88l60000ynoiwwz3fqu0", sectionsData, darkWarriorData) // Pass the ID of the post you want to update
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
