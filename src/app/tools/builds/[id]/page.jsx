import ViewBuild from "@/components/tools/ViewBuild/ViewBuild";

export const metadata = {
  title: "Talent Build | NoobShroom",
  description: "View talent build details",
};

export default function BuildPage({ params }) {
  const { id } = params;

  return <ViewBuild buildId={id} />;
}
