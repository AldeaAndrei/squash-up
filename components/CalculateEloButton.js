"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export default function CalculateEloButton({ tournamentId, isDisabled }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <Button
      onClick={() => {
        calculateEloForTournament();
        router.refresh();
      }}
      disabled={isDisabled}
    >
      <div className="flex flex-row justify-center items-center w-32">
        {loading ? "..." : isDisabled ? "Done" : "Calculate ELO"}
      </div>
    </Button>
  );
}
