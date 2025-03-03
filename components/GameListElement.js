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

  const player1InputsRefs = useRef(
    Array.from({ length: 3 }, () => React.createRef())
  );
  const player2InputsRefs = useRef(
    Array.from({ length: 3 }, () => React.createRef())
  );

  const setFocus = (playerIndex, inputIndex) => {
    if (playerIndex === 1) {
      player1InputsRefs.current[inputIndex]?.current?.focus();
    } else if (playerIndex === 2) {
      player2InputsRefs.current[inputIndex]?.current?.focus();
    }
  };

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

    const p1Wins = match.rounds
      .map((round) => {
        return round.player1Score > round.player2Score ? 1 : 0;
      })
      .reduce((acc, num) => acc + num, 0);

    const p2Wins = match.rounds
      .map((round) => {
        return round.player2Score > round.player1Score ? 1 : 0;
      })
      .reduce((acc, num) => acc + num, 0);

    if (p1Wins > p2Wins && p1Wins >= 2) setWinner(1);
    else if (p2Wins > p1Wins && p2Wins >= 2) setWinner(2);
    else setWinner(null);

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
          {winner === 1 && <WinnerIcon />}
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
                <input
                  key={`${index}-player1`}
                  type="number"
                  value={value}
                  onClick={() => setFocus(1, index)}
                  onChange={(e) => setInputValues1(e.target.value, index)}
                  className={`${player1Colors[index]} text-lg font-bold text-center bg-transparent px-2 py-1 rounded-lg focus:outline-none focus:underline w-14 flex justify-center items-center`}
                />
              );
            })}
          </div>
          <div className="flex-col justify-center items-center">
            {player2Values.map((value, index) => {
              return (
                <input
                  key={`${index}-player2`}
                  type="number"
                  value={value}
                  onChange={(e) => setInputValues2(e.target.value, index)}
                  className={`${player2Colors[index]} text-lg font-bold text-center bg-transparent px-2 py-1 rounded-lg focus:outline-none focus:underline w-14 flex justify-center items-center`}
                />
              );
            })}
          </div>
        </div>
      )}
    </li>

    // <li className="bg-[#1e2021] justify-between px-2 py-1 items-center rounded-xl w-80">
    //   <div className=" justify-center items-center flex-1 gap-3">
    //     <div className="flex items-center justify-between px-10">
    //       <div>{match.player1Name}</div>
    //       <input
    //         type="number"
    //         value={inputValue1}
    //         onChange={(e) => setInputValue1(e.target.value)}
    //         onKeyDown={handleKeyPress}
    //         className={`${
    //           parseInt(inputValue1) === 0 ? "text-[#e7e8e9]" : inputValue1Color
    //         } text-center bg-transparent px-2 py-1 rounded-lg focus:outline-none focus:underline w-14 flex justify-center items-center`}
    //       />
    //     </div>
    //     <div className="flex justify-center items-center">
    //       <div className="text-center align-middle mr-3 text-gray-500 text-xs">
    //         vs
    //       </div>
    //       <div className="bg-[#2a2d2e] w-[80%] mr-3 h-1 rounded-full" />
    //     </div>
    //     <div className="flex items-center justify-between px-10">
    //       <div>{match.player2Name}</div>
    //       <input
    //         type="number"
    //         value={inputValue2}
    //         onChange={(e) => setInputValue2(e.target.value)}
    //         onKeyDown={handleKeyPress}
    //         className={`${
    //           parseInt(inputValue2) === 0 ? "text-[#e7e8e9]" : inputValue2Color
    //         } text-center bg-transparent px-2 py-1 rounded-lg focus:outline-none focus:underline w-14 flex justify-center items-center`}
    //       />
    //     </div>
    //   </div>
    // </li>
  );
}
