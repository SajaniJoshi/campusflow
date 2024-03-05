import React from "react";
import "./SearchBox.css";
import { FaSearch } from "react-icons/fa";

const SearchBox = ({ placeholderText, setSearchTerm }) => {
  const handleKeyDown = event => {
    if (event.key === "Enter") {
      setSearchTerm(event.target.value);
    }
  };
  return (
    <>
      <div className="searchContainer">
        <div className="searchBox">
          <span style={{ marginRight: "10px" }}>
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder={placeholderText}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </>
  );
};

export default SearchBox;
