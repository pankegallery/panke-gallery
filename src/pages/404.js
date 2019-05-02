import React from 'react';
<<<<<<< HEAD
import Helmet from 'react-helmet'
import get from 'lodash/get'

=======
>>>>>>> development

import Layout from "../components/layout"

class Panke404 extends React.Component{
  render() {
    return(
      <Layout>
        <section className="further">
          <div className="row headline">
            <div className="col-md-4">
              <h1>Oops…</h1>
            </div>
            <div className="col-md-8">
              <p>This shouldn't have happened. But we're working on fixing it. </p>

              <p>Meanwhile, click on the coloured squares and decide which color you like best for our site.</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

export default Panke404;
