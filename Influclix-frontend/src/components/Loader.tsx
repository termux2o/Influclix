// src/components/Loader.tsx

import React from "react";
import "./Loader.css";          // ← THE KEY LINE — this is what makes the spinner appear

interface LoaderProps {
  message?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  message = "Loading…",
  size = "medium",
  fullScreen = false,
}) => {
  return (
    <div className={`app-loader ${fullScreen ? "app-loader-fullscreen" : ""}`}>
      <div className={`app-loader-spinner app-loader-${size}`}>
        <div className="app-loader-ring"></div>
        <div className="app-loader-dot"></div>
      </div>
      {message && <p className="app-loader-message">{message}</p>}
    </div>
  );
};

export default Loader;