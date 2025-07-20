import React from "react";
import "./styles.css";

export default function LetterCircle({ status, current }) {
  const N = status.length;
  const radius = 170; // match your styles
  const letterSize = 52; // match .rosco-letter width/height

  return (
    <div className="rosco-circle">
      {status.map((item, i) => {
        const angle = (2 * Math.PI * i) / N - Math.PI / 2; // Start at top
        const x = Math.cos(angle) * radius + radius + 20;
        const y = Math.sin(angle) * radius + radius + 20;
        let className = "rosco-letter";
        if (i === current) className += " current";
        if (item.state === "correct") className += " correct";
        if (item.state === "wrong") className += " wrong";
        if (item.state === "pending") className += " pending";
        return (
          <div
            key={item.letter}
            className={className}
            style={{
              left: x - letterSize / 2,
              top: y - letterSize / 2,
            }}
          >
            {item.letter.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}
