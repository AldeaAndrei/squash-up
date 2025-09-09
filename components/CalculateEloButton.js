"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import ConfirmationModal from "./v1/ConfirmationModal";

export default function CalculateEloButton({ tournamentId, isDisabled }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCalculateElo = async () => {
    try {
      await calculateEloForTournament();
      window.location.reload();
    } catch (err) {
      console.error("Failed to calculate ELO:", err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setLoading(false);
  };

  return (
    <div>
      <Button
        onClick={() => {
          setIsModalOpen(true);
        }}
        disabled={isDisabled}
      >
        <div className="flex flex-row justify-center items-center w-32">
          {loading ? "..." : isDisabled ? "Done" : "Calculate ELO"}
        </div>
      </Button>
      {isModalOpen && (
        <ConfirmationModal
          title={"Calculate ELO"}
          description={
            "This action will lock the tournament's scores and cannot be undone."
          }
          confirmAction={handleCalculateElo}
          closeAction={handleClose}
          loading={loading}
        />
      )}
    </div>
  );
}
