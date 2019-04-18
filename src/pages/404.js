import React from 'react';
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Layout from "../components/layout"
import ContentBlock from '../components/content-block'

class Panke404 extends React.Component{
  render() {
    return(){
      <Layout>
      <p>OOps…</p>
      </Layout>
    }
  }
}

export default PankeContact;
