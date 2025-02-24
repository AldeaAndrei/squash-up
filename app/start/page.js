import PlayersList from "@/components/PlayersList";
import StartGameButton from "@/components/StartGameButton";

export default function LandingPage() {
  return (
    <div className="p-2">
      <section className="my-5">
        <StartGameButton />
      </section>
      <section className="flex flex-col gap-2">
        <PlayersList />
      </section>
    </div>
  );
}
