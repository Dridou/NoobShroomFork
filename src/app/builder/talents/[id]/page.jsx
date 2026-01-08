import TalentBuilder from "@/components/builder/talents/TalentBuilder";

export default function TalentBuilderDetailPage({ params }) {
  return <TalentBuilder buildId={params.id} />;
}
