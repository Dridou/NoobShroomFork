const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createPost() {
  const newPost = await prisma.post.create({
    data: {
      slug: "arrowgod-class-guide",
      title: "Legend of Mushrooms - Arrowgod class guide",
      user: {
        connect: {
          email: "aneboncarle@hotmail.fr"
        }
      },
      img: "",
      createdAt: new Date("2024-07-31T00:00:00.000Z"),
      desc: "Discover the most in depth guide for the Arrowgod class in Legend of Mushrooms and learn how to master it.",
      cat: {
        connect: {
          slug: "class-guide"
        }
      },
      sections: {
        create: [
          { title: 'Introduction', content: '' },
          { title: 'Who am I ?', content: '' },
          { title: 'Kitsu adventure levels', content: '' },
          { title: 'Guide important information', content: '' },
          { title: 'Class presentation', content: '' },
          { title: 'Stats to focus on', content: '' },
          { title: 'Gear rarity upgrade', content: '' },
          { title: 'Stats ratio', content: '' },
          { title: 'Offensive Spells', content: '' },
          { title: 'Crowd Control Spells', content: '' },
          { title: 'Defensive Spells', content: '' },
          { title: 'Useless pals', content: '' },
          { title: 'Situational pals', content: '' },
          { title: 'Essential pals', content: '' },
          { title: 'Relics', content: '' },
          { title: 'Statue', content: '' },
          { title: 'Souls', content: '' },
          { title: 'Talents', content: '' },
          { title: 'Awakening nodes', content: '' },
        ],
      },
    },
    include: {
      sections: true,
    },
  });

  console.log('Post created with sections:', newPost);
  return newPost;
}

createPost()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
