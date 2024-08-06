import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import Navigation from '../components/navigation'

class pankeHeader extends React.Component {
  render () {
    return (

      <header>
          <div className="row">
            <div className="col-md-4 col-9">
                <a href="/" title="Go to Homepage"><p className="logotype">panke.gallery</p></a>
            </div>
            <div className="col-md-8 text-right d-none d-sm-block">
              <Navigation />
            </div>
            <div className="col-3 text-right d-block d-sm-none">
              <button className="toggle-menu" onClick={this.props.handleClick}>
                <FontAwesomeIcon icon={faBars} aria-label="Burger menu"/>
              </button>
            </div>
          </div>
        </header>

    ); // return
  } // render
} // class

export default pankeHeader;
