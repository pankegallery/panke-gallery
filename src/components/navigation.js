import React from 'react'
import { Link } from 'gatsby'

const Navigation = () => (
  <div>
    <nav id="nav-main">
      <ul>
        <li className="live"><Link to="/streaming">Live</Link></li>
        <li><Link to="/exhibitions">Exhibitions</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/info">Info</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>

    <nav id="nav-satellite">
      <ul>
        <li><Link to="/rosa">/rosa</Link></li>
        <li><Link to="/editions" rel="noopener noreferrer">Edition</Link></li>
        <li><a href="http://router.gallery" target="_blank" rel="noopener noreferrer">Router</a></li>
      </ul>
    </nav>
  </div>
)
export default Navigation
