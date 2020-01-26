import React from "react"
import styled from "styled-components"

import theme from "../utils/theme"

const Header = props => {
  return (
    <StyledHeader>
      <Logo href="/">
        D<span>/</span>F
      </Logo>
    </StyledHeader>
  )
}

Header.propTypes = {}

export { Header }

// Component Styles
const StyledHeader = styled.header`
  padding: 1.5rem 3rem;
`

const Logo = styled.a`
  font-family: "Catamaran", sans-serif;
  font-size: 2.7rem;
  color: ${theme.colors.grey};
  transition: color 0.25s ease-in-out;
  will-change: opacity;
  span {
    color: ${theme.colors.orange};
    transition: color 0.25s ease-in-out;
    will-change: opacity;
  }
  &:hover {
    color: ${theme.colors.orange};
    span {
      color: ${theme.colors.grey};
    }
  }
`