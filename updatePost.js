const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require('fs');
console.log("Updating post...");

// Load data from JSON files
const sectionsData = JSON.parse(fs.readFileSync('./sectionsData.json', 'utf-8'));
// const setsData = JSON.parse(fs.readFileSync('./darkWarriorSet.json', 'utf-8'));

async function updateSectionsAndSets() {
	console.log("Updating sections and sets...");
	for (const sectionData of sectionsData) {
	  // Trouver la section existante ou la créer
	  let section = await prisma.section.upsert({
		where: { id: sectionData.id },
		update: {
		  title: sectionData.title,
		  content: sectionData.content,
		  type: sectionData.type,
		  sets: sectionData.sets,
		},
		create: {
		  id: sectionData.id,
		  title: sectionData.title,
		  content: sectionData.content,
		  type: sectionData.type,
		  postId: sectionData.postId,
		  sets: sectionData.sets,
		},
	  });

	  // Ajouter ou mettre à jour les sets pour chaque section
	  if (sectionData.sets && sectionData.sets.length > 0) {
		for (const setData of sectionData.sets) {
		  await prisma.set.upsert({
			where: { id: setData.id || '' },
			update: {
			  title: setData.title,
			  standardImage: setData.standardImage,
			  opponentImage: setData.opponentImage,
			  opponentSpells: setData.opponentSpells,
			  explanation: setData.explanation,
			  timings: setData.timings,
			  alternatives: setData.alternatives,
			  palsImage: setData.palsImage,
			  palsAlternatives: setData.palsAlternatives,
			  relicsImage: setData.relicsImage,
			  relicsAlternatives: setData.relicsAlternatives,
			  talents: setData.talents,
			  mounts: setData.mounts,
			  artifacts: setData.artifacts,
			  accessories: setData.accessories,
			  avians: setData.avians,
			  sectionId: section.id, // Lier le set à la section parente
			},
			create: {
			  id: setData.id || undefined,
			  title: setData.title,
			  standardImage: setData.standardImage,
			  opponentImage: setData.opponentImage,
			  opponentSpells: setData.opponentSpells,
			  explanation: setData.explanation,
			  timings: setData.timings,
			  alternatives: setData.alternatives,
			  palsImage: setData.palsImage,
			  palsAlternatives: setData.palsAlternatives,
			  relicsImage: setData.relicsImage,
			  relicsAlternatives: setData.relicsAlternatives,
			  talents: setData.talents,
			  mounts: setData.mounts,
			  artifacts: setData.artifacts,
			  accessories: setData.accessories,
			  avians: setData.avians,
			  sectionId: section.id, // Lier le set à la section parente
			},
		  });
		}
	  }
	}
  }



updateSectionsAndSets() // Pass the ID of the post you want to update
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
