import React, { useEffect, useState, useRef } from "react";
import "./index.css";

const buttons = [
  "X", "Circle", "Square", "Triangle",
  "L1", "L2", "L3", "R1", "R2", "R3",
  "D-Up", "D-Down", "D-Left", "D-Right"
];

const buttonMap = {}; // Empty for now, user will gather coordinates

function App() {
  const [target, setTarget] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    });
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <h1 className="text-white text-xl mb-2">Mouse X: {mousePos.x}, Y: {mousePos.y}</h1>
      <div
        className="relative"
        style={{ width: 1229, height: 768 }}
        onMouseMove={handleMouseMove}
      >
        <img
          src="/controller_bg.png"
          alt="Controller"
          className="absolute top-0 left-0 w-full h-full"
        />
        <svg className="absolute top-0 left-0" width="1229" height="768"></svg>
      </div>
    </div>
  );
}

export default App;
