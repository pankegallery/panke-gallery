import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import Navigation from '../components/navigation'
import { StyledHeader, Logotype, ToggleMenuButton } from './header/Header.styles'
import { Row, Col } from './layout/Layout.styles'

/**
 * The page header: the logotype, and the navigation from `breakpoints.md` up.
 * Below that width the navigation is in the off-canvas menu (`Layout`), which
 * the button here opens.
 *
 * @param {Object} props
 * @param {boolean} props.menuOpen - Whether the off-canvas menu is open.
 * @param {Function} props.onMenuClick - Opens the off-canvas menu.
 * @param {React.Ref} props.menuButtonRef - The menu button, so that `Layout`
 *   can give it the focus back when the menu closes.
 */
const Header = ({ menuOpen, onMenuClick, menuButtonRef }) => (
  <StyledHeader>
    <Row>
      <Col $xs={9} $md={4}>
        <a href="/" title="Go to Homepage"><Logotype>panke.gallery</Logotype></a>
      </Col>
      <Col $md={8} $d={'md lg'}>
        <Navigation />
      </Col>
      <Col $xs={3} style={{ textAlign: 'right' }} $d={'sm'}>
        {/* aria-expanded tells screen readers whether the menu is open. */}
        <ToggleMenuButton
          ref={menuButtonRef}
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="off-canvas-menu"
          onClick={onMenuClick}
        >
          <FontAwesomeIcon icon={faBars} />
        </ToggleMenuButton>
      </Col>
    </Row>
  </StyledHeader>
)

export default Header
