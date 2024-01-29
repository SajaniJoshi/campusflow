import React, { useEffect, useState, useRef } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

import "./Dropdown.css";

const Dropdown = ({ options, value, onChange, placeholderText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const divElement = useRef();

  useEffect(() => {
    const handler = event => {
      if (!divElement.current) {
        return;
      }
      if (!divElement.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handler, true);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  const handleClick = () => {
    setIsOpen(currentIsOpen => !currentIsOpen);
  };

  const handleColorClick = option => {
    setIsOpen(false);
    onChange(option);
  };

  const renderedOptions = options.map(option => {
    return (
      <div
        className="renderedOptions"
        onClick={() => handleColorClick(option)}
        key={option.value}
      >
        {option.label}
      </div>
    );
  });

  const zIndexValue = isOpen ? 1000 : 1;

  return (
    <div
      className="dropdownWrapper"
      ref={divElement}
      style={{ zIndex: zIndexValue }}
    >
      <div className="dropdown__options" onClick={handleClick}>
        {value?.label || placeholderText}
        {isOpen ? (
          <FaAngleUp className="angleIcon" />
        ) : (
          <FaAngleDown className="angleIcon" />
        )}
      </div>
      {isOpen && (
        <div className="dropdown__open-options">{renderedOptions}</div>
      )}
    </div>
  );
};

export default Dropdown;
