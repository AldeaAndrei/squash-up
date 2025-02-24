"use client";

import { useEffect, useState } from "react";
import PlayersListElement from "./PlayerListElement";

export default function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isValidName, setIsValidName] = useState(true);

  const validName = (name) => {
    const alreadyExists = players.map((player) => player.name).includes(name);
    return !alreadyExists;
  };

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

    setInputValue("");
    const newPlayer = { id: players.length, name: inputValue };
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
      <div className="flex gap-4 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e)}
          onKeyDown={handleKeyPress} // Calls function when Enter is pressed
          className={`border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isValidName ? "text-black" : "text-red-500"
          }`}
          placeholder="Nume jucator..."
        />
        <button
          className="bg-green-500 p-1 w-32 rounded-xl border-green-800 border-2"
          onClick={() => handleSubmit()}
        >
          Adauga
        </button>
      </div>
      <ul className="overflow-scroll-y">
        {players.map((player, index) => {
          return (
            <PlayersListElement
              key={`${player.name}-${player.id}`}
              playerName={player.name}
              playerId={player.id}
              index={index}
              removePlayer={removePlayer}
            />
          );
        })}
      </ul>
    </div>
  );
}
