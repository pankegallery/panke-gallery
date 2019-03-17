import React from 'react';
import get from 'lodash/get'
import Helmet from 'react-helmet'
import ContentBlock from '../components/content-block'

class PankeInfo extends React.Component{
  render() {
    {/*Get array of content blocks*/}
    const blocks = get(this, 'props.data.allContentfulContentBlock.edges');

    {/*Log array of Blocks*/}
    console.log('Blocks:');
    console.log(blocks);

    return(
      <main>
        <Helmet
          title="About"
          meta={[
            {
              name: 'description',
              content: 'panke.gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture, especially in the recent history of Berlin. Its program of exhibitions and events takes place in a gallery space within the premises of panke.club.'
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

export default PankeInfo;


export const pageQuery = graphql`
  query PankeInfoQuery {
    allContentfulContentBlock (filter: {page: {eq: "Info"}}, sort: { fields: [slug], order: ASC}){
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

