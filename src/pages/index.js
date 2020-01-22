import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Link to="/page-2/">Go to page 2</Link>
    <h1>Dale French</h1>
    <h2>A Full Stack Developer who likes building stuff with</h2>
    <h2>Styled Components</h2>

    <footer>
      <span>
        © {new Date().getFullYear()} - Dale French
        <br />
        Built with <a href="#">Gatsby</a> • Hosted on <a href="#">Netlify</a> •
        Code on <a href="#">GitHub</a>
      </span>
    </footer>
  </Layout>
)

export default IndexPage
