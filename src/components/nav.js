import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"

import theme from "../utils/theme"

const Nav = ({ to, children }) => {
  return <StyledNav href={to}>{children}</StyledNav>
}

Nav.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export { Nav }

// Component Styles
const StyledNav = styled.a`
  position: relative;
  margin: 0 auto 3.6em;
  padding: 0 0.6rem;
  span {
    color: ${theme.colors.white};
    z-index: 1;
    font-size: 1.6rem;
    line-height: 1.5;
    border-bottom: 1px dotted ${theme.colors.white};
    position: relative;
    transition: all 0.25s ease-in-out;
  }
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0;
    width: 100%;
    transition: height 0.25s ease-in-out;
    will-change: transform;
    background-color: #f1c40f;
    z-index: 0;
  }
  &:hover {
    span {
      color: ${theme.colors.blue};
      border-color: ${theme.colors.blue};
    }
    &:after {
      height: 24px;
    }
  }
`
