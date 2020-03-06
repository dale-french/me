import React from "react"
import styled from "styled-components"

import theme from "../utils/theme"
import { Layout, SEO, Sticky } from "../components"

const NotFoundPage = () => (
  <Layout>
    <SEO title="A (very) little bit about me" />
    <Section>
      <h1>
        Page <span>Not Found</span>
      </h1>
      <h3>💩 You just hit a route that {`doesn't`} exist 💩</h3>
    </Section>
    <Sticky />
  </Layout>
)

export default NotFoundPage

// Component Styles
const Section = styled.section`
  text-align: center;
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 30px 30px;
  h1 {
    font-size: 8rem;
    color: ${theme.colors.black};
    span {
      color: ${theme.colors.blue};
    }
  }
  h3 {
    color: ${theme.colors.black};
    font-size: 2.5rem;
    span {
      color: ${theme.colors.blue};
    }
  }
`
