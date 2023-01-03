import "./App.css";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Controls from "./components/Controls";
import Container from "@mui/material/Container";
import GameDialog from "./components/GameDialog";
import skyscraper2 from "./skyscraper2.png";
import drone1 from "./drone1.svg";
import park from "./park.svg";
import { Snackbar } from "@mui/material";

function App() {
  const [staticItems, setStaticItems] = useState(null);
  const [items, setItems] = useState(null);
  const [drones, setDrones] = useState(null);
  const [activeRunner, setActiveRunner] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/map")
      .then((response) => response.json())
      .then((data) => populateGame(data));
  }, []);

  useEffect(() => {
    setItems(staticItems);
  }, [staticItems]);

  function getDrones() {
    fetch("http://localhost:8000/api/drones")
      .then((response) => response.json())
      .then((data) => addDrones(staticItems, data));
  }

  //tämä memoon?
  function populateGame(data) {
    let rows = [];

    for (let index = 0; index < data.height; index++) {
      const idn = index;
      for (let index = 0; index < data.width; index++) {
        rows.push({
          height: idn,
          width: index,
          type: "empty",
          key: idn + "/" + index,
        });
      }
    }

    rows = addSkyscrapers(data, rows);

    setStaticItems(rows);
  }

  function addDrones(rows, drones) {
    setDrones(drones);
    const active = drones.runnerDrones.find((drone) => drone.status === 0);

    setActiveRunner(active);

    const newItems = rows.map((item) => {
      const isPatrol = drones.patrolDrones.find(
        (sc) =>
          sc.location.xCoordinate === item.width &&
          sc.location.yCoordinate === item.height
      );
      const isRunner = drones.runnerDrones.find(
        (sc) =>
          sc.location.xCoordinate === item.width &&
          sc.location.yCoordinate === item.height
      );

      if (isPatrol) {
        return { ...item, type: "patrolDrone", key: isPatrol.key };
      }
      if (isRunner) {
        if (isRunner.status === 1) {
          return item;
        } else {
          setActiveRunner(isRunner);
          return { ...item, type: "runnerDrone", key: isRunner.key };
        }
      } else {
        return item;
      }
    });
    setItems(newItems);
  }
  //voisi nimetä uudestaan add statics
  function addSkyscrapers(data, rows) {
    const newItems = rows.map((item) => {
      const isSkyscraper = data.skyScrapers.find(
        (sc) =>
          sc.location.xCoordinate === item.width &&
          sc.location.yCoordinate === item.height
      );
      const isSafezone = data.safeZones.find(
        (sc) =>
          sc.location.xCoordinate === item.width &&
          sc.location.yCoordinate === item.height
      );

      const isDropZone = data.dropZones.find(
        (sc) =>
          sc.location.xCoordinate === item.width &&
          sc.location.yCoordinate === item.height
      );
      if (isSkyscraper) {
        return { ...item, type: "skyScraper", key: isSkyscraper.key };
      }
      if (isSafezone) {
        return { ...item, type: "safeZone", key: isSafezone.key };
      }
      if (isDropZone) {
        return { ...item, type: "dropZone", key: isDropZone.key };
      } else {
        return item;
      }
    });
    return newItems;
  }

  async function moveDrone(item) {
    const drone = activeRunner;
    if (
      Math.abs(drone.location.xCoordinate - item.width) > 1 ||
      Math.abs(drone.location.yCoordinate - item.height) > 1
    ) {
      setSnackbarOpen(true);
    } else {
      const res = await fetch(`api/drones/${drone.key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          xCoordinate: item.width,
          yCoordinate: item.height,
        }),
      });

      if (res.ok) {
        const resJSON = await res.json();
        getDrones();

        if (resJSON.status === 1) {
          setDialogOpen(true);
        }
      } else {
        const resText = await res.text();
        if (res.status === 401 && resText === "This drone has been destoryed") {
          deleteDrone(drone);
          setDialogOpen(true);
        }
      }
    }
  }
  async function addDrone() {
    const res = await fetch(`api/drones/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    getDrones();
  }
  async function deleteDrone(drone) {
    const res = await fetch(`api/drones/${drone.key}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    getDrones();
  }
  return (
    <Container>
      <GameDialog
        setOpen={setDialogOpen}
        open={dialogOpen}
        addDrone={addDrone}
      ></GameDialog>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Runner drone can move only one square at a time!"
      />

      <Controls getDrones={getDrones} sx={{ marginBottom: "24px" }}></Controls>
      <div className="map">
        {items &&
          items.map((item) => (
            <div
              className={`item ${item.type}`}
              key={item.key}
              onClick={() => moveDrone(item)}
              // style={
              //   item.type !== "skyScraper"
              //     ? {
              //         backgroundImage: `url(${paving})`,
              //         backgroundSize: "cover",
              //         opacity: "0.7",
              //       }
              //     : {}
              // }
            >
              {item.type === "skyScraper" && (
                <img
                  src={skyscraper2}
                  alt="skyscraper"
                  className="skyScraperIcon"
                  style={{
                    maxHeight: "8vh",
                    marginBottom: "10px",
                    padding: 0,
                  }}
                ></img>
              )}
              {item.type === "safeZone" && (
                <img
                  src={park}
                  alt="park"
                  style={{
                    maxHeight: "7vh",
                    padding: 0,
                  }}
                ></img>
              )}
              {(item.type === "runnerDrone" || item.type === "patrolDrone") && (
                <img
                  src={drone1}
                  alt="drone"
                  className={
                    item.type === "runnerDrone"
                      ? "droneIcon"
                      : "partrolDroneIcon"
                  }
                  style={{
                    maxHeight: "7vh",
                    fill: "blue",
                    padding: 0,
                  }}
                ></img>
              )}
            </div>
          ))}
      </div>
    </Container>
  );
}

export default App;
