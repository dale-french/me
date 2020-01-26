import React from "react"
import styled from "styled-components"

import theme from "../utils/theme"
import { Layout, Header, Sticky, SEO } from "../components"

const UsesPage = () => (
  <Layout>
    <SEO title="Uses - the things I use everyday" />
    <Header />
    <Section>
      <h1>
        <span>/USES</span>
        <br />
        The things I use on a daily basis.
      </h1>
      <h3>Hardware</h3>
      <ul>
        <li>MacBook Pro (15-inch, 2018)</li>
      </ul>
      <h3>Development</h3>
      <ul>
        <li>
          VSCode is my preferred IDE. I do dabble around in Android Studio and
          XCode when working on React Native projects.
        </li>
        <li>iTerm 2 with zsh</li>
        <li>
          GitLab or GitHub for repos. Terminal or GitKraken for working with
          Git.
        </li>
        <li>Zeplin for working with provided {`UI's`}</li>
        <li>Postman for testing API endpoints</li>
        <li>Slack for communication</li>
      </ul>
    </Section>
    <Sticky />
  </Layout>
)

export default UsesPage

// Component Styles
const Section = styled.section`
  background: ${theme.colors.white};
  max-width: 1100px;
  width: 100%;
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
