import React, { useEffect, useState } from "react";
import "./index.css";

const buttons = [
  "X", "Circle", "Square", "Triangle",
  "L1", "L2", "R1", "R2",
  "D-Up", "D-Down", "D-Left", "D-Right"
];

const buttonMap = {
  X: { cx: 280, cy: 250 },
  Circle: { cx: 320, cy: 210 },
  Square: { cx: 240, cy: 210 },
  Triangle: { cx: 280, cy: 170 },
  L1: { cx: 60, cy: 60 },
  L2: { cx: 60, cy: 20 },
  R1: { cx: 500, cy: 60 },
  R2: { cx: 500, cy: 20 },
  "D-Up": { cx: 100, cy: 200 },
  "D-Down": { cx: 100, cy: 260 },
  "D-Left": { cx: 60, cy: 230 },
  "D-Right": { cx: 140, cy: 230 }
};

function App() {
  const [target, setTarget] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    pickRandomButton();
    const listener = (e) => {
      const key = e.key.toUpperCase();
      if (key === target?.toUpperCase()) {
        setFeedback("✅ Correct!");
        setTimeout(() => {
          pickRandomButton();
          setFeedback("");
        }, 1000);
      } else {
        setFeedback("❌ Wrong button");
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [target]);

  const pickRandomButton = () => {
    const next = buttons[Math.floor(Math.random() * buttons.length)];
    setTarget(next);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-white text-2xl mb-4">Press: {target}</h1>
      <svg width="600" height="400" style={{ border: "1px solid #555" }}>
        {Object.entries(buttonMap).map(([label, { cx, cy }]) => (
          <g key={label}>
            <circle
              cx={cx}
              cy={cy}
              r={20}
              fill={label === target ? "yellow" : "#444"}
              stroke="white"
              strokeWidth={2}
            />
            <text
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              fill="white"
              fontSize="12"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
      <div className="text-white mt-4 h-6">{feedback}</div>
    </div>
  );
}

export default App;
