import NavBar from "@/components/NavBar";
import TournamentsHistoryList from "@/components/TournamentsHistoryList";

export default function HistoryPage() {
  return (
    <div>
      <section className="mt-2 mb-5">
        <NavBar />
      </section>
      <section>
        <TournamentsHistoryList />
      </section>
    </div>
  );
}
