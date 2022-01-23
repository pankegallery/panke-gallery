import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'

export default () => (
  <div className="social text-center text-sm-right mt-4 mt-sm-0">
    <a href="https://twitter.com/pankegallery/" className="twitter" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faTwitter} />
    </a>

    <a href="https://www.instagram.com/panke.gallery/" className="instagram" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faInstagram} />
    </a>
    <a href="https://www.facebook.com/panke.gallery/" className="facebook" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faFacebookF} />
    </a>
  </div>
)
