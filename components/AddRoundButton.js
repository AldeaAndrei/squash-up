"use client";

import { useRouter, usePathname } from "next/navigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addGameToTournament } from "@/app/utils/utils";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/authStore";

export default function AddRoundButton({ noText, tournamentId }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReadOnly, setIsReadOnly] = useState(false);
  const { player } = useAuthStore();

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${tournamentId}`);

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
    addGameToTournament(player, tournamentId).then((res) => {
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
        {!noText && <span className="ml-1">Joc</span>}
      </div>
    </button>
  );
}
