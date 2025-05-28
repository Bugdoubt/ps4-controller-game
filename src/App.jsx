import React, { useEffect, useState, useRef } from "react";
import "./index.css";

const buttons = [
  "X", "Circle", "Square", "Triangle",
  "L1", "L2", "L3", "R1", "R2", "R3",
  "D-Up", "D-Down", "D-Left", "D-Right"
];

const buttonMap = {
  Square:    { cx: 912, cy: 209, index: 2, shape: "circle" },
  Triangle:  { cx: 1002, cy: 123, index: 3, shape: "circle" },
  Circle:    { cx: 1093, cy: 212, index: 1, shape: "circle" },
  X:         { cx: 1007, cy: 300, index: 0, shape: "circle" },
  R3:        { cx: 810, cy: 378, index: 11, shape: "circle" },
  L3:        { cx: 418, cy: 377, index: 10, shape: "circle" },
  L1:        { cx: 246, cy: 25, index: 4, shape: "rect" },
  L2:        { cx: 294, cy: 30, index: 6, analog: true, shape: "rect" },
  R1:        { cx: 963, cy: 30, index: 5, shape: "rect" },
  R2:        { cx: 1029, cy: 30, index: 7, analog: true, shape: "rect" },
  "D-Up":    { cx: 222, cy: 146, index: 12, shape: "up" },
  "D-Down":  { cx: 223, cy: 275, index: 13, shape: "down" },
  "D-Left":  { cx: 157, cy: 212, index: 14, shape: "left" },
  "D-Right": { cx: 284, cy: 214, index: 15, shape: "right" }
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

  const renderShape = (label, cx, cy, shape) => {
    const size = (["L1", "L2", "R1", "R2"].includes(label)) ? 25 : 50;
    const isActive = label === target;
    const fill = isActive ? "red" : "transparent";
    const stroke = isActive ? "white" : "transparent";

    switch (shape) {
      case "circle":
        return <circle cx={cx} cy={cy} r={size} fill={fill} stroke={stroke} strokeWidth={3} />;
      case "rect":
        return <rect x={cx - 30} y={cy - 15} width="60" height="30" rx="8" fill={fill} stroke={stroke} strokeWidth={3} />;
      case "up":
        return <polygon points={`${cx},${cy - 30} ${cx - 15},${cy + 15} ${cx + 15},${cy + 15}`} fill={fill} stroke={stroke} strokeWidth={3} strokeLinejoin="round" />;
        return <polygon points={`${cx},${cy - 40} ${cx - 30},${cy + 20} ${cx + 30},${cy + 20}`} fill={fill} stroke={stroke} strokeWidth={3} />;
      case "down":
        return <polygon points={`${cx},${cy + 30} ${cx - 15},${cy - 15} ${cx + 15},${cy - 15}`} fill={fill} stroke={stroke} strokeWidth={3} strokeLinejoin="round" />;
        return <polygon points={`${cx},${cy + 40} ${cx - 30},${cy - 20} ${cx + 30},${cy - 20}`} fill={fill} stroke={stroke} strokeWidth={3} />;
      case "left":
        return (
      <>
        <rect x={cx - 40} y={cy - 20} rx="10" ry="10" width="50" height="40" fill={fill} stroke={stroke} strokeWidth={3} />
        <polygon points={`${cx + 10},${cy} ${cx + 30},${cy - 12} ${cx + 30},${cy + 12}`} fill={fill} stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
      </>
    );
        return <polygon points={`${cx - 40},${cy} ${cx + 20},${cy - 30} ${cx + 20},${cy + 30}`} fill={fill} stroke={stroke} strokeWidth={3} />;
      case "right":
        return <polygon points={`${cx + 30},${cy} ${cx - 15},${cy - 15} ${cx - 15},${cy + 15}`} fill={fill} stroke={stroke} strokeWidth={3} strokeLinejoin="round" />;
        return <polygon points={`${cx + 40},${cy} ${cx - 20},${cy - 30} ${cx - 20},${cy + 30}`} fill={fill} stroke={stroke} strokeWidth={3} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <div className="relative" style={{ width: 1229, height: 768 }}>
        <img src="/controller_bg.png" alt="Controller" className="absolute top-0 left-0 w-full h-full" />
        <svg className="absolute top-0 left-0" width="1229" height="768">
          {Object.entries(buttonMap).map(([label, { cx, cy, shape }]) => (
            <g key={label}>{renderShape(label, cx, cy, shape)}</g>
          ))}
        </svg>
        <div className="absolute" style={{ top: 600, left: 450 }}>
          <h1 className="text-white text-2xl">Press: {target}</h1>
        </div>
      </div>
      <div className="text-white mt-4 h-6">{feedback}</div>
    </div>
  );
}

export default App;
