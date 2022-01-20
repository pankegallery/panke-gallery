import React from 'react';
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import ContentBlock from '../components/content-block'

class PankeRosa extends React.Component{

  render() {

    const blocks = get(this, 'props.data.allContentfulContentBlock.edges');

    let infoBlock = {
      title: 'About',
      content: '<strong>/rosa is a project space on Rosa-Luxemburg Platz jointly run by <a href="https://netzkunst.berlin">Zentrum für Netzkunst (ZfN)</a> and panke.gallery focused on representing net art and net culture in Berlin.</stong>'
    }

    let moreBlock = {
      title: 'More',
      content: `/rosa extends the activities of both spaces and expands their initiatives in maintaining, archiving and reconstructing Internet art culture, and opens an important site for local and international dialogue between researchers, students, net art enthusiasts, established and emerging artists.<br /><br />
      In addition to the expected formats of exhibiting artworks, /rosa proposes experimental formats of art mediation, lectures, workspace, growing research library for self-study, and offers itself as an open venue for independently organized community events such as reading groups and workshops.`
    }

    let address = `
      <strong>/rosa</strong><br>
      Rosa-Luxemburg-Strasse 35<br>
      10178 Berlin
    `


    return(
      <Layout>
        <main>
        <Helmet
          title="/rosa"
          meta={[
            {
              name: 'description',
              content: '/rosa is a project space on Rosa-Luxemburg Platz jointly run by Zentrum für Netzkunst (ZfN) and panke.gallery focused on representing net art and net culture in Berlin.'
            }
          ]}
        />

        <section className="info">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
                      <h2>{infoBlock.title}</h2>
                  </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              {<div dangerouslySetInnerHTML={{
                __html: infoBlock.content
              }} />}
          </div>
          </div>
        </section>

        <section className="further">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12 address">
               {<div dangerouslySetInnerHTML={{
                __html: address
              }} />}
            </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              {<div dangerouslySetInnerHTML={{
                __html: moreBlock.content
              }} />}
          </div>
          </div>
        </section>

        {blocks.map(({node}) => {
          return (
              <ContentBlock key={node.id} blockTitle={node.title} blockContent={node.blockContent} />
          )
        })}

        </main>
      </Layout>
    );
  }
}

export default PankeRosa;

export const pageQuery = graphql`
  query PankeInfoQuery {
    allContentfulContentBlock (filter: {page: {eq: "/rosa"}}, sort: { fields: [slug], order: ASC}){
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


