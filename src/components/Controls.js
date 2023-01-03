import { Button, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";

export default function Controls({ getDrones }) {
  const [gameStats, setGameStats] = React.useState([]);
  useEffect(() => {
    getGameStats();
  }, []);

  async function getGameStats() {
    const scores = await fetch("http://localhost:8000/api/scoreboard");
    const scoresJson = await scores.json();
    setGameStats(scoresJson);
  }
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        padding: "16px",
        justifyContent: "space-between",
        marginBottom: "24px",
        marginTop: "24px",
      }}
    >
      <Button variant="contained" onClick={() => getDrones()}>
        Start Game
      </Button>
      <div
        style={{ display: "flex", flexGrow: 1, justifyContent: "space-evenly" }}
      >
        <div>
          <Typography>Moves:{gameStats.moves}</Typography>
          <Typography>Drones used:{gameStats.dronesUsed}</Typography>
        </div>
        <div>
          <Typography>Score:{gameStats.deliveredPackages}</Typography>
          <Typography>Score:{gameStats.destoryedPackages}</Typography>
        </div>
      </div>
    </Paper>
  );
}
