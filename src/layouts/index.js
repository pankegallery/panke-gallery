import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'gatsby-link'
import Helmet from 'react-helmet'

import Header from '../components/header'
import Navigation from '../components/navigation'
import ColorSwap from '../components/color-swap'
import Footer from '../components/footer'

import '../styles/panke.css';

const TemplateWrapper = ({ children }) => {
  return (
    <div>
      <Helmet
        title="panke.gallery"
        meta={[
          { name: 'description', content: 'panke.gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture, especially in the recent history of Berlin. Its program of exhibitions and events takes place in a gallery space within the premises of panke.club.' },
          { name: 'keywords', content: 'net art, Netzkunst, Galerlie, gallery, Berlin, Wedding, Sakrowski, transmediale, Kultur' },
          { name: 'author', content: 'panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V.' },
        ]}
      />
      <div className="off-canvas">
        <Navigation />
      </div>
      <div className="container theme-blue">

        <Header />

        {children()}

        <Footer />

      </div>

      <ColorSwap />

      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    </div>
  );
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper;
