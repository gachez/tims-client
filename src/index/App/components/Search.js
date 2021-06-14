import React from "react";

export default function Search(props) {
  return (
    <>
      <form id="search" role="search" style={{ display: "flex" }}>
        <input
          type="search"
          id="search-input"
          name="search"
          style={{
            maxHeight: "40px",
            marginRight: ".5rem",
            borderRadius: "4px",
          }}
          spellcheck="false"
        />
        <DropdownButton variant="success" title="Search for">
          <Dropdown.Item>Organisation</Dropdown.Item>
          <Dropdown.Item>Contact Person</Dropdown.Item>
          <Dropdown.Item>Designation</Dropdown.Item>
        </DropdownButton>
      </form>
    </>
  );
}
