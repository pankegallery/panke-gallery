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
import { SocialLinks, SocialLink } from './footer/Footer.styles'

// `gapAfter` leaves more room before the video platforms (YouTube, Twitch).
const profiles = [
  { name: 'Instagram', icon: faInstagram, href: 'https://www.instagram.com/panke.gallery/' },
  // rel="me" lets Mastodon verify the link to this site on the profile.
  { name: 'Mastodon', icon: faMastodon, href: 'https://tldr.nettime.org/@pankegallery', me: true },
  { name: 'Bluesky', icon: faBluesky, href: 'https://bsky.app/profile/pankegallery.bsky.social/' },
  { name: 'Facebook', icon: faFacebookF, href: 'https://www.facebook.com/panke.gallery/' },
  { name: 'Threads', icon: faThreads, href: 'https://www.threads.com/@panke.gallery' },
  { name: 'TikTok', icon: faTiktok, href: 'https://www.tiktok.com/@panke.gallery' },
  { name: 'Telegram', icon: faTelegramPlane, href: 'https://t.me/pankegallery', gapAfter: true },
  { name: 'YouTube', icon: faYoutube, href: 'https://youtube.com/@panke.gallery' },
  { name: 'Twitch', icon: faTwitch, href: 'https://twitch.tv/pankegallery' },
]

/**
 * The gallery's social media profiles as a row of icon links in the footer.
 * Each link is named after its platform, so screen readers announce more
 * than "link".
 */
const SocialIcons = () => (
  <SocialLinks>
    {profiles.map(({ name, icon, href, me, gapAfter }) => (
      <SocialLink
        key={name}
        href={href}
        className={name.toLowerCase()}
        target="_blank"
        rel={me ? 'me noopener noreferrer' : 'noopener noreferrer'}
        aria-label={name}
        $gapAfter={gapAfter}
      >
        <FontAwesomeIcon icon={icon} />
      </SocialLink>
    ))}
  </SocialLinks>
)

export default SocialIcons
