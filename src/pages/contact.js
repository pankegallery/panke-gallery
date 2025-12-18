import React from 'react';
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import ContentBlock from '../components/content-block'
import { processExternalLinks } from '../utils/processExternalLinks'

class PankeContact extends React.Component{
  render() {
    // Get array of content blocks
    const blocks = get(this, 'props.data.allContentfulContentBlock.edges');
    
    // Log array of Blocks
    console.log('Blocks:');
    console.log(blocks);
    
    // Define decidated content blocks: definedBlocks
    var definedBlocks = {
      'visitUs'     : { slug:'contact-visit-us'   },
      'disclaimer'  : { slug:'contact-disclaimer' },
      'imprint'     : { slug:'contact-imprint'    }
    }    
    
    var slugs = [];
    
    // Fill definedBlocks with content
    function filterDefinedBlock(_block){
      return _block.node.slug === definedBlocks[key].slug;
    }
    for(var key in definedBlocks) {
      const _b = blocks.filter(filterDefinedBlock);
      Object.assign(definedBlocks[key], {array: _b});
      slugs.push(definedBlocks[key].slug);
    } 
  
    console.log('definedBlocks:');
    console.log(definedBlocks);
    
    console.log('slugs:');
    console.log(slugs);

    var otherBlocks = blocks.filter(function (_blocks) {
      return !(slugs.includes(_blocks.node.slug));
    });
    
    console.log('otherBlocks:');
    console.log(otherBlocks);
    
    return(
      <Layout>
        <Helmet
          title="Contact"
          meta={[
            {
              name: 'description',
              content: 'Opening hours, contact information and guidance how to reach panke.gallery in Berlin-Wedding. The gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture.'
            }
          ]}
        />
        <section className="further">  {/*  Contact info and opening times */}
          <div className="row">
            <div className="col-sm-4 col-xs-12"> 
              {definedBlocks.visitUs.array.map(({ node }) => {
                return (
                  <div key={node.slug} dangerouslySetInnerHTML={{
                    __html: processExternalLinks(node.blockContent.childMarkdownRemark.html)
                  }} />
                )
              })}
            </div>
            <div className="col-sm-8 col-xs-12">
                <iframe title="Way to panke.gallery" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4852.705252670195!2d13.371589975360076!3d52.545146134369126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851886a993637%3A0x90bf0ce41c5e7529!2spanke.gallery!5e0!3m2!1sen!2sde!4v1765452085626!5m2!1sen!2sde" width="600" height="350" className="googleMap" loading="lazy" style={{border: 0}} referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </section>
        {otherBlocks.map(({node}) => {
          return (
              <ContentBlock key={node.id} blockTitle={node.title} blockContent={node.blockContent} />
          )
        })}

        <section className="further">  {/*  Imprint and disclaimer */}
          <div className="row">
            <div className="col-sm-4 col-xs-12">
                <h2>Imprint<br /></h2>

                <h3>panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V.</h3>
                <p>Gerichtstr. 23 · Hof V<br />
                  13347 Berlin</p>

                <h3>Liability of information according to § 5 TMG
                </h3>
                <p>Robert Sakrowski</p>

                <h3>Vereinsregisternummer</h3>
                  <p>VR 30390 B</p>
            </div>
            <div className="col-sm-8 col-xs-12">
                {definedBlocks.disclaimer.array.map(({ node }) => {
                return (
                  <div key={node.slug} dangerouslySetInnerHTML={{
                    __html: processExternalLinks(node.blockContent.childMarkdownRemark.html)
                  }} />
                )
              })}
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

export default PankeContact;

export const pageQuery = graphql`
  query PankeContactQuery {
    allContentfulContentBlock (filter: {page: {eq: "Contact"}}, sort: { fields: [createdAt], order: ASC}){
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
