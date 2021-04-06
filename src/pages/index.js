import { Link, graphql } from 'gatsby'
import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'

export default function Home({ data }){
    return (
        <Layout>
            <SEO title="Home" keywords={['gatsby', 'application', 'react']} />
            <div>
                <h1>Cours</h1>
                <h4>{data.allMdx.totalCount} Posts</h4>
                {data.allMdx.edges.map(({ node }) => (
                    <div key={node.id}>
                        <Link style={{
                                color: 'inherit'
                            }}
                            to={node.fields.slug}>
                            <h3>{node.frontmatter.title}</h3>
                        </Link>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export const query = graphql`
  query {
    allMdx(sort: { fields: [frontmatter___order], order: ASC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`