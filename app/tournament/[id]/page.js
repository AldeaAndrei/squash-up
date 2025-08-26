"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import RoundCard from "@/components/v1/RoundCard";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import CalculateEloButton from "@/components/CalculateEloButton";

export default function TournamentPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [roundsPlayedPercentage, setRoundsPlayedPercentage] = useState(0);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const fetchTournament = async () => {
      try {
        const res = await fetch(`/api/v1/tournaments/${id}`, {
          cache: "no-store",
        });
        const data = await res.json();

        setTournament(data.tournament);

        initOpenSections(data.tournament);
        checkReadOnly(data.tournament);
        analyzeRounds(data.tournament);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const analyzeRounds = (tournament) => {
    if (!tournament?.games?.length) {
      setRoundsPlayed(0);
      setRoundsPlayedPercentage(0);
      return;
    }

    let totalRounds = 0;
    let roundsWithWinner = 0;

    tournament.games.forEach((game) => {
      (game.rounds || []).forEach((round) => {
        totalRounds += 1;
        const sets = round.sets || [];
        const half = Math.ceil(sets.length / 2);

        const player1Wins = sets.filter(
          (set) => set.player_1_score > set.player_2_score
        ).length;
        const player2Wins = sets.filter(
          (set) => set.player_2_score > set.player_1_score
        ).length;

        if (player1Wins >= half || player2Wins >= half) {
          roundsWithWinner++;
        }
      });
    });

    setRoundsPlayed(roundsWithWinner);
    setRoundsPlayedPercentage(
      totalRounds ? ((roundsWithWinner / totalRounds) * 100).toFixed(1) : 0
    );
  };

  const initOpenSections = (tournament) => {
    if (!tournament?.games?.length) return;

    const sortedGames = [...tournament.games].sort(
      (a, b) => parseInt(b.id) - parseInt(a.id)
    );

    const initialSections = sortedGames.reduce((acc, _, i) => {
      acc[i] = i === 0;
      return acc;
    }, {});

    setOpenSections(initialSections);
  };

  const checkReadOnly = (tournament) => {
    if (!tournament?.games?.length) return;

    const allRounds = tournament.games.flatMap((game) => game.rounds || []);
    const hasUsedForElo = allRounds.some(
      (round) => round.used_for_elo === true
    );

    if (hasUsedForElo) {
      setIsReadOnly(true);
    } else {
      setIsReadOnly(false);
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) return <div className="p-2">Loading...</div>;
  if (!tournament) return <div className="p-2">Tournament not found</div>;

  return (
    <div className="p-2">
      <div className="w-full h-12 flex">
        <div className="flex-1 w-full h-full flex justify-center items-center font-semibold">
          {roundsPlayedPercentage}% Played
        </div>
        <div className="flex-1 w-full h-full flex justify-center items-center">
          {!isReadOnly && (
            <CalculateEloButton tournamentId={id} isDisabled={isReadOnly} />
          )}
        </div>
      </div>
      <div>
        {[...tournament?.games]
          .sort((a, b) => Number(b.id) - Number(a.id))
          .map((game, index) => {
            const isOpen = openSections[index] || false;
            return (
              <Collapsible key={game.id} open={isOpen} className="py-2">
                <CollapsibleTrigger onClick={() => toggleSection(index)}>
                  <div className="w-full p-1 flex justify-center items-center cursor-pointer">
                    <ChevronDown
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                    <p className="ml-2">
                      Game {tournament?.games?.length - index}
                    </p>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div>
                    {[...game.rounds]
                      .sort((a, b) => Number(a.id) - Number(b.id))
                      .map((round) => (
                        <RoundCard key={round.id} round={round} />
                      ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
      </div>
    </div>
  );
}
