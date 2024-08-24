const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

console.log("Updating post...");

// Load data from JSON files
const sectionsData = JSON.parse(
  fs.readFileSync("./crossbowGuide.json", "utf-8")
);

async function updateSectionsAndSets() {
  console.log("Updating sections and sets...");
  for (const sectionData of sectionsData) {
    // Trouver la section existante par son titre
    let section = await prisma.section.findFirst({
      where: { title: sectionData.title, postId: sectionData.postId },
      include: {
        sets: true,
        tables: { include: { rows: true } },
      },
    });

    if (section) {
      console.log("--Updating section");
      //   console.log("sectiondata id: " + sectionData.id);
      section = await prisma.section.update({
        where: { id: section.id },
        data: {
          title: sectionData.title,
          content: sectionData.content,
          type: sectionData.type || "text", // Utiliser une valeur par défaut si `type` est indéfini
          postId: sectionData.postId,
		  icon: sectionData.icon,
          displayOrder: sectionData.displayOrder,
        },
      });
    } else {
      console.log("--Creating section");
      //   console.log("sectiondata id: " + sectionData.id);
      section = await prisma.section.create({
        data: {
          title: sectionData.title,
          content: sectionData.content,
		  icon: sectionData.icon,
          type: sectionData.type || "text", // Utiliser une valeur par défaut si `type` est indéfini
          postId: sectionData.postId, // Assurez-vous que `postId` est défini dans votre JSON
          displayOrder: sectionData.displayOrder,
        },
      });
    }

    // Ajouter ou mettre à jour les sets pour chaque section
    if (sectionData.sets && sectionData.sets.length > 0) {
      for (const setData of sectionData.sets) {
        let set = await prisma.set.findFirst({
          where: { title: setData.title },
        });

        if (set) {
		  console.log("----Updating set");
          await prisma.set.update({
            where: { id: set.id },
            data: {
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
			  talentImage: setData.talentImage,
			  talents: setData.talents,
              mounts: setData.mounts,
              artifacts: setData.artifacts,
              accessories: setData.accessories,
              avians: setData.avians,
              sectionId: section.id, // Lier le set à la section parente
            },
          });
        } else {
			console.log("----Creating set");
          await prisma.set.create({
            data: {
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
			  talentImage: setData.talentImage,
			  talents: setData.talents,
              mounts: setData.mounts,
              artifacts: setData.artifacts,
              accessories: setData.accessories,
              avians: setData.avians,
              sectionId: section.id,
            },
          });
        }
      }
    }

    if (sectionData.tables && sectionData.tables.length > 0) {
      for (const tableData of sectionData.tables) {
        // Trouver la table existante par son titre et la sectionId
        let table = await prisma.table.findFirst({
          where: { title: tableData.title, sectionId: section.id },
        });

        if (table) {
			console.log("------Updating table");
          table = await prisma.table.update({
            where: { id: table.id }, // Utilisation de l'ID pour la mise à jour
            data: {
              title: tableData.title,
              sectionId: section.id,
            },
          });
        } else {
			console.log("------Creating table");
          table = await prisma.table.create({
            data: {
              title: tableData.title,
              sectionId: section.id,
            },
          });
        }

        if (tableData.rows && tableData.rows.length > 0) {
          for (const rowData of tableData.rows) {
            // Trouver la row existante par son stat et tableId
            let row = await prisma.tableRow.findFirst({
              where: { stat: rowData.stat, tableId: table.id },
            });

            if (row) {
				console.log("--------Updating row");
              await prisma.tableRow.update({
                where: { id: row.id }, // Utilisation de l'ID pour la mise à jour
                data: {
                  stat: rowData.stat,
                  explanation: rowData.explanation,
                  tableId: table.id,
                },
              });
            } else {
				console.log("--------Creating row");
              await prisma.tableRow.create({
                data: {
                  stat: rowData.stat,
                  explanation: rowData.explanation,
                  tableId: table.id,
                },
              });
            }
          }
        }
      }
    }
  }
}

// async function fixSections() {
// 	try {
// 	  // Fetch all sections where postId is null
// 	  const sectionsWithNullPostId = await prisma.section.findMany({
// 		where: {
// 		//   postId: null,
// 		},
// 	  });

// 	  console.log("Sections with null postId:", sectionsWithNullPostId);

// 	  // Here you can manually update the postId for each section
// 	  for (const section of sectionsWithNullPostId) {
// 		// Update the postId with a valid value
// 		await prisma.section.update({
// 		  where: { id: section.id },
// 		  data: { postId: 'clz9n88l60000ynoiwwz3fqu0' }, // Replace 'valid-post-id' with an actual post ID
// 		});
// 	  }

// 	  console.log("Fixed sections with null postId.");
// 	} catch (error) {
// 	  console.error("Error fixing sections:", error);
// 	} finally {
// 	  await prisma.$disconnect();
// 	}
//   }

//   fixSections();

updateSectionsAndSets()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
