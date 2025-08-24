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

export default function TournamentPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/v1/tournaments/${id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setTournament(data.tournament);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-2">Loading...</div>;
  if (!tournament) return <div className="p-2">Tournament not found</div>;

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="p-2">
      {tournament.games.map((game, index) => {
        const isOpen = openSections[index] || false;
        return (
          // <Collapsible key={game.id} open={isOpen} className="py-2">
          //   <CollapsibleTrigger onClick={() => toggleSection(index)}>
          //     <div className="w-full p-1 flex justify-center items-center cursor-pointer">
          //       <ChevronDown
          //         className={`transition-transform ${
          //           isOpen ? "rotate-180" : "rotate-0"
          //         }`}
          //       />
          //       <p className="ml-2">Game {index + 1}</p>
          //     </div>
          //   </CollapsibleTrigger>
          //   <CollapsibleContent>
          <div>
            {game.rounds.map((round) => (
              <RoundCard key={round.id} round={round} />
            ))}
          </div>
          //   </CollapsibleContent>
          // </Collapsible>
        );
      })}
    </div>
  );
}
