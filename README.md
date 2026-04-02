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

## Run locally

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

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
