/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"

import { createGlobalStyle } from "styled-components"
import "normalize.css"

const Layout = ({ children }) => {
  return (
    <>
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
    background: var(--blue);
  }
`
