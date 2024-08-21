import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// GET SINGLE POST
export const GET = async (req, { params }) => {
  const { slug } = params;

  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: { user: true , sections: true},
    });

    return new NextResponse(JSON.stringify(post,
		{
			status: 200
		}));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// UPDATE POST
// export const PUT = async (req, { params }) => {
// 	const { slug } = params;
// 	const data = await req.json();

// 	try {
// 	  const updatedPost = await prisma.post.update({
// 		where: { slug },
// 		data: {
// 		  title: data.title,
// 		  desc: data.desc,
// 		  img: data.img,
// 		  sections: {
// 			upsert: data.sections.map(section => ({
// 			  where: { id: section.id },
// 			  update: {
// 				title: section.title,
// 				content: section.content,
// 				icon: section.icon,
// 			  },
// 			  create: {
// 				title: section.title,
// 				content: section.content,
// 				icon: section.icon,
// 			  }
// 			}))
// 		  },
// 		  cat: {
// 			connect: { slug: data.catSlug }
// 		  },
// 		  user: {
// 			connect: { email: data.userEmail }
// 		  }
// 		},
// 	  });

// 	  return new NextResponse(JSON.stringify(updatedPost), { status: 200 });
// 	} catch (err) {
// 	  console.log(err);
// 	  return new NextResponse(
// 		JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
// 	  );
// 	}
//   };