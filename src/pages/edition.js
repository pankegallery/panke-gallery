import React from 'react';
import get from 'lodash/get'
import Helmet from 'react-helmet'
import ContentBlock from '../components/content-block'

class PankeEdition extends React.Component{
  render() {
    {/*Get array of content blocks*/}
    const blocks = get(this, 'props.data.allContentfulContentBlock.edges');

    {/*Log array of Blocks*/}
    console.log('Blocks:');
    console.log(blocks);

    return(
      <main>
        <Helmet
          title="Edition"
          meta={[
            {
              name: 'description',
              content: 'The edition of panke.gallery is published as a limited edition of 100. It is a series of artist’s editions and is made up of a designed cover and an inlay with the download code for the artwork. The design of the editions is intended emphasize its character as a collectible digital object and illustrate the work of the featured artist.'
            }
          ]}
        />

        {blocks.map(({node}) => {
          return (
              <ContentBlock key={node.id} blockTitle={node.title} blockContent={node.blockContent} />
          )
        })}

      </main>
    );
  }
}

export default PankeEdition;


export const pageQuery = graphql`
  query PankeEditionQuery {
    allContentfulContentBlock (filter: {page: {eq: "Edition"}}, sort: { fields: [createdAt], order: ASC}){
      edges {
        node {
          id
          title
          page
          slug
          blockContent {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
  }
`

