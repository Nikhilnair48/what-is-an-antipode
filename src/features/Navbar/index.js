import React from "react";
import "./styles.css";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";

type Props = { pastSearches: Array, onClick: Function };

type state = {};

const MyNavBar = ({ pastSearches, handleSearchClick }: Props) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
      <Navbar.Brand href="/">Antipode Visualizer</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse>
        <Nav className="ml-auto">
          <NavDropdown
            title={"Past Searches"}
            id="collasible-nav-dropdown"
            alignRight
          >
            {pastSearches &&
              pastSearches.map(item => {
                return (
                  <NavDropdown.Item
                    href="#"
                    onClick={() => handleSearchClick(item)}
                  >
                    {item.latitude},{item.longitude}
                  </NavDropdown.Item>
                );
              })}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavBar;
