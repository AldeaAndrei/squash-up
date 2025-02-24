"use client";

import { useState, useEffect } from "react";
import { Table } from "antd";

export default function LeaderboardList() {
  const header = ["Jucator", "Total", "Castigate"];

  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedGames = localStorage.getItem("games");
    const storedPlayers = localStorage.getItem("players");

    if (storedGames) {
      try {
        setGames(JSON.parse(storedGames));
      } catch (error) {
        setGames([]);
      }
    }

    if (storedPlayers) {
      try {
        setPlayers(JSON.parse(storedPlayers));
      } catch (error) {
        setPlayers([]);
      }
    }
  }, []);

  useEffect(() => {
    if (!players || !games) return;

    let newLeaderboard = [];

    players.forEach((player) => {
      let wins = 0;
      let total = 0;

      games.forEach((game) => {
        if (game.player1Name == player.name) {
          wins += game.player1Score > game.player2Score ? 1 : 0;
          total += parseInt(game.player1Score);
        }
        if (game.player2Name == player.name) {
          wins += game.player2Score > game.player1Score ? 1 : 0;
          total += parseInt(game.player2Score);
        }
      });

      newLeaderboard.push({ player: player.name, total: total, wins: wins });
    });

    setLeaderboard(newLeaderboard);
  }, [players, games]);

  const columns = [
    {
      title: "Jucator",
      dataIndex: "player",
      key: "player",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Castigate",
      dataIndex: "wins",
      key: "wins",
    },
  ];

  return (
    <div>
      <Table dataSource={leaderboard} columns={columns} />
    </div>
  );
}
