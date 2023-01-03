## How to run

You should have following project running locally:
https://github.com/solita/CyberCouriers2000

To get all npm packages installed run

### `npm install`

After that, you can run in project directory

### `npm start`

Runs the app in the development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.\

## How to play

- After inital page load, click start game button

- Drones spawn on the map. Patrol drones have police lights animation while runner drone has no animation

- Move runner drone by clicking squares within legal moving range

- If runner drone gets destroyed, dialog appears and let's you spawn a new runner drone (start a new game)

**Game is not playable on smaller screen sizes**

## Known bugs

- Sometimes runner drone disappears in some squares -> you can resume playing if you click a square within legal moving range despite runner drone being "invisible"

## Scope

- Map and other static elements get fetched and rendered

- Runner and patrol drones get rendered

- Basic movement of drones

- Drone getting destroyed and spawning a new drone

- Scoreboard

## Not implemented

- Picking up and delivering a package
