import React, { useEffect, useState, useRef } from "react";
import "./index.css";

const buttons = [
  "X", "Circle", "Square", "Triangle",
  "L1", "L2", "L3", "R1", "R2", "R3",
  "D-Up", "D-Down", "D-Left", "D-Right"
];

const buttonMap = {
  X:         { cx: 970, cy: 570, index: 0 },
  Circle:    { cx: 1020, cy: 520, index: 1 },
  Square:    { cx: 920, cy: 520, index: 2 },
  Triangle:  { cx: 970, cy: 470, index: 3 },
  L1:        { cx: 300, cy: 75, index: 4 },
  R1:        { cx: 930, cy: 75, index: 5 },
  L2:        { cx: 300, cy: 30, index: 6, analog: true },
  R2:        { cx: 930, cy: 30, index: 7, analog: true },
  L3:        { cx: 420, cy: 530, index: 10 },
  R3:        { cx: 800, cy: 530, index: 11 },
  "D-Up":    { cx: 300, cy: 470, index: 12 },
  "D-Down":  { cx: 300, cy: 570, index: 13 },
  "D-Left":  { cx: 250, cy: 520, index: 14 },
  "D-Right": { cx: 350, cy: 520, index: 15 }
};

function App() {
  const [target, setTarget] = useState(null);
  const [feedback, setFeedback] = useState("");
  const previousState = useRef({});
  const wrongPressTimeout = useRef(null);

  useEffect(() => {
    pickRandomButton();
    const interval = setInterval(checkGamepadInput, 50);
    return () => clearInterval(interval);
  }, [target]);

  const pickRandomButton = () => {
    setTarget(buttons[Math.floor(Math.random() * buttons.length)]);
  };

  const checkGamepadInput = () => {
    const gp = navigator.getGamepads()[0];
    if (!gp || !gp.connected || !target) return;

    for (const [label, { index, analog }] of Object.entries(buttonMap)) {
      const button = gp.buttons[index];
      const wasPressed = previousState.current[index] || false;
      const isPressed = analog ? button.value > 0.5 : button.pressed;

      if (!wasPressed && isPressed) {
        previousState.current[index] = true;

        if (label === target) {
          setFeedback("✅ Correct!");
          pickRandomButton();
          return;
        } else {
          setFeedback("❌ Wrong button");
          clearTimeout(wrongPressTimeout.current);
          wrongPressTimeout.current = setTimeout(() => setFeedback(""), 1000);
        }
      } else {
        previousState.current[index] = isPressed;
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <h1 className="text-white text-2xl mb-4">Press: {target}</h1>
      <div className="relative" style={{ width: 1229, height: 768 }}>
        <img src="/controller_bg.png" alt="Controller" className="absolute top-0 left-0 w-full h-full" />
        <svg className="absolute top-0 left-0" width="1229" height="768">
          {Object.entries(buttonMap).map(([label, { cx, cy }]) => (
            <g key={label}>
              <circle
                cx={cx}
                cy={cy}
                r={25}
                fill={label === target ? "yellow" : "transparent"}
                stroke={label === target ? "white" : "transparent"}
                strokeWidth={3}
              />
            </g>
          ))}
        </svg>
      </div>
      <div className="text-white mt-4 h-6">{feedback}</div>
    </div>
  );
}

export default App;
