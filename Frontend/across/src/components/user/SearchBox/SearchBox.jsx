import React from "react";
import "./SearchBox.css";
import { FaSearch } from "react-icons/fa";

const SearchBox = () => {
  return (
    <>
      <div className="searchContainer">
        <div className="searchBox">
          <span style={{ marginRight: "10px" }}>
            <FaSearch />
          </span>
          <input type="text" placeholder="Search" />
        </div>
      </div>
    </>
  );
};

export default SearchBox;
