import React from "react";

function Loading() {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 44 44"
      style={{ display: "block", margin: "20px auto" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="22"
        cy="22"
        r="20"
        fill="none"
        stroke="#60A5FA"
        strokeWidth="4"
      >
        <animate
          attributeName="r"
          from="20"
          to="0"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

export default Loading;
