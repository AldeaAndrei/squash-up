"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "../ui/skeleton";
import { useTheme } from "next-themes";
import { CircleCheckBig, Save, Trophy } from "lucide-react";

export default function RoundCard({ round, anyUsedInELO }) {
  const [scoreBySet, setScoreBySet] = useState({});
  const [colorsBySet, setColorsBySet] = useState({});
  const { theme } = useTheme();
  const [changes, setChanges] = useState({});
  const debounceRef = useRef(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!round?.sets) return;

    let scores = {};
    let colors = {};

    round.sets.forEach((set) => {
      const score_1 = set.player_1_score ?? 0;
      const score_2 = set.player_2_score ?? 0;

      scores[set.id] = {
        player_1_score: score_1,
        player_2_score: score_2,
      };
    });

    setColors();
    checkWinner();

    setScoreBySet(scores);
  }, [round]);

  useEffect(() => {
    setColors();
    checkWinner();
  }, [scoreBySet]);

  const checkWinner = () => {
    let player1Wins = 0;
    let player2Wins = 0;
    let totalSets = Object.keys(scoreBySet).length;

    Object.values(scoreBySet).forEach(({ player_1_score, player_2_score }) => {
      if (player_1_score > player_2_score) player1Wins++;
      else if (player_2_score > player_1_score) player2Wins++;
    });

    if (player1Wins > totalSets / 2) setWinner(1);
    else if (player2Wins > totalSets / 2) setWinner(2);
    else setWinner(null);
  };

  const setColors = () => {
    let colors = {};

    Object.entries(scoreBySet).forEach(([setId, scores]) => {
      const { player_1_score, player_2_score } = scores;

      colors[setId] = {
        player_1_color:
          player_1_score === player_2_score
            ? "text-foreground"
            : player_1_score > player_2_score
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400",
        player_2_color:
          player_1_score === player_2_score
            ? "text-foreground"
            : player_1_score < player_2_score
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400",
      };
    });

    setColorsBySet(colors);
  };

  const validateScore = (value) => {
    const str = String(value).trim();

    if (/^0\d+/.test(str)) return 0;

    const num = Number(str);

    if (!Number.isInteger(num)) return 0;
    if (num < 0) return 0;
    if (num > 25) return 25;

    return num;
  };

  const changeScore = (setId, player, rawValue) => {
    const value = validateScore(rawValue);

    setScoreBySet((prev) => ({
      ...prev,
      [setId]: {
        ...prev[setId],
        [player === 1 ? "player_1_score" : "player_2_score"]: value,
      },
    }));

    setChanges((prev) => ({
      ...prev,
      [setId]: {
        ...prev[setId],
        [player === 1 ? "player_1_score" : "player_2_score"]: value,
      },
    }));
  };

  const updateSetApi = async (changes) => {
    if (anyUsedInELO === true) return;
    try {
      setLoadingSave(true);
      const res = await fetch("/api/v1/sets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });
      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }
      const data = await res.json();
      setChanges({});
    } catch (error) {
      console.error("Failed to update sets:", error);
    } finally {
      setTimeout(() => setLoadingSave(false), 2000);
    }
  };

  useEffect(() => {
    if (!Object.keys(changes).length) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      updateSetApi(changes);
    }, 100);

    return () => clearTimeout(debounceRef.current);
  }, [changes]);

  return (
    <Card key={round.id} className="my-2">
      <CardContent className="flex w-full px-1 py-1">
        <div className="flex-col w-full">
          <div className="flex w-full justify-between items-start">
            <div className="flex-1 items-center font-semibold ml-3">
              <div className="w-full h-full flex justify-between">
                <p>{round.player_1_name}</p>
                <p>
                  {winner === 1 && (
                    <Trophy className="aspect-square w-4 text-yellow-600 dark:text-yellow-400" />
                  )}
                </p>
              </div>
            </div>
            <div className="flex-[1.5] flex justify-end">
              {[...round.sets]
                .sort((a, b) => Number(a.id) - Number(b.id))
                .map((set) =>
                  scoreBySet[set.id] && colorsBySet[set.id] ? (
                    <input
                      key={set.id + "player1"}
                      type="number"
                      placeholder="0"
                      value={scoreBySet[set.id].player_1_score}
                      disabled={anyUsedInELO}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const valid = validateScore(e.target.value);
                        if (valid !== null) changeScore(set.id, 1, valid);
                      }}
                      className={`caret-transparent text-lg font-bold text-center bg-transparent rounded-lg focus:outline-none focus:underline w-14 h-8 ${
                        colorsBySet[set.id].player_1_color
                      }`}
                    />
                  ) : (
                    <Skeleton key={set.id + "player1-skel"} />
                  )
                )}
            </div>
          </div>
          <div className="flex w-full justify-between items-start">
            <div className="flex-1 items-center font-semibold ml-3">
              <div className="w-full h-full flex justify-between">
                <p>{round.player_2_name}</p>
                <p>
                  {winner === 2 && (
                    <Trophy className="aspect-square w-4 text-yellow-600 dark:text-yellow-400" />
                  )}
                </p>
              </div>
            </div>
            <div className="flex-[1.5] flex justify-end">
              {[...round.sets]
                .sort((a, b) => Number(a.id) - Number(b.id))
                .map((set) =>
                  scoreBySet[set.id] && colorsBySet[set.id] ? (
                    <input
                      key={set.id + "player2"}
                      type="number"
                      placeholder="0"
                      value={scoreBySet[set.id].player_2_score}
                      disabled={anyUsedInELO}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const valid = validateScore(e.target.value);
                        if (valid !== null) changeScore(set.id, 2, valid);
                      }}
                      className={`caret-transparent text-lg font-bold text-center bg-transparent rounded-lg focus:outline-none focus:underline w-14 h-8 ${
                        colorsBySet[set.id].player_2_color
                      }`}
                    />
                  ) : (
                    <Skeleton key={set.id + "player2-skel"} />
                  )
                )}
            </div>
          </div>
        </div>
      </CardContent>
      <div className="h-5 w-full flex ml-5">
        <span className="aspect-square h-3 w-3">
          {loadingSave && <Save className="w-full h-full animate-pulse" />}
        </span>
        <span className="w-full ml-3">
          {round?.used_for_elo && (
            <div className="flex gap-1">
              <CircleCheckBig className="w-3 h-3" />
              <div className="w-full h-3 font-extralight text-sm flex items-center">
                Used for ELO
              </div>
            </div>
          )}
        </span>
      </div>
    </Card>
  );
}
