import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBluesky,
  faThreads,
  faTiktok,
  faFacebookF,
  faMastodon,
  faInstagram,
  faTelegramPlane,
  faYoutube,
  faTwitch,
} from '@fortawesome/free-brands-svg-icons'

const SocialIcons = () => (
  <div className="social text-center text-sm-right mt-4 mt-sm-0">
    <a href="https://www.instagram.com/panke.gallery/" className="instagram" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faInstagram} aria-label="Instagram"/>
    </a>
    <a href="https://tldr.nettime.org/@pankegallery" className="mastodon" target="_blank" rel="me noopener noreferrer">
      <FontAwesomeIcon icon={faMastodon} aria-label="Mastodon"/>
    </a>
    <a href="https://bsky.app/profile/pankegallery.bsky.social/" className="twitter" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faBluesky} aria-label="Bluesky"/>
    </a>
    <a href="https://www.facebook.com/panke.gallery/" className="facebook" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faFacebookF} aria-label="Facebook"/>
    </a>
    <a href="https://www.threads.com/@panke.gallery" className="threads" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faThreads} aria-label="Threads"/>
    </a>
    <a href="https://www.tiktok.com/@panke.gallery" className="tiktok" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faTiktok} aria-label="TikTok"/>
    </a>
    <a href="https://t.me/pankegallery" className="telegram mr-4" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faTelegramPlane} aria-label="Telegram"/>
    </a>
    <a href="https://youtube.com/@panke.gallery" className="youtube" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faYoutube} aria-label="Youtube"/>
    </a>
    <a href="https://twitch.tv/pankegallery" className="twitch" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faTwitch} aria-label="Twitch"/>
    </a>
    
  </div>
)
export default SocialIcons

