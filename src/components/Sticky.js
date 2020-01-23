import React from "react"
import styled from "styled-components"

import theme from "../utils/theme"

const Sticky = props => {
  return (
    <StyledSticky>
      <div>
        <h3>Where to find me</h3>
        <Social
          href="https://www.linkedin.com/in/dale-french-63101451/"
          target="_blank"
          color={"#0073b1"}
        >
          LinkedIn
        </Social>
        <Social
          href="https://github.com/dale-french"
          target="_blank"
          color={"#24292e"}
        >
          GitHub
        </Social>
        <Social href="mailto:hello@dalefrench.dev" color={"#d93025"}>
          Mail
        </Social>
      </div>
    </StyledSticky>
  )
}

Sticky.propTypes = {}

export default Sticky

// Component Styles
const StyledSticky = styled.section`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  padding: 1.5rem 3rem 1.6rem;
  background-color: ${theme.colors.white};

  div {
    display: flex;
    flex-direction: row;
    align-items: center;

    h3 {
      color: ${theme.colors.grey};
      margin: 0;
      line-height: 1;
      margin-right: 1rem;
    }
  }
`

const Social = styled.a`
  display: inline-block;
  padding: 0.7rem;
  line-height: 1;
  margin: 5px;
  color: ${theme.colors.white};
  background: ${props => props.color};
  font-size: 1.6rem;
  border-radius: 5px;
`
