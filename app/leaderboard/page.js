import LeaderboardList from "@/components/LeaderboardList";
import NavigationButton from "@/components/NavigationButton";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";

export default function LeaderboardPage() {
  return (
    <div className="p-2">
      <section className="my-5">
        <NavigationButton path="/match" text="Scoruri">
          <ScoreboardIcon />
          <span className="ml-1">Scoruri</span>
        </NavigationButton>
      </section>
      <section className="flex flex-col gap-2">
        <LeaderboardList />
      </section>
    </div>
  );
}
