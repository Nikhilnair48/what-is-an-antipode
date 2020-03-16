import React from "react";
import "./styles.css";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";

type Props = {};

type state = {};

const MyNavBar = ({}: Props) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
      <Navbar.Brand href="/">Antipode Visualizer</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    </Navbar>
  );
};

export default MyNavBar;
