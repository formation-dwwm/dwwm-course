const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { createContentDigest } = require(`gatsby-core-utils`)
const {
    parentPassthrough,
    parentResolverPassthrough
  } = require("gatsby-plugin-parent-resolvers");
  
exports.onCreateNode = (api) => {
  const { node, getNode, actions } = api;
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode, basePath: `content`, trailingSlash: false })
    createNodeField({
      node,
      name: `slug`,
      value: `courses${slug}`,
    })


    const courseNode = createCourseNode(node, api);
    api.actions.createNode(courseNode);
    api.actions.createParentChildLink({ parent: node, child: courseNode });
  }
}

const createCourseNode = (parent, api) => {
    const id = `${parent.id} >>> Course`;
    const courseNode = {
        id: api.createNodeId(id),
        children: [],
        parent: parent.id,
        internal: {
            content: parent.rawBody,
            type: `Course`,
            contentDigest: createContentDigest(parent.rawBody)
        },

        // title: "MyTitleStatic"
    };

    return courseNode;
}

exports.createSchemaCustomization = (api) => {
    const { createTypes } = api.actions;
    const CourseType = api.schema.buildObjectType({
        name: `Course`,
        fields: {
            title: {
                type: `String!`,
                resolve: (node, args, context, info) => {
                    const parent = context.nodeModel.getNodeById({ id: node.parent });
                    return parent.frontmatter.title || 'Unnamed';
                }
            },
            order: {
                type: `Int!`,
                resolve: (node, args, context, info) => {
                    const parent = context.nodeModel.getNodeById({ id: node.parent });
                    return parent.frontmatter.order || 0;
                }
            },
            content: {
                type: `String!`,
                resolve: parentResolverPassthrough({ field: "body" })
            },
            slug: {
                type: `String!`,
                resolve: (node, args, context, info) => {
                    const parent = context.nodeModel.getNodeById({ id: node.parent });
                    return parent.fields.slug || '';
                }
            },
            timeToRead: {
                type: `Int!`,
                resolve: parentResolverPassthrough({ field: "timeToRead" })
            }
        },
        interfaces: [`Node`],
    });
    createTypes(CourseType);
}

exports.createResolvers = ({ createResolvers }) => {
    const resolvers = {
    //   Author: {
    //     fullName: {
    //       resolve: (source, args, context, info) => {
    //         return source.firstName + source.lastName
    //       }
    //     },
    //   },
    //   Course: {
    //     // type: ['Course'],
        
    //     title: {
    //         type: `String!`,
    //         resolve: (source, args, context, info) => {
    //             const parent = context.nodeModel.getNodeById({ id: source.parent });
    //             return parent.frontmatter.title;
    //         }
    //     }
    //   },
    //   Query: {
    //     allRecentPosts: {
    //       type: [`Course`],
    //       resolve: (source, args, context, info) => {
    //         const posts = context.nodeModel.getAllNodes({ type: `Mdx` })
    //         const courses = posts.filter(
    //           post => {const parent = context.nodeModel.getNodeById({ id: post.parent }); return parent.absolutePath.indexOf('/content/courses') > -1}
    //         )
    //         return courses
    //       }
    //     }
    //   }
    }
    createResolvers(resolvers)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/course.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    })
  })
}