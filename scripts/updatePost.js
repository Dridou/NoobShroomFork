const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Load data from JSON files
const sectionsData = JSON.parse(fs.readFileSync('./sectionsData.json', 'utf-8'));
const setsData = JSON.parse(fs.readFileSync('./darkWarriorSet.json', 'utf-8'));

async function updateSectionsAndSets(postId, sectionsData, setsData) {
  // Fetch the post along with its sections and sets
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { sections: { include: { sets: true }}},
  });

  if (!post) {
    throw new Error(`Post with ID ${postId} not found`);
  }

  // Update or create sections
  for (const sectionData of sectionsData) {
    let section = null;
    const existingSection = post.sections.find(
      (sec) => sec.title === sectionData.title
    );

    if (existingSection) {
      // Update existing section
      section = await prisma.section.update({
        where: { id: existingSection.id },
        data: {
          title: sectionData.title,
          content: sectionData.content,
          type: sectionData.type || "text",
        },
      });
    } else {
      // Create new section
      section = await prisma.section.create({
        data: {
          title: sectionData.title,
          content: sectionData.content,
          type: sectionData.type || "text",
          postId: postId,
        },
      });
    }

	console.log(section)
	if (!existingSection.sets) {
		existingSection.sets = [];
	  }

    // Update or create sets for the section
    const sectionSets = setsData.filter((set) => set.title === sectionData.title);

	console.log("y");
	 // Update sets for the current section
    for (const setData of sectionSets) {
      const existingSet = section.sets.find((set) => set.title === setData.title);
	  console.log("x");
      if (existingSet) {
        await prisma.set.update({
          where: { id: existingSet.id },
          data: {
            ...setData,
            sectionId: section.id,
          },
        });
		console.log("Set updated");
      } else {
        await prisma.set.create({
          data: {
            ...setData,
            sectionId: section.id,
            postId: postId,
          },
        });
		console.log("Set created");
      }
    }
  }

  console.log("Sections and sets updated successfully");
}



updateSectionsAndSets("clz9n88l60000ynoiwwz3fqu0", sectionsData, darkWarriorData) // Pass the ID of the post you want to update
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
