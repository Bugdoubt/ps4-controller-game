import React, { useEffect, useState } from "react";
import "./index.css";

const buttons = [
  "X", "Circle", "Square", "Triangle",
  "L1", "L2", "L3", "R1", "R2", "R3",
  "D-Up", "D-Down", "D-Left", "D-Right"
];

const buttonMap = {
  X: { cx: 450, cy: 300, index: 0 },
  Circle: { cx: 500, cy: 250, index: 1 },
  Square: { cx: 400, cy: 250, index: 2 },
  Triangle: { cx: 450, cy: 200, index: 3 },
  L1: { cx: 150, cy: 80, index: 4 },
  R1: { cx: 750, cy: 80, index: 5 },
  L2: { cx: 150, cy: 30, index: 6, analog: true },
  R2: { cx: 750, cy: 30, index: 7, analog: true },
  L3: { cx: 200, cy: 300, index: 10 },
  R3: { cx: 700, cy: 300, index: 11 },
  "D-Up": { cx: 250, cy: 200, index: 12 },
  "D-Down": { cx: 250, cy: 280, index: 13 },
  "D-Left": { cx: 210, cy: 240, index: 14 },
  "D-Right": { cx: 290, cy: 240, index: 15 }
};

function App() {
  const [target, setTarget] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    pickRandomButton();
    const interval = setInterval(checkGamepadInput, 100);
    return () => clearInterval(interval);
  }, [target, cooldown]);

  const pickRandomButton = () => {
    const next = buttons[Math.floor(Math.random() * buttons.length)];
    setTarget(next);
  };

  const checkGamepadInput = () => {
    if (cooldown) return;
    const gp = navigator.getGamepads()[0];
    if (!gp || !gp.connected || !target) return;

    const { index, analog } = buttonMap[target];
    const value = analog ? gp.buttons[index]?.value : gp.buttons[index]?.pressed;

    if ((analog && value > 0.5) || (!analog && value)) {
      setFeedback("✅ Correct!");
      setCooldown(true);
      setTimeout(() => {
        setCooldown(false);
        setFeedback("");
        pickRandomButton();
      }, 800);
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <h1 className="text-white text-2xl mb-4">Press: {target}</h1>
      <svg width="900" height="400" style={{ background: '#111', borderRadius: 12 }}>
        {Object.entries(buttonMap).map(([label, { cx, cy }]) => (
          <g key={label}>
            <circle
              cx={cx}
              cy={cy}
              r={22}
              fill={label === target ? "yellow" : "#333"}
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
