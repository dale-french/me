import React, { useContext } from "react"
import styled from "styled-components"

import ThemeContext from "../contexts/ThemeContext"
import theme from "../utils/theme"
import { Layout, Header, Sticky, SEO } from "../components"

const AboutPage = () => {
  const { darkMode } = useContext(ThemeContext)

  return (
    <Layout>
      <SEO title="A (very) little bit about me" />
      <Header />
      <Section darkMode={darkMode}>
        <h1>
          Hi!
          <br />
          {`I'm`} an experienced
          <br />
          <span>Full Stack Developer</span>
          <br />
          Based in Ballito,
          <br />
          <span>South Africa</span>.
        </h1>
        <h3>
          I have been doing web development <span>since IE7</span> and have been
          working as a professional developer for the <span>past 8 years</span>.{" "}
          {`I'm`} really good at <span>frontend</span> whether its web-based or
          mobile and have also shipped fairly complex{" "}
          <span>backends and {`API's`}</span> end-to-end.
        </h3>
      </Section>
      <Sticky />
    </Layout>
  )
}

export default AboutPage

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
