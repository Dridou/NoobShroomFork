import prisma from "@/utils/connect";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const section = await prisma.section.findUnique({
      where: { id },
    });
    if (!section) {
      return new Response(JSON.stringify({ error: "Section not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(section), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to retrieve section" }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { title, content, icon, displayOrder } = await req.json();

  try {
    const updatedSection = await prisma.section.update({
      where: { id },
      data: { title, content, icon, displayOrder },
    });
    return new Response(JSON.stringify(updatedSection), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to update section" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await prisma.section.delete({
      where: { id },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to delete section" }), {
      status: 500,
    });
  }
}
