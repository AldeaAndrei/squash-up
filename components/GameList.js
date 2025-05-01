"use client";

import { useEffect, useState } from "react";
import GameListElement from "./GameListElement";
import LockIcon from "@mui/icons-material/Lock";
import CalculateEloButton from "./CalculateEloButton";

export default function GameList(params) {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [tournament, setTournament] = useState();
  const [eloHistory, setEloHistory] = useState();
  const [isReadOnly, setIsReadOnly] = useState(false);

  const fetchTournament = async () => {
    try {
      const response = await fetch(`/api/tournaments/${params.tournamentId}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setTournament(data.tournament);

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

  const fetchTournamentPlayers = async () => {
    try {
      const response = await fetch(
        `/api/tournaments/${params.tournamentId}/players`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const data = await response.json();
        setPlayers(
          data.players.reduce((map, player) => {
            map[player.id] = player.name;
            return map;
          }, {})
        );
      } else {
        console.error("Failed to fetch tournament players data");
      }
    } catch (error) {
      console.error("Error fetching tournament players data:", error);
    }
  };

  const fetchTournamentEloHistory = async () => {
    try {
      const response = await fetch(
        `/api/elo/history/tournaments/${params.tournamentId}`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const data = await response.json();
        const eloHash = {};

        data.forEach((eloData) => {
          eloHash[`${eloData.round_id}-${eloData.player_id}`] = eloData.elo;
        });

        setEloHistory(eloHash);
      } else {
        console.error("Failed to fetch tournament elo history data");
      }
    } catch (error) {
      console.error("Error fetching tournament elo history data:", error);
    }
  };

  const fetchData = async () => {
    await fetchTournamentPlayers();
    await fetchTournament();
    await fetchTournamentEloHistory();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const storedGames = localStorage.getItem("games");
    if (storedGames) {
      try {
        setGames(JSON.parse(storedGames));
      } catch (error) {
        setGames([]);
      }
    }
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      localStorage.setItem("games", JSON.stringify(games));
    }
  }, [games]);

  return (
    <ul className="overflow-scroll-y flex flex-col gap-2 justify-center items-center">
      {isReadOnly && (
        <div className="flex flex-row items-start justify-start gap-5 p-2 mx-2 bg-red-300/15 border-red-300 border rounded-xl font-semibold">
          <LockIcon />
          <p>Turneul este mai vechi de 24h si nu poate fi modificat</p>
        </div>
      )}
      <div>
        {!isReadOnly && (
          <CalculateEloButton
            tournamentId={params.tournamentId}
            fetchData={fetchData}
            isDisabled={isReadOnly}
          />
        )}
      </div>
      {tournament &&
        tournament.games.map((game, index) => {
          return (
            <ul
              key={`game-${index}`}
              className="overflow-scroll-y flex flex-col gap-2 justify-center items-center"
            >
              <div className="flex flex-row w-full justify-center items-center">
                <div className="flex-grow bg-white h-[1px] rounded-full" />
                <div className="px-2">Joc {index + 1}</div>
                <div className="flex-grow bg-white h-[1px] rounded-full" />
              </div>
              {game.rounds.map((round, index) => {
                return (
                  <div key={`element-${index}`}>
                    <GameListElement
                      key={index}
                      round={round}
                      players={players}
                      eloHistory={eloHistory}
                      player1ValuesProps={round.sets.map(
                        (set) => set.player_1_score
                      )}
                      player2ValuesProps={round.sets.map(
                        (set) => set.player_2_score
                      )}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                );
              })}
            </ul>
          );
        })}
    </ul>
  );
}
