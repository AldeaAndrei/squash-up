import AddRoundButton from "@/components/AddRoundButton";
import GameList from "@/components/GameList";
import NavigationButton from "@/components/NavigationButton";
import NewGameButton from "@/components/NewGameButton";

export default async function TournamentPage({ params }) {
  const { id } = await params;

  return (
    <div className="p-2">
      <section className="my-5">
        <div className="flex gap-2 justify-center items-center">
          <NavigationButton path={`/leaderboard/${id}`} text="" />
          <AddRoundButton tournamentId={id} />
          <NewGameButton />
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <GameList tournamentId={id} />
      </section>
    </div>
  );
}
