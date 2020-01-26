import React from "react"
import styled from "styled-components"

import theme from "../utils/theme"
import { Layout, Header, Sticky, SEO } from "../components"

const AboutPage = () => (
  <Layout>
    <SEO title="A (very) little bit about me" />
    <Header />
    <Section>
      <h1>
        Howsit.
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

export default AboutPage

// Component Styles
const Section = styled.section`
  background: ${theme.colors.white};
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 30px 80px;
  h1 {
    font-size: 8rem;
    color: ${theme.colors.grey};
    span {
      color: ${theme.colors.orange};
    }
  }
  h3 {
    color: ${theme.colors.grey};
    font-size: 2.5rem;
    span {
      color: ${theme.colors.orange};
    }
  }
`
