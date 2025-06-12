"use client";

import { Fragment, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import { Modal } from "@mui/material";
import SimpleButton from "./SimpleButton";

export default function DeleteTournamentButton({ tournamentId }) {
  const [isClient, setIsClient] = useState(false);
  const [routerReady, setRouterReady] = useState(false);
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const deleteTournamentAndReload = () => {
    const deleteTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${tournamentId}`, {
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

    deleteTournament()
      .then(() => {
        router.refresh();
      })
      .finally(() => {
        handleClose();
      });
  };

  useEffect(() => {
    setIsClient(true);
    if (router) {
      setRouterReady(true);
    }
  }, [router]);

  if (!isClient || !routerReady) return null;

  return (
    <Fragment>
      <button
        className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 max-w-10 border border-[#292929] rounded flex justify-center items-center"
        onClick={() => handleOpen()}
      >
        <DeleteIcon sx={{ color: red[500] }} />
      </button>
      <Modal open={isModalOpen} onClose={handleClose}>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="flex flex-col justify-center items-center text-center gap-5 bg-[#1e2021] border-2 border-black shadow-lg p-4 w-96 rounded-lg">
            <h1 className="font-semibold text-2xl">Stergi turneul ?</h1>
            <div className="flex justify-center items-center gap-2">
              <SimpleButton
                text={"Sterge"}
                onClick={() => deleteTournamentAndReload()}
              />
              <SimpleButton text={"Renunta"} onClick={() => handleClose()} />
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
