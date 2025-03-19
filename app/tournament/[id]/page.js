import GameList from "@/components/GameList";
import NavBar from "@/components/NavBar";

export default async function TournamentPage({ params }) {
  const { id } = await params;

  return (
    <div className="p-2">
      <section className="mt-2 mb-5">
        <NavBar tournamentId={id} />
      </section>
      <section className="flex flex-col gap-2">
        <GameList tournamentId={id} />
      </section>
    </div>
  );
}
