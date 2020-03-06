import React, { useContext } from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { createGlobalStyle } from "styled-components"

import ThemeContext from "../contexts/ThemeContext"
import theme from "../utils/theme"
import "normalize.css"

const Layout = ({ children }) => {
  const { darkMode } = useContext(ThemeContext)

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
      <GlobalStyle darkMode={darkMode} />
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
    background: ${props =>
      props.darkMode ? theme.colors.black : theme.colors.white};
    user-select: none;
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
    color: ${props =>
      props.darkMode ? theme.colors.white : theme.colors.black};
    
    strong {
      color: ${theme.colors.blue};
    }
  }
  h3 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  a, p {
    font-family: 'Roboto', sans-serif;
    font-size: 1.3rem;
    line-height: 1.8;
    color: ${props =>
      props.darkMode ? theme.colors.white : theme.colors.black};
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
