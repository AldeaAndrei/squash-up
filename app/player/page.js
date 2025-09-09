"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Input } from "@/components/ui/input";

export default function PlayerPage() {
  const { player } = useAuthStore();
  const [playerData, setPlayerData] = useState({});
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [searchedPlayerName, setSearchedPlayerName] = useState(null);
  const [similarPlayers, setSimilarPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerName, setSelectedPlayerName] = useState(null);

  async function fetchHistory() {
    if (!player) return;

    let path = `/api/v1/elo?page=${page}&perPage=10&playerId=${player}`;

    if (selectedPlayer) {
      path += `&opponent=${selectedPlayer}`;
    }

    const res = await fetch(path, {
      cache: "no-store",
    });
    const data = await res.json();

    setHistory(data.eloHistory);
    setTotalPages(data.pagination.totalPages || 1);
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      async function fetchPlayers() {
        try {
          const response = await fetch(
            `/api/players?name=${encodeURIComponent(searchedPlayerName)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            }
          );

          let playersFetched = await response.json();

          playersFetched = playersFetched.filter(
            (fetchedPlayer) =>
              player !== fetchedPlayer.id && selectedPlayer !== fetchedPlayer.id
          );

          setSimilarPlayers(playersFetched);
        } catch (error) {
          console.error("Error fetching players:", error);
        }
      }

      if (searchedPlayerName?.length === 0) setSimilarPlayers([]);

      if (searchedPlayerName && searchedPlayerName?.length > 2) {
        fetchPlayers();
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchedPlayerName]);

  useEffect(() => {
    async function fetchPlayer() {
      if (!player) return;

      const res = await fetch(`/api/players/${player}`, { cache: "no-store" });
      const data = await res.json();

      setPlayerData(data.player);
    }

    async function fetchStatistics() {
      if (!player) return;

      const res = await fetch(`/api/statistics/player/${player}`, {
        cache: "no-store",
      });
      const data = await res.json();

      setStats(data);
    }

    fetchPlayer();
    fetchHistory();
    fetchStatistics();
  }, [player]);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  useEffect(() => {
    fetchHistory();

    setSearchedPlayerName(null);
    setSimilarPlayers([]);
  }, [selectedPlayer]);

  const clearSearchedPlayers = () => {
    setSearchedPlayerName(null);
    setSimilarPlayers([]);
    setSelectedPlayer(null);
    setSelectedPlayerName(null);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      // year: "numeric",
    });
  };

  const chartConfig = {
    count: {
      label: "Count",
      color: "#2563eb",
    },
  };

  return (
    <div className="p-3">
      {playerData?.name && (
        <h1 className="text-2xl w-full align-middle text-center mb-5">
          {playerData.name}
        </h1>
      )}
      <div
        className={`transition-all duration-500 ease-in-out grid w-full gap-3 ${
          isGraphOpen ? "grid-cols-1 grid-rows-1" : "grid-cols-2 grid-rows-2"
        }`}
      >
        {stats?.scoreDistribution ? (
          <Card
            className="w-full aspect-square p-3"
            onClick={() => setIsGraphOpen(!isGraphOpen)}
          >
            <ChartContainer config={chartConfig} className="w-full h-full pb-5">
              {/* <ResponsiveContainer width="100%" height="90%"> */}
              <BarChart data={stats?.scoreDistribution}>
                <XAxis dataKey="score" />
                {/* <YAxis /> */}
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={2}
                  isAnimationActive={false}
                />
              </BarChart>
              {/* </ResponsiveContainer> */}
              <h2 className="text-xs font-extralight text-center">
                Score Distribution
              </h2>
            </ChartContainer>
          </Card>
        ) : (
          <Card className="w-full aspect-square p-3 flex justify-center items-center">
            <Spinner variant="circle" />
          </Card>
        )}
        {!isGraphOpen && (
          <>
            {stats?.bestElo && stats?.worstElo && playerData?.elo ? (
              <Card className="w-full aspect-square p-3">
                <h1 className="text-lg mb-4">ELO range</h1>
                <div>
                  <div className="mb-1">
                    <span className="font-semibold text-xl">
                      {playerData.elo}
                    </span>
                    <span className="font-light ml-2 text-sm">current</span>
                  </div>
                  <div>
                    <span className="font-semibold text-lg">
                      {stats.bestElo}
                    </span>
                    <span className="font-light ml-2 text-sm">max</span>
                  </div>
                  <div>
                    <span className="font-semibold text-lg">
                      {stats.worstElo}
                    </span>
                    <span className="font-light ml-2 text-sm">min</span>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="w-full aspect-square p-3 flex justify-center items-center">
                <Spinner variant="circle" />
              </Card>
            )}
          </>
        )}
        {!isGraphOpen && (
          <>
            {stats?.mostWinsAgainstName &&
            stats?.mostWinsAgainstCount &&
            stats?.mostLossesAgainstName &&
            stats?.mostLossesAgainstCount ? (
              <Card className="w-full aspect-square p-3">
                <div className="flex flex-col justify-start items-center w-full h-full">
                  <p>Most wins against</p>
                  <p className="font-semibold text-lg">
                    {stats.mostWinsAgainstName} ({stats.mostWinsAgainstCount})
                  </p>
                  <br />
                  <p>Most loses against</p>
                  <p className="font-semibold text-lg">
                    {stats.mostLossesAgainstName} (
                    {stats.mostLossesAgainstCount})
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="w-full aspect-square p-3 flex justify-center items-center">
                <Spinner variant="circle" />
              </Card>
            )}
          </>
        )}
        {!isGraphOpen && (
          <>
            {stats?.gamesPlayed && stats?.percentWon && stats?.percentLost ? (
              <Card className="w-full aspect-square p-3 flex flex-col justify-between">
                <div className="flex">
                  <p className="flex-1 flex aspect-square text-center items-center font-semibold text-5xl text-[#2563eb]">
                    {stats.gamesPlayed}
                  </p>
                  <p className="flex-1 flex aspect-square text-center items-center text-sm">
                    Total rounds played
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <p className="flex-1 flex text-center items-center justify-start">
                      Win rate:
                    </p>
                    <p className="flex-1 flex text-center items-center justify-center font-semibold">
                      {(stats.percentWon * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex">
                    <p className="flex-1 flex text-center items-center justify-start">
                      Lose rate:
                    </p>
                    <p className="flex-1 flex text-center items-center justify-center font-semibold">
                      {(stats.percentLost * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="w-full aspect-square p-3 flex justify-center items-center">
                <Spinner variant="circle" />
              </Card>
            )}
          </>
        )}
      </div>
      <div className="justify-start relative z-50 mt-10 p-2">
        <p className="p-1">Filter</p>
        {selectedPlayerName && (
          <div className="flex w-full h-full justify-between items-center">
            <p>Compare with: {selectedPlayerName}</p>
            <Button
              variant="destructive"
              onClick={() => clearSearchedPlayers()}
            >
              Reset
            </Button>
          </div>
        )}
        {!selectedPlayer && !selectedPlayerName && (
          <Input
            className="z-50"
            type="text"
            value={selectedPlayerName ?? searchedPlayerName ?? ""}
            onChange={(e) => setSearchedPlayerName(e.target.value)}
            disabled={selectedPlayerName != null}
            placeholder="Search player..."
          />
        )}
        {similarPlayers?.length > 0 && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        )}
        {similarPlayers?.length > 0 && (
          <Card className="mt-3 absolute w-full max-h-60 overflow-y-scroll top-full z-50">
            <CardHeader className="w-0 h-0 absolute sr-only">
              <CardTitle className="sr-only">Player Search</CardTitle>
              <CardDescription className="sr-only">
                Similar players by name
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 py-1">
              {similarPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => {
                    setSelectedPlayer(player.id);
                    setSelectedPlayerName(player.name);
                  }}
                  className="flex w-full justify-center items-center h-10"
                >
                  <p className="flex-1 text-start">{player.name}</p>
                  <p className="flex-1 text-end">{player.elo}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      <div className="p-1 mt-5 border-t-2">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="h-2">
              <TableHead className="text-start w-[20%] h-5">Status</TableHead>
              <TableHead className="text-start w-[40%] h-5">Opponent</TableHead>
              <TableHead className="text-start w-[20%] h-5">Date</TableHead>
              <TableHead className="text-start w-[20%] h-5">ELO</TableHead>
            </TableRow>
          </TableHeader>
          {history?.length > 0 ? (
            <TableBody>
              {history.map((h) => {
                return (
                  <TableRow key={h.id} className="h-2">
                    <TableCell
                      className={
                        "w-[20%] h-5 text-start font-semibold " +
                        (h.winner_id === player
                          ? "text-green-400"
                          : "text-red-400")
                      }
                    >
                      <span>{h.winner_id === player ? "Won" : "Lost"}</span>
                    </TableCell>
                    <TableCell className="w-[40%] h-5 text-start font-semibold">
                      {h.opponent}
                    </TableCell>
                    <TableCell className="w-[20%] h-5 text-start font-semibold">
                      {formatDate(h.created_at)}
                    </TableCell>
                    <TableCell className="w-[20%] h-5 text-start font-semibold">
                      {h.elo}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableBody>
              {Array.from({ length: 15 }).map((_, i) => {
                return (
                  <TableRow key={i} className="h-2">
                    <TableCell className="w-[20%] h-5">
                      <div className="w-full h-full py-5">
                        <Skeleton className="w-full h-full" />
                      </div>
                    </TableCell>
                    <TableCell className="w-[40%] h-5">
                      <div className="w-full h-full py-5">
                        <Skeleton className="w-full h-full" />
                      </div>
                    </TableCell>
                    <TableCell className="w-[20%] h-5">
                      <div className="w-full h-full py-5">
                        <Skeleton className="w-full h-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
        <div className="flex justify-between mt-4">
          <Button
            variant="secondary"
            size="icon"
            className="size-8"
            disabled={history?.length === 0 || page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeftIcon />
          </Button>
          <span>
            Page {history?.length === 0 ? page ?? "1" : page} of{" "}
            {history?.length === 0 ? totalPages ?? "..." : totalPages}
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="size-8"
            disabled={history?.length === 0 || page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
