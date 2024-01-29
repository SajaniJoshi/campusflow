import React from "react";
import "./MenuCloseButton.css";

const MenuCloseButton = () => {
  return (
    <div className="menuCloseButton">
      <button id="menu-close-button">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="20" fill="black" fillOpacity="0.1" />

          <path
            d="M12.9719 16H30C30.5531 16 31 15.5531 31 15C31 14.4469 30.5531 14 30 14H12.9719C12.4478 14 12 14.4478 12 14.9719C12 15.4959 12.4478 16 12.9719 16Z"
            fill="black"
            fillOpacity="0.6"
            transform="translate(-6, 25) rotate(-45)"
          />
          <path
            d="M12.9719 26H30C30.5531 26 31 25.5531 31 25C31 24.4469 30.5531 24 30 24H12.9719C12.4478 24 12 24.4478 12 24.9719C12 25.4959 12.4478 26 12.9719 26Z"
            fill="black"
            fillOpacity="0.6"
            transform="translate(21, -12) rotate(45)"
          />
        </svg>
      </button>
    </div>
  );
};

export default MenuCloseButton;
