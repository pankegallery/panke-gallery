import React from 'react'
import { Link } from 'gatsby'
import { NavMain, NavSatellite, NavList, NavWrapper } from './navigation/Navigation.styles'

const Navigation = () => (
  <NavWrapper>
    <NavMain id="nav-main">
      <NavList>
        <li className="live"><Link to="/streaming">Live</Link></li>
        <li><Link to="/exhibitions">Exhibitions</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/info">Info</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </NavList>
    </NavMain>

    <NavSatellite id="nav-satellite">
      <NavList>
        <li><Link to="/rosa">/rosa</Link></li>
        <li><Link to="/editions" rel="noopener noreferrer">Edition</Link></li>
        <li><a href="http://router.gallery" target="_blank" rel="noopener noreferrer">Router</a></li>
      </NavList>
    </NavSatellite>
  </NavWrapper>
)
export default Navigation
