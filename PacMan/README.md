# PacMan

A small browser game. Eat every dot, dodge the ghosts, and use power dots to turn the tables. The game fills the browser window, with a plain font, bright blue walls, white dots and vivid characters. 

## Play

- Arrow keys or WASD move the player. Your next turn is remembered until a junction.
- On a phone, use the direction buttons or swipe on the maze.
- Small dots give 10 points. Big dots give 50 points and seven seconds to chase ghosts.
- You have three lives. Eat every dot to win.
- P or Escape pauses. Switching tabs pauses automatically.
- Your best score saves in this browser when storage is available.

## Run on your computer

Install Node.js 20 or later. Open Terminal in this folder and run:

```sh
npm start
```

Open http://localhost:3000. No packages need installing. Use the local server instead of opening the HTML file directly, because the game uses JavaScript modules.

## Upload and publish on GitHub

1. Create a public repository named `PacMan`.
2. Upload this folder's contents, keeping the `dist`, `tests` and `.github` folders intact. Commit summary: `Add PacMan maze arcade game`.
3. Open repository Settings → Pages. Choose GitHub Actions as the source.
4. The included workflow checks and publishes the game. The Actions tab shows progress and the final Pages link.
5. Once published, add this to your profile README if your username and repository name match:

```markdown
[🎮 Play my maze game](https://Arica24.github.io/PacMan/)
```

This public Pages link becomes usable only after successful publication. If your computer hides `.github`, show hidden files or create `.github/workflows/pages.yml` through GitHub's Add file menu.

## What this project demonstrates

HTML, responsive CSS, JavaScript modules, Canvas 2D, keyboard and touch input, buffered turns, game states, collision detection, and guarded browser storage. Ghosts navigate using shortest-path distances with occasional random choices; while frightened, they prefer moving away. Simulation uses small time steps to avoid skipping collisions. Maze and actor positions are separated from drawing and the interface.

Run `npm test` for rules and maze-connectivity checks. Run `npm run check` for JavaScript syntax checks. Browser integration was simulated, and the canvas was rendered for visual inspection; real phone and cross-browser testing is recommended before a wider release.


