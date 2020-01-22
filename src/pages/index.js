import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import theme from "../utils/theme"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Typist } from "../components"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Section>
      <Link to="/about/">
        <span>Who am I?</span>
      </Link>
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
    strong {
      color: ${theme.colors.orange};
    }
    span {
      color: white;
    }
    .Cursor {
      visibility: hidden;
    }
  }
  a {
    position: relative;
    margin: 0 auto 3.6em;
    padding: 0 0.6rem;
    span {
      color: ${theme.colors.white};
      z-index: 1;
      font-size: 1.6rem;
      line-height: 1.5;
      border-bottom: 1px dotted ${theme.colors.white};
      position: relative;
      transition: all 0.25s ease-in-out;
    }
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      height: 0;
      width: 100%;
      transition: height 0.25s ease-in-out;
      will-change: transform;
      background-color: #f1c40f;
      z-index: 0;
    }
    &:hover {
      span {
        color: ${theme.colors.blue};
      }
      &:after {
        height: 24px;
      }
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
    text-decoration-line: underline;
    text-decoration-style: dotted;
  }
`
