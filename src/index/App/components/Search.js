import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

const categoriesOfSearch = ['Organisation', 'Contact Person', 'Designation'];
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
          onChange={(e) => props.handleInput(e.target.value)}
          spellcheck="false"
        />
        <DropdownButton variant="success" title="Search for">
            {
                categoriesOfSearch.map(category => (
                    <Dropdown.Item onClick={() => props.handleSearchInput(category, props.searchInput)}>
                        {category}
                    </Dropdown.Item>
                ))
            }
        </DropdownButton>
      </form>
    </>
  );
}
