import React from "react";

const Gravatar = ({ fullName, size }) => {
  const userName = fullName.toLowerCase();

  const gravatarURL = `https://www.gravatar.com/avatar/${userName}?s=${size}&d=retro`;

  return (
    <div className="gravatar">
      <img
        src={gravatarURL}
        alt="Gravatar Logo"
        style={{
          borderRadius: "50%",
          display: "block",
          margin: "0 auto",
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export default Gravatar;
