import NavBar from "@/components/NavBar";
import PlayersList from "@/components/PlayersList";

export default function LandingPage() {
  return (
    <div className="p-2">
      <section className="mt-2 mb-5">
        <NavBar />
      </section>
      <section className="flex flex-col gap-2">
        <PlayersList />
      </section>
    </div>
  );
}
