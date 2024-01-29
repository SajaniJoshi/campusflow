import React from "react";
import "./MenuOpenButton.css";

const MenuOpenButton = () => {
  return (
    <div className="menuOpenButton">
      <button id="menu-open-button">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="20" fill="black" fillOpacity="0.1" />
          <path
            d="M12.9719 16H25C25.5531 16 26 15.5531 26 15C26 14.4469 25.5531 14 25 14H12.9719C12.4478 14 12 14.4478 12 14.9719C12 15.4959 12.4478 16 12.9719 16ZM27 19H14.9719C14.4478 19 14 19.4469 14 20C14 20.5531 14.4478 21 14.9719 21H26.9719C27.5531 21 28 20.5531 28 20C28 19.4469 27.5531 19 27 19ZM25 24H12.9719C12.4478 24 12 24.4469 12 24.9719C12 25.4969 12.4478 26 12.9719 26H25C25.5531 26 26 25.5531 26 25C26 24.4469 25.5531 24 25 24Z"
            fill="black"
            fillOpacity="0.6"
          />
        </svg>
      </button>
    </div>
  );
};

export default MenuOpenButton;
