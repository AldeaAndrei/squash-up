"use client";

import { Fragment, useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { generateNewTournament } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import WaitingModal from "./v1/WaitingModal";

export default function StartGameButton() {
  const router = useRouter();
  const { player } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleRedirect = (id) => {
    router.push(`/tournament/${id}`);
  };

  const generateGamesAndRedirect = async () => {
    try {
      setLoading(true);
      const res = await generateNewTournament(player);
      if (res?.id) handleRedirect(res.id);
    } catch (error) {
      console.error("Error generating tournament:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Button
        variant="outline"
        className="bg-green-400 dark:bg-green-800"
        onClick={generateGamesAndRedirect}
        disabled={loading}
      >
        {loading ? "Starting..." : "Start tournament"}
      </Button>

      {loading && (
        <WaitingModal
          title="Just a moment..."
          description="Your tournament is being created"
        />
      )}
    </Fragment>
  );
}
