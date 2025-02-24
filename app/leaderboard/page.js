import LeaderboardList from "@/components/LeaderboardList";
import NavigationButton from "@/components/NavigationButton";

export default function LeaderboardPage() {
  return (
    <div className="p-2">
      <section className="my-5">
        <NavigationButton path="/match" text="Scoruri" />
      </section>
      <section className="flex flex-col gap-2">
        <LeaderboardList />
      </section>
    </div>
  );
}
