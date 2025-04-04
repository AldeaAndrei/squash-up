"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, Fragment } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { green, red } from "@mui/material/colors";
import { Modal } from "@mui/material";
import SimpleButton from "./SimpleButton";

export default function TournamentsHistoryList() {
  const [tournaments, setTournaments] = useState([]);
  const [tournamentDeleteId, setTournamentDeleteId] = useState(null);
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpen = (id) => {
    setTournamentDeleteId(id);
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);

  const fetchTournaments = async () => {
    try {
      const response = await fetch(`/api/tournaments/`);

      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
      } else {
        console.error("Failed to fetch tournaments data");
      }
    } catch (error) {
      console.error("Error fetching tournaments data:", error);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const deleteTournamentAndReload = (id) => {
    const deleteTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error deleting tournament");
        }

        return await response.json();
      } catch (error) {
        console.error("Error deleting tournament", error);
        return null;
      }
    };

    deleteTournament(id)
      .then(() => {
        fetchTournaments();
      })
      .finally(() => {
        setTournamentDeleteId(null);
        handleClose();
      });
  };

  return (
    <Fragment>
      <div className="flex flex-col justify-start items-center mb-10">
        <ul className="overflow-scroll-y flex flex-col gap-2 justify-center items-center">
          {Object.values(tournaments)
            .sort((t1, t2) => new Date(t2.created_at) - new Date(t1.created_at))
            .map((t) => {
              return (
                <li
                  className="flex flex-col bg-[#1e2021] items-start px-3 py-2 rounded-xl w-80"
                  key={t.id}
                >
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col flex-[4]">
                      <div className="text-gray-400">Data:</div>
                      <div>
                        {new Date(t.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <br />
                      <div className="text-gray-400">Jucat de:</div>
                      <div className="max-w-full">{t.players.join(", ")}</div>
                    </div>
                    <div className="flex flex-col items-center flex-[1]">
                      <button
                        className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 max-w-10 border border-[#292929] rounded flex justify-center items-center"
                        onClick={() => router.push(`/tournament/${t.id}`)}
                      >
                        <VisibilityIcon sx={{ color: green[500] }} />
                      </button>
                      {/* <button
                        className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 max-w-10 border border-[#292929] rounded flex justify-center items-center"
                        onClick={() => handleOpen(t.id)}
                      >
                        <DeleteIcon sx={{ color: red[500] }} />
                      </button> */}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
      <Modal open={isModalOpen} onClose={handleClose}>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="flex flex-col justify-center items-center text-center gap-5 bg-[#1e2021] border-2 border-black shadow-lg p-4 w-96 rounded-lg">
            <h1 className="font-semibold text-2xl">Stergi turneul ?</h1>
            <div className="flex justify-center items-center gap-2">
              <SimpleButton
                text={"Sterge"}
                onClick={() => deleteTournamentAndReload(tournamentDeleteId)}
              />
              <SimpleButton text={"Renunta"} onClick={() => handleClose()} />
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
