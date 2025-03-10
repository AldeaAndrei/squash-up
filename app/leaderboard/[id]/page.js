import DownloadSection from "@/components/DownloadSection";
import LeaderboardList from "@/components/LeaderboardList";
import NavigationButton from "@/components/NavigationButton";

export default async function LeaderboardPage({ params }) {
  const { id } = await params;

  return (
    <div className="p-2">
      <section className="my-5">
        <NavigationButton path={`/tournament/${id}`} text="Scoruri" />
      </section>
      <section className="flex flex-col gap-2">
        <LeaderboardList tournamentId={id} />
      </section>
    </div>
  );
}
