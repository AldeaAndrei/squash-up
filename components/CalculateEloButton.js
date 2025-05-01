"use client";

import { useState } from "react";

export default function CalculateEloButton({
  tournamentId,
  fetchData,
  isDisabled,
}) {
  const [loading, setLoading] = useState(false);

  const calculateEloForTournament = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/elo/calculate/tournament/${tournamentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (response.ok) {
        const data = await response.json();
      } else {
        console.error("Failed to fetch tournament data");
      }
    } catch (error) {
      console.error("Error fetching tournament data:", error);
    } finally {
      setLoading(false);
      fetchData();
    }
  };

  return (
    <button
      className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded"
      onClick={() => calculateEloForTournament()}
      disabled={isDisabled}
    >
      <div className="flex flex-row justify-center items-center w-32">
        {loading ? "..." : "Calculeaza ELO"}
      </div>
    </button>
  );
}
