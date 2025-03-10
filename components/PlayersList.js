"use client";

import { useEffect, useState } from "react";
import PlayersListElement from "./PlayerListElement";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [foundPlayer, setFoundPlayer] = useState();
  const [inputValue, setInputValue] = useState("");
  const [isValidName, setIsValidName] = useState(true);

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
            }
          );

          const players = await response.json();

          let matchPlayer;
          players.forEach((player) => {
            if (player.name.toLowerCase() === inputValue.toLowerCase())
              matchPlayer = player;
          });

          setFoundPlayer(matchPlayer);
        } catch (error) {
          console.error("Error fetching players:", error);
        }
      }

      if (inputValue) {
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

  const handleSubmit = () => {
    if (inputValue.length < 3 || !isValidName) return;

    const newPlayer = {
      id:
        players.length > 0
          ? Math.max(...players.map((player) => player.id)) + 1
          : 0,
      name: foundPlayer ? foundPlayer.name : inputValue,
      database_id: foundPlayer ? foundPlayer.id : null,
    };

    setInputValue("");
    setFoundPlayer(null);
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
    <div>
      <div className="flex justify-between max-w-80 gap-4 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e)}
          onKeyDown={handleKeyPress} // Calls function when Enter is pressed
          className={`border border-gray-300 p-2 rounded-lg focus:outline-none font-semibold focus:ring-2 focus:ring-blue-500 ${
            isValidName
              ? foundPlayer
                ? "text-green-700"
                : "text-black"
              : "text-red-500"
          }`}
          placeholder="Nume jucator..."
        />
        <button
          className="hidden lg:block bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded disabled:bg-[#5c5c5c]"
          disabled={inputValue.length < 1}
          onClick={() => handleSubmit()}
        >
          Adauga
        </button>
        <button
          className="block lg:hidden bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded disabled:bg-[#5c5c5c]"
          disabled={inputValue.length < 1}
          onClick={() => handleSubmit()}
        >
          <AddCircleOutlineIcon />
        </button>
      </div>
      <ul className="overflow-scroll-y flex flex-col gap-2">
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
      </ul>
    </div>
  );
}
