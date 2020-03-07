import React from "react"
import { Layout, Header, Sticky, SEO, Content } from "../components"

const UsesPage = () => (
  <Layout>
    <SEO title="Uses - the stuff I use everyday" />
    <Header />
    <Content>
      <h1>
        <span>/USES</span>
        <br />
        Stuff I use on a daily basis.
      </h1>
      <h3>Hardware</h3>
      <ul>
        <li>MacBook Pro (15-inch, 2018)</li>
        <li>Sony WH-1000XM3 Headphones</li>
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
        <li>Figma for the occasional UI design</li>
        <li>Postman for testing REST API endpoints</li>
        <li>Slack for communication</li>
      </ul>
    </Content>
    <Sticky />
  </Layout>
)

export default UsesPage
