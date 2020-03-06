module.exports = {
  siteMetadata: {
    title: ``,
    description: `I'm an experienced Full Stack Developer based in Ballito, South Africa.`,
    author: `@dale-french`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-157050445-1",
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `dale-french-website`,
        short_name: `me`,
        start_url: `/`,
        background_color: `#FFFFFF`,
        theme_color: `#3371FF`,
        display: `minimal-ui`,
        icon: `src/images/me-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-styled-components`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
