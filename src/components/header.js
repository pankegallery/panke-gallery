import React from 'react'
import Navigation from '../components/navigation'

export default () => (
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
)
