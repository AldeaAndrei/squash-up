import LeaderboardList from "@/components/LeaderboardList";
import NavBar from "@/components/NavBar";

export default async function LeaderboardPage({ params }) {
  const { id } = await params;

  return (
    <div className="p-2">
      <section className="mt-2 mb-5">
        <NavBar tournamentId={id} />
      </section>
      <section className="flex flex-col gap-2">
        <LeaderboardList tournamentId={id} />
      </section>
    </div>
  );
}
