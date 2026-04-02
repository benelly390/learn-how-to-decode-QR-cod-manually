import React, { useMemo, useState } from "react";

const GRID_SIZE = 9;
const finderCells = [
  [0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2],
  [0, 6], [0, 7], [0, 8], [1, 6], [1, 8], [2, 6], [2, 7], [2, 8],
  [6, 0], [6, 1], [6, 2], [7, 0], [7, 2], [8, 0], [8, 1], [8, 2]
];
const timingCells = [[4, 2], [4, 3], [4, 4], [4, 5], [4, 6]];

// Small payload we use across the tutorial levels.
const payloadText = "HI";
const payloadBits = "0100100001001001";

const LEVELS = [
  {
    id: 1,
    title: "Finder + Timing Patterns",
    description: "Click every finder and timing pattern module.",
    hint: "Find three square corners + the alternating timing row."
  },
  {
    id: 2,
    title: "Read Module Positions",
    description: "Click modules in the shown coordinate order.",
    hint: "Coordinates are row, col using zero-based indexing."
  },
  {
    id: 3,
    title: "Remove a Mask",
    description: "Toggle masked cells where (row + col) is even.",
    hint: "Mask rule for this level is: (r + c) % 2 === 0."
  },
  {
    id: 4,
    title: "Extract Bit Order",
    description: "Select modules in the zig-zag extraction sequence.",
    hint: "Read from bottom-right upward in 2-column stripes."
  },
  {
    id: 5,
    title: "Decode Final Payload",
    description: "Type the decoded text from the extracted bits.",
    hint: "Split bits into bytes: 01001000 01001001."
  }
];

const keyFor = (r, c) => `${r}-${c}`;
const samePoint = (a, b) => a[0] === b[0] && a[1] === b[1];

function App() {
  const [level, setLevel] = useState(1);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Welcome! Start Level 1.");
  const [showHint, setShowHint] = useState(false);
  const [answer, setAnswer] = useState("");

  const levelData = LEVELS[level - 1];

  // Different levels share the same board, but we annotate it differently.
  const board = useMemo(() => {
    const data = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({ base: 0 }))
    );

    finderCells.forEach(([r, c]) => {
      data[r][c].base = 1;
      data[r][c].kind = "finder";
    });
    timingCells.forEach(([r, c], i) => {
      data[r][c].base = i % 2 === 0 ? 1 : 0;
      data[r][c].kind = "timing";
    });

    // Place payload bits in a fixed mini-path for teaching.
    const path = level4Path();
    payloadBits.split("").forEach((bit, idx) => {
      const [r, c] = path[idx];
      data[r][c].base = Number(bit);
      data[r][c].kind = "payload";
      data[r][c].index = idx;
    });

    return data;
  }, []);

  const expected = useMemo(() => {
    if (level === 1) return [...finderCells, ...timingCells];
    if (level === 2) return [[8, 8], [8, 7], [7, 8], [6, 8], [6, 7]];
    if (level === 3) {
      return level3MaskTargets();
    }
    if (level === 4) return level4Path().slice(0, payloadBits.length);
    return [];
  }, [level]);

  const selectedKeys = new Set(selected.map(([r, c]) => keyFor(r, c)));
  const expectedKeys = new Set(expected.map(([r, c]) => keyFor(r, c)));

  const onCellClick = (r, c) => {
    if (level === 5) return;

    const key = keyFor(r, c);
    const already = selectedKeys.has(key);
    const next = already
      ? selected.filter(([sr, sc]) => !(sr === r && sc === c))
      : [...selected, [r, c]];

    // Level 2 and 4 require strict order.
    if (level === 2 || level === 4) {
      const expectedPoint = expected[selected.length];
      if (!expectedPoint || !samePoint(expectedPoint, [r, c])) {
        setMessage("Not this position yet. Follow the exact order.");
        setScore((s) => Math.max(0, s - 1));
        return;
      }
    }

    setSelected(next);

    const solved = level === 2 || level === 4
      ? next.length === expected.length
      : setsMatch(next, expected);

    if (solved) {
      setMessage(`Nice! Level ${level} complete.`);
      setScore((s) => s + 10);
    } else {
      setMessage("Good progress. Keep going!");
    }
  };

  const submitFinal = () => {
    if (answer.trim().toUpperCase() === payloadText) {
      setMessage("Perfect decode! You finished the tutorial.");
      setScore((s) => s + 20);
    } else {
      setMessage("Try again. Decode the two bytes into ASCII letters.");
      setScore((s) => Math.max(0, s - 2));
    }
  };

  const nextLevel = () => {
    if (level < 5) {
      setLevel((l) => l + 1);
      setSelected([]);
      setShowHint(false);
      setMessage(`Now starting Level ${level + 1}.`);
    }
  };

  const resetLevel = () => {
    setSelected([]);
    setAnswer("");
    setMessage("Level reset. Try again!");
  };

  const levelComplete = level === 5
    ? answer.trim().toUpperCase() === payloadText
    : (level === 2 || level === 4)
      ? selected.length === expected.length
      : setsMatch(selected, expected);

  return (
    <div className="app">
      <header>
        <h1>QR Decoder Trainer</h1>
        <p>Learn the logic behind manual QR decoding in five guided levels.</p>
      </header>

      <section className="hud">
        <div><strong>Level:</strong> {level} / 5</div>
        <div><strong>Score:</strong> {score}</div>
        <button onClick={() => setShowHint((h) => !h)}>
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>
      </section>

      <section className="panel">
        <h2>{levelData.title}</h2>
        <p>{levelData.description}</p>
        {showHint && <p className="hint">Hint: {levelData.hint}</p>}
      </section>

      <Board
        board={board}
        selectedKeys={selectedKeys}
        expectedKeys={expectedKeys}
        onCellClick={onCellClick}
        level={level}
      />

      {level === 5 && (
        <section className="decode-box">
          <p><strong>Extracted bits:</strong> {payloadBits}</p>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type decoded text"
          />
          <button onClick={submitFinal}>Check Answer</button>
        </section>
      )}

      <section className="controls">
        <button onClick={resetLevel}>Reset Level</button>
        <button onClick={nextLevel} disabled={level === 5 || !levelComplete}>
          Next Level
        </button>
      </section>

      <p className="message">{message}</p>
    </div>
  );
}

function Board({ board, selectedKeys, expectedKeys, onCellClick, level }) {
  return (
    <div className="grid" role="grid" aria-label="QR learning board">
      {board.map((row, r) =>
        row.map((cell, c) => {
          const k = keyFor(r, c);
          const selected = selectedKeys.has(k);
          const expected = expectedKeys.has(k);
          const classes = ["cell", cell.base ? "dark" : "light"];

          if (selected) classes.push("selected");
          if (level === 1 && expected) classes.push("guide");

          return (
            <button
              key={k}
              className={classes.join(" ")}
              onClick={() => onCellClick(r, c)}
              title={`row ${r}, col ${c}`}
            >
              {selected ? "●" : ""}
            </button>
          );
        })
      )}
    </div>
  );
}

function setsMatch(selected, expected) {
  if (selected.length !== expected.length) return false;
  const s = new Set(selected.map(([r, c]) => keyFor(r, c)));
  return expected.every(([r, c]) => s.has(keyFor(r, c)));
}

function level3MaskTargets() {
  const targets = [];
  for (let r = 5; r < 9; r += 1) {
    for (let c = 5; c < 9; c += 1) {
      if ((r + c) % 2 === 0) targets.push([r, c]);
    }
  }
  return targets;
}

function level4Path() {
  return [
    [8, 8], [8, 7], [7, 8], [7, 7],
    [6, 8], [6, 7], [5, 8], [5, 7],
    [4, 8], [4, 7], [3, 8], [3, 7],
    [2, 8], [2, 7], [1, 8], [1, 7]
  ];
}

export default App;
