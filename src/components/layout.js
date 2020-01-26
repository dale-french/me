/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"

import { createGlobalStyle } from "styled-components"
import "normalize.css"

const Layout = ({ children }) => {
  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=Catamaran:900&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      <GlobalStyle />
      <main>{children}</main>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export { Layout }

// Global Styles
const GlobalStyle = createGlobalStyle`
  html {
    font-family: 'Catamaran', sans-serif;
    font-size: 10px;
  }
  html, body, #___gatsby, #gatsby-focus-wrapper, main {
    height: 100%;
  }
  h1 {
    font-size: 12rem;
    line-height: 1;
    margin: 0 0 1rem;
  }
  h2 {
    font-size: 3.8rem;
    margin: 0 0 2rem;
    line-height: 1.3;
  }
  h3 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  a, p {
    font-family: 'Roboto', sans-serif;
    font-size: 1.3rem;
    line-height: 1.8;
  }
  a {
    text-decoration: none;
  }
  main {
    display: flex;
    flex-direction: column;
  }
  ul {
    li {
      font-family: 'Roboto', sans-serif;
      font-size: 1.6rem;
      margin-bottom: 1rem;
    }
  }
`
