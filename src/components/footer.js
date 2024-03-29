import React from 'react'
import SocialIcons from '../components/social-icons'


const Footer = () => (
      <footer>
        <div className="row">
          <div className="col-sm-8 text-center text-sm-left">© panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V. · <a href="/imprint">Imprint</a> · <a href="/privacy">Privacy Policy</a></div>
          <div className="col-sm-4">
            <SocialIcons />
          </div>
        </div>
      </footer>
)
export default Footer
