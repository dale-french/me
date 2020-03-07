import React from "react"
import styled from "styled-components"
import { DarkModeToggle } from "."

const Header = () => {
  return (
    <StyledHeader>
      <Logo href="/">
        D<span>/</span>F
      </Logo>
      <ToggleContainer>
        <DarkModeToggle />
      </ToggleContainer>
    </StyledHeader>
  )
}

Header.propTypes = {}

export { Header }

// Component Styles
const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 3rem;
`

const Logo = styled.a`
  font-family: "Catamaran", sans-serif;
  font-size: 2.7rem;
  color: ${props => props.theme.text};
  transition: color 0.25s ease-in-out;
  will-change: opacity;
  span {
    color: ${props => props.theme.primary};
    transition: color 0.25s ease-in-out;
    will-change: opacity;
  }
  &:hover {
    color: ${props => props.theme.primary};
    span {
      color: ${props => props.theme.text};
    }
  }
`

const ToggleContainer = styled.div`
  padding-top: 0.2rem;
`
