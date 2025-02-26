import AddRoundButton from "@/components/AddRoundButton";
import GameList from "@/components/GameList";
import NavigationButton from "@/components/NavigationButton";

export default function MatchPage() {
  return (
    <div className="p-2">
      <section className="my-5">
        <div className="flex gap-2 justify-center items-center">
          <NavigationButton path="/leaderboard" text="" />
          <AddRoundButton />
          <NavigationButton path="/start" text="Joc Nou" />
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <GameList />
      </section>
    </div>
  );
}
