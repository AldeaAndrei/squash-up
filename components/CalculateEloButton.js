"use client";

import { useRouter, usePathname } from "next/navigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addGameToTournament } from "@/app/utils/utils";
import { useEffect, useState } from "react";

export default function CalculateEloButton({ tournamentId }) {
  const router = useRouter();

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${tournamentId}`);

        if (response.ok) {
          const data = await response.json();

          console.log(data);
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
      //   onClick={() => {}}
      //   disabled={eloDone}
    >
      <div className="flex flex-row justify-center items-center">
        Calculeaza ELO
      </div>
    </button>
  );
}
