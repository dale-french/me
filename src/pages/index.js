import React from "react"
import styled from "styled-components"
import theme from "../utils/theme"
import { Layout, Nav, SEO, Typist, Header } from "../components"

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Dale French - Full Stack Developer" />
      <Header />
      <Section>
        <Nav to="/about/">
          <span>Who am I?</span>
        </Nav>
        <h1>Dale French</h1>
        <h2>
          Full Stack Developer who likes building stuff with
          <br />
          <Typist />
        </h2>

        <Footer>
          <p>
            © {new Date().getFullYear()} - Dale French
            <br />
            Built with{" "}
            <a
              href="https://www.gatsbyjs.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gatsby
            </a>{" "}
            • Hosted on{" "}
            <a
              href="https://www.netlify.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netlify
            </a>{" "}
            • Code on{" "}
            <a
              href="https://github.com/dale-french/me"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </Footer>
      </Section>
    </Layout>
  )
}
export default IndexPage

// Component Styles
const Section = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  text-align: center;
  padding: 1.5rem 3rem;
  h1 {
    color: ${theme.colors.blue};
  }
  h2 {
    span {
      color: white;
    }
    .Cursor {
      visibility: hidden;
    }
  }
`

const Footer = styled.footer`
  padding-top: 2rem;
  a {
    color: ${theme.colors.blue};
    text-decoration-line: underline;
    text-decoration-style: dotted;
  }
`
