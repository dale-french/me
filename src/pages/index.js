import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import theme from "../utils/theme"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Section>
      {/* <Link to="/about/">Who am I?</Link> */}
      <h1>Dale French</h1>
      <h2>
        Full Stack Developer who likes building stuff with
        <br />
        <span>Styled Components</span>
      </h2>

      <Footer>
        <p>
          © {new Date().getFullYear()} - Dale French
          <br />
          Built with <a href="#">Gatsby</a> • Hosted on <a href="#">Netlify</a>{" "}
          • Code on <a href="#">GitHub</a>
        </p>
      </Footer>
    </Section>
  </Layout>
)

export default IndexPage

// Component Styles
const Section = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  background: ${theme.colors.blue};
  text-align: center;
  h1 {
    color: ${theme.colors.orange};
  }
  h2 {
    color: ${theme.colors.white};
    span {
      color: ${theme.colors.orange};
    }
  }
`

const Footer = styled.footer`
  padding-top: 2rem;
  p {
    color: ${theme.colors.white};
  }
  a {
    color: ${theme.colors.orange};
  }
`
