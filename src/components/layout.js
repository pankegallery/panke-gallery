import React from 'react'
import PropTypes from 'prop-types'
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
        titleTemplate="%s · panke.gallery"
        title="Home"
        meta={[
          { name: 'description', content: 'panke.gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture, especially in the recent history of Berlin. Its program of exhibitions and events takes place in a gallery space within the premises of panke.club.' },
          { name: 'keywords', content: 'net art, Netzkunst, Galerlie, gallery, Berlin, Wedding, Sakrowski, transmediale, Kultur' },
          { name: 'author', content: 'panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V.' },
        ]}
      />

      <Helmet>
        {/* Favicons for all platforms */}
        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" />
        <link rel="manifest" href="favicons/site.webmanifest" />
        <link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="msapplication-config" content="favicons/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />

        {/* CDN Scripts for Slideshow, Icons and SUPR */}
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" />
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" />
        <script type="application/javascript" data-main="https://widget.supr.com/app/main" src="https://widget.supr.com/load.js" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" />

        {/* panke.gallery scripts for link color */}
        <script src="scripts/js.cookie.js" type="text/javascript"></script>
        <script src="scripts/panke.js"></script>

      </Helmet>
      <div className="off-canvas">
        <Navigation />
      </div>
      <div className="container theme-blue">

        <Header />

        <main>

          {children}

        </main>

        <Footer />

      </div>

      <ColorSwap />

    </div>
  );
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper;
