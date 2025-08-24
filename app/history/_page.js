import NavBar from "@/components/NavBar";
import { Suspense } from "react";
import Loading from "./loading";
import TournamentsHistoryList from "@/components/TournamentHistoryList";

export default function HistoryPage() {
  return (
    <div>
      <section className="mt-2 mb-5">
        <NavBar />
      </section>
      <section>
        <Suspense fallback={<Loading />}>
          <TournamentsHistoryList />
        </Suspense>
      </section>
    </div>
  );
}
