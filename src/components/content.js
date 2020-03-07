import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"

import theme from "../utils/theme"

function Content({ children }) {
  return <Section>{children}</Section>
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
    color: ${props => props.theme.text};

    @media ${theme.devices.tablet} {
      font-size: 5rem;
    }

    span {
      color: ${props => props.theme.primary};
    }
  }
  h3 {
    font-size: 2.5rem;

    @media ${theme.devices.tablet} {
      font-size: 1.8rem;
    }

    span {
      color: ${props => props.theme.primary};
    }
  }
`
