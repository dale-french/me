import React, { useContext } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"

import theme from "../utils/theme"
import ThemeContext from "../contexts/ThemeContext"

function Content({ children }) {
  const { darkMode } = useContext(ThemeContext)

  return <Section darkMode={darkMode}>{children}</Section>
}

Content.propTypes = {
  children: PropTypes.node,
}

export { Content }

// Component Styles
const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 3rem;
  h1 {
    font-size: 8rem;
    color: ${props =>
      props.darkMode ? theme.colors.white : theme.colors.black};

    @media ${theme.devices.tablet} {
      font-size: 5rem;
    }

    span {
      color: ${theme.colors.blue};
    }
  }
  h3 {
    color: ${props =>
      props.darkMode ? theme.colors.white : theme.colors.black};
    font-size: 2.5rem;

    @media ${theme.devices.tablet} {
      font-size: 1.8rem;
    }

    span {
      color: ${theme.colors.blue};
    }
  }
`
