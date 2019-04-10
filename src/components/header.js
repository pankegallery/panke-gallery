import React from 'react'
import Navigation from '../components/navigation'

export default () => (
        <header>
          <div className="row">
            <div className="col-md-4 col-xs-6">
                <a href="/" title="Go to Homepage"><p className="logotype">panke.gallery</p></a>
            </div>
            <div className="col-md-8 text-right d-none d-sm-block">
              <Navigation />
            </div>
            <div className="col-xs-6 text-right d-block d-sm-none">
              <button className="toggle-menu">
                <i class="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </header>
)
