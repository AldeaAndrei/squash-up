import React, { useEffect, useRef, useState } from "react";
import WinnerIcon from "@mui/icons-material/EmojiEvents";
import { yellow } from "@mui/material/colors";

export default function gameListElement({ match, setScores, round }) {
  const [winner, setWinner] = useState(null);

  const [player1Values, setPlayer1Values] = useState(
    match.rounds.map((round) => round.player1Score)
  );
  const [player2Values, setPlayer2Values] = useState(
    match.rounds.map((round) => round.player2Score)
  );

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

  const validatedScore = (val) => {
    let score = parseInt(val, 10);
    if (isNaN(score)) return 0;
    return Math.max(0, Math.min(25, score));
  };

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

  const calculateWinner = () => {
    let winner1 = 0;
    let winner2 = 0;

    for (let i = 0; i < player1Values.length; i++) {
      winner1 += player1Values[i] > player2Values[i] ? 1 : 0;
      winner2 += player2Values[i] > player1Values[i] ? 1 : 0;
    }

    if (winner1 > winner2 && winner1 >= Math.ceil(match.rounds.length / 2))
      setWinner(1);
    else if (winner2 > winner1 && winner2 >= Math.ceil(match.rounds.length / 2))
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

    setScores(
      match.player1Name,
      player1Values,
      match.player2Name,
      player2Values,
      round
    );
  }, [player1Values, player2Values]);

  return (
    <li className="flex flex-col bg-[#1e2021] items-center px-2 py-1 rounded-xl w-80">
      <div className="flex justify-between items-center w-full">
        <div className="flex-col text-center flex-1 max-h-12 overflow-y-scroll scrollbar-hide">
          {match.player1Name}
          <span className="mx-2" />
          {winner === 1 && <WinnerIcon sx={{ color: yellow[500] }} />}
        </div>
        <div className="flex-col text-center flex-1 max-h-12 overflow-y-scroll scrollbar-hide">
          {match.player2Name}
          <span className="mx-2" />
          {winner === 2 && <WinnerIcon sx={{ color: yellow[500] }} />}
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
                  onClick={(e) => e.target.select()}
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
                  onClick={(e) => e.target.select()}
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
    </li>
  );
}
