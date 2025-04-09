"use client";

import { useEffect, useState } from "react";
import PlayersListElement from "./PlayerListElement";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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
    <div>
      <div className="flex justify-between max-w-80 gap-4 mb-2">
        <div className="flex justify-start">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e)}
            onKeyDown={handleKeyPress} // Calls function when Enter is pressed
            className={`border border-gray-300 p-2 rounded-lg focus:outline-none font-semibold focus:ring-2 focus:ring-blue-500 ${
              isValidName ? "text-black" : "text-red-500"
            }`}
            placeholder="Nume jucator..."
          />
          {similarPlayers?.length > 0 && (
            <ul className="bg-[#131313] mt-12 max-w-80 font-bold border border-[#292929] rounded flex flex-col gap-3 absolute w-full max-h-60 overflow-y-scroll">
              {similarPlayers.map((player) => {
                return (
                  <li
                    key={player.id}
                    className="p-2 w-full bg-[#1d1f1e] border border-[#292929] rounded "
                    onClick={() => handleSubmit(player)}
                  >
                    <div className="flex justify-between w-full">
                      <div className="flex gap-2">
                        <p>{player.name}</p>
                      </div>
                      <p className="ml-3 text-sm">{player.elo}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
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
