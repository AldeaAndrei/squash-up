"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useTheme } from "next-themes";
import { CircleCheckBig, Save } from "lucide-react";

export default function RoundCard({ round }) {
  const [scoreBySet, setScoreBySet] = useState({});
  const [colorsBySet, setColorsBySet] = useState({});
  const { theme } = useTheme();

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

      colors[set.id] = {
        player_1_color:
          score_1 == score_2
            ? "text-foreground"
            : score_1 > score_2
            ? "text-green-500"
            : "text-red-500",
        player_2_color:
          score_1 == score_2
            ? "text-foreground"
            : score_1 < score_2
            ? "text-green-500"
            : "text-red-500",
      };
    });

    setScoreBySet(scores);
    setColorsBySet(colors);
  }, [round]);

  const changeScore = (setId, player) => {};

  // useEffect(() => {
  //   console.log(scoreBySet);
  // }, [scoreBySet]);

  return (
    <Card key={round.id} className="my-2">
      <CardContent className="flex w-full px-1 py-1">
        <div className="flex-col w-full">
          <div className="flex w-full justify-between items-center">
            <p className="flex-1 items-center font-semibold ml-3">
              {round.player_1_name}
            </p>
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
                      className={`caret-transparent text-lg font-bold text-center bg-transparent rounded-lg focus:outline-none focus:underline w-14 h-8 ${
                        colorsBySet[set.id].player_1_color
                      }`}
                    />
                  ) : (
                    <Skeleton />
                  )
                )}
            </div>
          </div>
          <div className="flex w-full justify-between items-center">
            <p className="flex-1 items-center font-semibold ml-3">
              {round.player_2_name}
            </p>
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
                      className={`caret-transparent text-lg font-bold text-center bg-transparent rounded-lg focus:outline-none focus:underline w-14 h-8 ${
                        colorsBySet[set.id].player_2_color
                      }`}
                    />
                  ) : (
                    <Skeleton />
                  )
                )}
            </div>
          </div>
        </div>
      </CardContent>
      <div className="h-5 w-full flex ml-5">
        <span className="aspect-square h-3">
          <Save className="w-full h-full" />
        </span>
        <span className="aspect-square h-3">
          <CircleCheckBig className="w-full h-full" />
        </span>
      </div>
    </Card>
  );
}
