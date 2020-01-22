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

export default Layout

// Global Styles
const GlobalStyle = createGlobalStyle`
  html {
    --blue: #203447;
    --orange: #FFCC66;
    --white: #FFFFFF;
    background: var(--blue);
    font-family: 'Catamaran', sans-serif;
    font-size: 10px;
  }
  h1 {
    font-size: 12rem;
    color: var(--orange);
    line-height: 2;
    margin: 0 0 2rem;
  }
  h2 {
    font-size: 3.8rem;
    color: var(--white);
    margin: 0 0 2rem;
  }
  a, span, p {
    font-family: 'Roboto', sans-serif;
  }
  a {
    color: var(--orange);
    text-decoration-line: underline;
    text-decoration-style: dotted;
  }
  span {
    color: var(--white);
  }
`
