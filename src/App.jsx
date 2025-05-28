import React, { useEffect, useState } from "react";
import "./index.css";

const buttons = [
  "X", "Circle", "Square", "Triangle",
  "L1", "R1", "D-Up", "D-Down", "D-Left", "D-Right"
];

const buttonMap = {
  X: { cx: 280, cy: 250, index: 0 },
  Circle: { cx: 320, cy: 210, index: 1 },
  Square: { cx: 240, cy: 210, index: 2 },
  Triangle: { cx: 280, cy: 170, index: 3 },
  L1: { cx: 60, cy: 60, index: 4 },
  R1: { cx: 500, cy: 60, index: 5 },
  "D-Up": { cx: 100, cy: 200, index: 12 },
  "D-Down": { cx: 100, cy: 260, index: 13 },
  "D-Left": { cx: 60, cy: 230, index: 14 },
  "D-Right": { cx: 140, cy: 230, index: 15 }
};

function App() {
  const [target, setTarget] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    pickRandomButton();
    const interval = setInterval(checkGamepadInput, 100);
    return () => clearInterval(interval);
  }, [target]);

  const pickRandomButton = () => {
    const next = buttons[Math.floor(Math.random() * buttons.length)];
    setTarget(next);
  };

  const checkGamepadInput = () => {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];
    if (!gp || !gp.connected || !target) return;

    const expectedIndex = buttonMap[target].index;
    const buttonPressed = gp.buttons[expectedIndex]?.pressed;

    if (buttonPressed) {
      setFeedback("✅ Correct!");
      setTimeout(() => {
        pickRandomButton();
        setFeedback("");
      }, 1000);
    }
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
