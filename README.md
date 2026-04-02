# QR Decoder Trainer (Manual Decoding Game)

A simple browser-based educational game built with React to teach the core ideas behind **manual QR code decoding**.

## What this project includes

- Interactive QR-style grid
- Tutorial mode with 5 levels:
  1. Identify finder/timing patterns
  2. Read module positions
  3. Remove a mask
  4. Extract bits in correct order
  5. Decode final text payload
- Hint system per level
- Scoring and immediate visual feedback
- Clean, simple visual style
- No backend (fully front-end only)

## Run locally (step-by-step)

### 1) Prerequisites

- **Node.js 18+** (recommended: latest LTS)
- **npm 9+** (comes with Node in most installs)

Check what you have installed:

```bash
node -v
npm -v
```

### 2) Install dependencies

From the project root:

```bash
npm install
```

### 3) Start the development server

```bash
npm start
```

Expected output includes a line like:

- `Local: http://localhost:3000`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4) Stop the server

Press `Ctrl + C` in the terminal running `npm start`.

### Common issues

- **`react-scripts: command not found`**  
  Run `npm install` again in the project root so local dependencies are installed.
- **Port 3000 is already in use**  
  React will usually ask to run on another port (for example `3001`). Type `Y` to confirm.
- **Install fails due to old Node/npm**  
  Upgrade Node.js to a current LTS release, then rerun `npm install`.

## Build for production

```bash
npm run build
```

## Notes for learners

This game simplifies some real QR internals so you can focus on understanding the process:
- Pattern recognition
- Coordinate reading
- Mask removal rule
- Bit extraction order
- Text payload conversion from bits to ASCII

## Project structure

- `src/App.js` – game logic, levels, scoring, hints, interactions
- `src/styles.css` – visual design
- `src/index.js` – app entry point
- `public/index.html` – browser HTML shell

## Implementation comments

The source code includes comments in `src/App.js` to explain key learning mechanics and how each tutorial level works.
