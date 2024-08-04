import React from "react";
import "./searchBar.css";

const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="searchBar"
      value={value}
      onChange={onChange}
      placeholder="search flights"
    />
  );
};

export default SearchBar;
