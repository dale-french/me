import { createGlobalStyle } from "styled-components"
import theme from "../utils/theme"

const GlobalStyles = createGlobalStyle`
  html {
    font-family: 'Catamaran', sans-serif;
    font-size: 10px;
  }
  html, body, #___gatsby, #gatsby-focus-wrapper, main {
    height: 100%;
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  h1 {
    font-size: 12rem;
    line-height: 1;
    margin: 0 0 1rem;
    color: ${props => props.theme.primary};

    @media ${theme.devices.tablet} {
      font-size: 10rem
    }
  }
  h2 {
    font-size: 3.8rem;
    margin: 0 0 2rem;
    line-height: 1.3;
    
    @media ${theme.devices.tablet} {
      font-size: 3rem
    }
    
    strong {
      color: ${theme.colors.blue};
    }
  }
  h3 {
    font-size: 2.5rem;
    line-height: 1.2;

    @media ${theme.devices.tablet} {
      font-size: 2rem
    }
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

export default GlobalStyles
