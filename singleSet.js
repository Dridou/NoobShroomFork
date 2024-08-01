const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const darkWarriorData = {
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
  };

  // Assurez-vous d'avoir un postId valide pour relier le set
  const postId = "clz9n88l60000ynoiwwz3fqu0"; // Remplacez par un ID de post valide

  await prisma.set.upsert({
    where: { id: "dark-warrior" },
    update: {
      ...darkWarriorData,
      post: {
        connect: { id: postId },
      },
    },
    create: {
      ...darkWarriorData,
      post: {
        connect: { id: postId },
      },
    },
  });

  console.log("Set created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
