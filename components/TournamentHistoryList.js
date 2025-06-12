import { Fragment } from "react";
import { getAll } from "@/app/api/tournaments/utils/getAll";
import ViewTournamentButton from "./ViewTournamentButton";
import DeleteTournamentButton from "./DeleteTournamentButton";

export default async function TournamentsHistoryList() {
  const tournaments = await getAll();

  return (
    <Fragment>
      <div className="flex flex-col justify-start items-center mb-10">
        <ul className="overflow-scroll-y flex flex-col gap-2 justify-center items-center">
          {Object.values(tournaments)
            .sort((t1, t2) => new Date(t2.created_at) - new Date(t1.created_at))
            .map((t) => {
              return (
                <li
                  className="flex flex-col bg-[#1e2021] items-start px-3 py-2 rounded-xl w-80 h-52"
                  key={t.id}
                >
                  <div className="flex justify-between w-full h-full">
                    <div className="flex flex-col flex-[4] w-full">
                      <div className="text-gray-400">Data:</div>
                      <div>
                        {new Date(t.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <br />
                      <div className="text-gray-400">
                        Jucat de ({t.players.length}):
                      </div>
                      <div className="max-w-full line-clamp-3">
                        {t.players.join(", ")}
                      </div>
                    </div>
                    <div className="flex flex-col items-center flex-[1]">
                      <ViewTournamentButton tournamentId={t.id} />
                      {/* <DeleteTournamentButton tournamentId={t.id} /> */}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </Fragment>
  );
}
