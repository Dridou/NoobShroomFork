import prisma from "@/utils/connect";

export default async function handler(req, res) {
	if (req.method === 'POST') {
	  try {
		const { title, content, icon, displayOrder, postId } = req.body;
		const newSection = await prisma.section.create({
		  data: { title, content, icon, displayOrder, postId },
		});
		res.status(201).json(newSection);
	  } catch (error) {
		res.status(500).json({ error: 'Unable to create section' });
	  }
	} else {
	  res.setHeader('Allow', ['POST']);
	  res.status(405).end(`Method ${req.method} Not Allowed`);
	}
  }