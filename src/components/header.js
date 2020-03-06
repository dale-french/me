import React, { useContext } from "react"
import styled from "styled-components"
import ThemeContext from "../contexts/ThemeContext"
import theme from "../utils/theme"
import { DarkModeToggle } from "."

const Header = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext)

  return (
    <StyledHeader>
      <Logo href="/" darkMode={darkMode}>
        D<span>/</span>F
      </Logo>
      <ToggleContainer>
        <DarkModeToggle
          darkMode={darkMode}
          onClick={() => {
            setDarkMode(!darkMode)
            localStorage.setItem("dark", JSON.stringify(!darkMode))
          }}
        />
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
  color: ${props => (props.darkMode ? theme.colors.white : theme.colors.black)};
  transition: color 0.25s ease-in-out;
  will-change: opacity;
  span {
    color: ${theme.colors.blue};
    transition: color 0.25s ease-in-out;
    will-change: opacity;
  }
  &:hover {
    color: ${theme.colors.blue};
    span {
      color: ${props =>
        props.darkMode ? theme.colors.white : theme.colors.black};
    }
  }
`

const ToggleContainer = styled.div`
  padding-top: 0.2rem;
`
