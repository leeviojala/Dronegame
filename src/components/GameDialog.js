import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

export default function GameDialog({ setOpen, open, addDrone }) {
  function newGame() {
    addDrone();
    setOpen(false);
  }

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle>Game Over</DialogTitle>
      <DialogContent>
        <Typography>
          Your drone was destroyed. Do you want to spawn new drone?
        </Typography>
      </DialogContent>

      <Button onClick={() => newGame()}>Yes</Button>
    </Dialog>
  );
}
