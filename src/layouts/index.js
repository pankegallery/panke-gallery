import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'gatsby-link'
import Helmet from 'react-helmet'
import Navigation from '../components/navigation'
import SocialIcons from '../components/social-icons'
import ColorSwap from '../components/color-swap'

import '../styles/panke.scss';

const TemplateWrapper = ({ children }) => {
  return <div>
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
      <header>
        <div className="row">
          <div className="col-md-4 col-sm-3 col-xs-6">
              <a href="/" title="Go to Homepage"><p className="logotype">panke.gallery</p></a>
          </div>
          <div className="col-md-8 col-sm-9 text-right hidden-xs">
            <Navigation />
          </div>
          <div className="col-xs-6 text-right visible-xs-block">
            <a className="toggle-menu">
              <span className="menu-icon glyphicon glyphicon-menu-hamburger"></span>
            </a>
          </div>.
        </div>
      </header>

      {children()}

      <footer className="blog-footer">
        <div className="row">
          <div className="col-sm-8 col-xs-8">© panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V.</div>
          <div className="col-sm-4 col-xs-4">
            <SocialIcons />
          </div>
        </div>
      </footer>
    </div>

    <ColorSwap />

  </div>
;
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper;
