"use client";

import { useRouter } from "next/navigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addGameToTournament } from "@/app/utils/utils";
import { useEffect, useState } from "react";

export default function AddRoundButton() {
  const router = useRouter();
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${params.tournamentId}`);

        if (response.ok) {
          const data = await response.json();

          const now = new Date(); // Get current date and time
          const twentyFourHoursAgo = new Date(
            now.getTime() - 24 * 60 * 60 * 1000
          ); // Subtract 24 hours
          setIsReadOnly(
            new Date(data.tournament.created_at) < twentyFourHoursAgo
          );
        } else {
          console.error("Failed to fetch tournament data");
        }
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      }
    };

    fetchTournament();
  }, []);

  const addRoundAndRefresh = async () => {
    addGameToTournament().then((res) => {
      const { id, error } = res;

      if (error) return;

      router.push(`/tournament/${id}`);
      window.location.reload();
    });
  };

  return (
    <button
      className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded"
      onClick={() => addRoundAndRefresh()}
      disabled={isReadOnly}
    >
      <div className="flex flex-row justify-center items-center">
        <AddCircleOutlineIcon />
        <span className="ml-1">Joc</span>
      </div>
    </button>
  );
}
