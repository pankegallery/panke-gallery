import React from 'react';

import Layout from "../components/layout"
import { Row, Col } from '../components/layout/Layout.styles'
import { FurtherSection, Headline } from '../components/content/Content.styles';  

class Panke404 extends React.Component{
  render() {
    return(
      <Layout>
        <FurtherSection>
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <Headline>
                <h1>Oops…</h1>
              </Headline>
            </Col>

            <Col $md={8} $sm={8} $xs={12}>
              <p>This shouldn't have happened. But we're working on fixing it. </p>

              <p>Meanwhile, click on the coloured squares and decide which color you like best for our site.</p>
            </Col>
          </Row>
        
        </FurtherSection>

      </Layout>
    );
  }
}

export default Panke404;
