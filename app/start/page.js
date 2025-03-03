import PlayersList from "@/components/PlayersList";
import SetGameTypeButton from "@/components/SetGameTypeButton";
import StartGameButton from "@/components/StartGameButton";

export default function LandingPage() {
  return (
    <div className="p-2">
      <section className="my-5 flex gap-2">
        <StartGameButton />
        <SetGameTypeButton />
      </section>
      <section className="flex flex-col gap-2">
        <PlayersList />
      </section>
    </div>
  );
}
