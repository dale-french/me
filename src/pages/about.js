import React from "react"
import { Layout, Header, Sticky, SEO, Content } from "../components"

const AboutPage = () => (
  <Layout>
    <SEO title="A (very) little bit about me" />
    <Header />
    <Content>
      <h1>
        Hi!
        <br />
        {`I'm`} an experienced
        <br />
        <span>Full Stack Developer</span>
        <br />
        Based in Ballito,
        <br />
        <span>South Africa</span>.
      </h1>
      <h3>
        I have been doing web development <span>since IE7</span> and have been
        working as a professional developer for the <span>past 8 years</span>.{" "}
        {`I'm`} really good at <span>frontend</span> whether its web-based or
        mobile and have also shipped fairly complex{" "}
        <span>backends and {`API's`}</span> end-to-end.
      </h3>
    </Content>
    <Sticky />
  </Layout>
)

export default AboutPage
