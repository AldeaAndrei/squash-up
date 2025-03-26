import React, { useEffect, useState } from "react";
import WinnerIcon from "@mui/icons-material/EmojiEvents";
import { yellow } from "@mui/material/colors";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function gameListElement({
  players,
  round,
  tournamentId,
  isReadOnly,
}) {
  const [winner, setWinner] = useState(null);

  const [player1Values, setPlayer1Values] = useState(
    round.sets.map((set) => set.player_1_score)
  );
  const [player2Values, setPlayer2Values] = useState(
    round.sets.map((set) => set.player_2_score)
  );

  const [isUploading, setIsUploading] = useState(false);

  const [player1Colors, setPlayer1Colors] = useState([
    "text-gray-400",
    "text-gray-400",
    "text-gray-400",
  ]);
  const [player2Colors, setPlayer2Colors] = useState([
    "text-gray-400",
    "text-gray-400",
    "text-gray-400",
  ]);

  const [eloData, setEloData] = useState();

  const setInputValues1 = (value, index) => {
    const newValues = player1Values.map((v, i) => {
      return i === index ? validatedScore(value) : v;
    });

    setPlayer1Values(newValues);
  };

  const setInputValues2 = (value, index) => {
    const newValues = player2Values.map((v, i) => {
      return i === index ? validatedScore(value) : v;
    });

    setPlayer2Values(newValues);
  };

  const validatedScore = (val) => {
    let score = parseInt(val, 10);
    if (isNaN(score)) return 0;
    return Math.max(0, Math.min(25, score));
  };

  const calculateWinner = () => {
    let winner1 = 0;
    let winner2 = 0;

    for (let i = 0; i < player1Values.length; i++) {
      winner1 += player1Values[i] > player2Values[i] ? 1 : 0;
      winner2 += player2Values[i] > player1Values[i] ? 1 : 0;
    }

    if (winner1 > winner2 && winner1 >= Math.ceil(round.sets.length / 2))
      setWinner(1);
    else if (winner2 > winner1 && winner2 >= Math.ceil(round.sets.length / 2))
      setWinner(2);
    else setWinner(null);
  };

  useEffect(() => {
    if (player1Values == null || player2Values == null) return;

    const newColorsPlayer1 = player1Values.map((v, i) => {
      if (v === 0) return "text-gray-400";
      if (v === player2Values[i]) return "text-white";
      return v < player2Values[i] ? "text-[#c54242]" : "text-[#84c542]";
    });

    const newColorsPlayer2 = player2Values.map((v, i) => {
      if (v === 0) return "text-gray-400";
      if (v === player1Values[i]) return "text-white";
      return v < player1Values[i] ? "text-[#c54242]" : "text-[#84c542]";
    });

    setPlayer1Colors(newColorsPlayer1);
    setPlayer2Colors(newColorsPlayer2);

    calculateWinner();
  }, [player1Values, player2Values]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      async function getEloChanges() {
        try {
          const response = await fetch(`/api/elo/rounds/${round.id}`);

          if (response.ok) {
            const data = await response.json();

            setEloData(
              data.elo.reduce((map, d) => {
                map[`${d.id}-${d.name}`] = { elo: d.elo, change: d.elo_change };
                return map;
              }, {})
            );
          } else {
            console.error("Failed to fetch elo data");
          }
        } catch (error) {}
      }

      async function syncScores() {
        try {
          setIsUploading(true);
          let newSets = [];

          for (let i = 0; i < round.sets.length; i++) {
            let set = round.sets[i];
            newSets.push({
              id: set.id,
              player_1_score: player1Values[i],
              player_2_score: player2Values[i],
            });
          }

          const response = await fetch("/api/sets/scores", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              newSets,
            }),
          });

          response.json().then(setIsUploading(false));
        } catch (error) {
          console.error("Error setting scores:", error);
        }
      }

      syncScores();
      getEloChanges();
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [player1Values, player2Values]);

  const parseElo = (id, name) => {
    if (eloData[`${id}-${name}`]?.change == null) return <></>;

    return (
      <div className="align-middle text-sm">
        <span className="mr-2">{eloData[`${id}-${name}`]?.elo}</span>
        <span
          className={
            eloData[`${id}-${name}`]?.change < 0
              ? "text-[#c54242]"
              : "text-[#84c542]"
          }
        >
          {eloData[`${id}-${name}`]?.change < 0
            ? `${eloData[`${id}-${name}`]?.change}`
            : `+${eloData[`${id}-${name}`]?.change}`}
        </span>
      </div>
    );
  };

  return (
    <li className="flex flex-col bg-[#1e2021] items-center px-2 py-1 rounded-xl w-80">
      <div className="flex justify-between items-center w-full">
        <div className="flex-col text-center flex-1 max-h-12 overflow-y-scroll scrollbar-hide">
          <span>
            {round.player_1_name ?? players[round.player_1_id]}
            {winner === 1 && <WinnerIcon sx={{ color: yellow[500] }} />}
          </span>
          {eloData && parseElo(round.player_1_id, round.player_1_name)}
        </div>
        <div className="flex-col text-center flex-1 max-h-12 overflow-y-scroll scrollbar-hide">
          <span>
            {round.player_2_name ?? players[round.player_2_id]}{" "}
            {winner === 2 && <WinnerIcon sx={{ color: yellow[500] }} />}
          </span>
          {eloData && parseElo(round.player_2_id, round.player_2_name)}
        </div>
      </div>
      <div className="flex justify-center items-center w-[80%] h-[1px] bg-slate-400 rounded-full my-3" />
      {player1Values != null && player2Values != null && (
        <div className="px-4 flex justify-between items-center w-full">
          <div className="flex-col justify-center items-center">
            {player1Values.map((value, index) => {
              return (
                <textarea
                  key={`${index}-player1`}
                  type="number"
                  value={value}
                  placeholder="0"
                  readOnly={isReadOnly}
                  onClick={(e) => {
                    if (!isReadOnly) e.target.select();
                  }}
                  onChange={(e) => {
                    setInputValues1(e.target.value, index);
                  }}
                  className={`${player1Colors[index]} text-lg font-bold text-center bg-transparent px-2 py-1 rounded-lg focus:outline-none focus:underline w-14 flex justify-center items-center resize-none h-8 overflow-hidden`}
                />
              );
            })}
          </div>
          <div className="flex-col justify-center items-center">
            {player2Values.map((value, index) => {
              return (
                <textarea
                  key={`${index}-player2`}
                  type="number"
                  value={value}
                  placeholder="0"
                  readOnly={isReadOnly}
                  onClick={(e) => {
                    if (!isReadOnly) e.target.select();
                  }}
                  onChange={(e) => {
                    setInputValues2(e.target.value, index);
                  }}
                  className={`${player2Colors[index]} text-lg font-bold text-center bg-transparent px-2 py-1 rounded-lg focus:outline-none focus:underline w-14 flex justify-center items-center resize-none h-8 overflow-hidden`}
                />
              );
            })}
          </div>
        </div>
      )}
      <div className="w-full px-2 text-gray-600 min-h-7">
        {isUploading && <CloudUploadIcon />}
      </div>
    </li>
  );
}
