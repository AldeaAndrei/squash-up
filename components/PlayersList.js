"use client";

import { useEffect, useState } from "react";
import PlayersListElement from "./PlayerListElement";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleUserRound, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import SetGameTypeButton from "./SetGameTypeButton";
import StartGameButton from "./StartGameButton";

export default function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isValidName, setIsValidName] = useState(true);
  const [similarPlayers, setSimilarPlayers] = useState([]);

  const validName = (name) => {
    const alreadyExists = players
      .map((player) => player.name.toLowerCase())
      .includes(name.toLowerCase());
    return !alreadyExists;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      async function fetchPlayers() {
        try {
          const response = await fetch(
            `/api/players?name=${encodeURIComponent(inputValue)}`,
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
            (player) =>
              !players.map((p) => p.database_id).includes(player.id) &&
              !players.map((p) => p.name).includes(player.name)
          );

          setSimilarPlayers(playersFetched);
        } catch (error) {
          console.error("Error fetching players:", error);
        }
      }

      if (inputValue?.length === 0) setSimilarPlayers([]);

      if (inputValue && inputValue?.length > 2) {
        fetchPlayers();
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  useEffect(() => {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
      try {
        setPlayers(JSON.parse(storedPlayers));
      } catch (error) {
        setPlayers([]);
      }
    }
  }, []);

  useEffect(() => {
    if (players) {
      localStorage.setItem("players", JSON.stringify(players));
    }
  }, [players]);

  const handleSubmit = (player) => {
    if (inputValue.length < 3 || !isValidName) return;

    if (player) {
      setSimilarPlayers([]);
    }

    const newPlayer = {
      id:
        players.length > 0
          ? Math.max(...players.map((player) => player.id)) + 1
          : 0,
      name: player ? player.name : inputValue,
      database_id: player ? player.id : null,
    };

    setInputValue("");
    setPlayers([newPlayer, ...players]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const removePlayer = (playerName, id) => {
    setPlayers(
      players.filter((player) => player.name !== playerName || player.id !== id)
    );
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setIsValidName(validName(e.target.value));
  };

  return (
    <div className="flex flex-col justify-center items-start p-2 gap-10">
      <div className="flex w-full">
        <div className="flex-1">
          <SetGameTypeButton />
        </div>
        <div className="flex-1">
          <StartGameButton />
        </div>
      </div>
      {similarPlayers?.length > 0 && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      )}
      <div className="flex justify-between max-w-80 gap-4 mb-2">
        <div className="flex justify-start relative z-50">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e)}
            onKeyDown={handleKeyPress}
            className={`border border-gray-300 p-2 rounded-lg focus:outline-none font-semibold focus:ring-2 focus:ring-blue-500 ${
              isValidName ? "text-foreground" : "text-red-500"
            }`}
            placeholder="Player name..."
          />
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
                    onClick={() => handleSubmit(player)}
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
        <Button
          className="z-50"
          disabled={inputValue.length < 1}
          onClick={() => handleSubmit()}
          variant="outline"
        >
          Add
        </Button>
      </div>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow className="h-2">
            <TableHead className="text-start w-[10%] h-5">#</TableHead>
            <TableHead className="text-start w-[45%] h-5">Name</TableHead>
            <TableHead className="text-start w-[45%] h-5"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...players].reverse().map((player, i) => (
            <TableRow className="h-2" key={i}>
              <TableCell className="text-start w-[10%] h-5">
                {players.length - i}
              </TableCell>
              <TableCell className="text-start w-[45%] h-5">
                {player.name}
              </TableCell>
              <TableCell className="text-start w-[45%] h-5">
                <div className="flex w-full items-center justify-end">
                  {/* TODO: Go to player profile */}
                  <Button variant="ghost">
                    <CircleUserRound />
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => removePlayer(player.name, player.id)}
                  >
                    <X />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <ul className="overflow-scroll-y flex flex-col gap-2">
        {players.map((player, index) => {
          return (
            <PlayersListElement
              key={`${player.name}-${player.id}`}
              playerName={player.name}
              playerId={player.id}
              index={index}
              id={player.database_id}
              removePlayer={removePlayer}
            />
          );
        })}
      </ul> */}
    </div>
  );
}
