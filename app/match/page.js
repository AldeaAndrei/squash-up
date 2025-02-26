import AddRoundButton from "@/components/AddRoundButton";
import GameList from "@/components/GameList";
import NavigationButton from "@/components/NavigationButton";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CachedIcon from "@mui/icons-material/Cached";

export default function MatchPage() {
  return (
    <div className="p-2">
      <section className="my-5">
        <div className="flex gap-2 justify-center items-center">
          <NavigationButton path="/leaderboard" text="Clasament">
            <LeaderboardIcon />
          </NavigationButton>
          <AddRoundButton />
          <NavigationButton path="/start" text="Reseteaza Joc">
            <CachedIcon />
            <span className="ml-1">Joc nou</span>
          </NavigationButton>
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <GameList />
      </section>
    </div>
  );
}
