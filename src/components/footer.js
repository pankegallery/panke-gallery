import React from 'react'
import SocialIcons from '../components/social-icons'
import { StyledFooter, FooterText } from './footer/Footer.styles'
import { Row, Col } from './layout/Layout.styles'

/**
 * The site footer: the association's name, the Imprint and Privacy Policy
 * links, and the social media icons.
 */
const Footer = () => (
  <StyledFooter>
    <Row>
      <Col $sm={8}>
        <FooterText>
          © panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V. · <a href="/contact#imprint">Imprint</a> · <a href="/privacy">Privacy Policy</a>
        </FooterText>
      </Col>
      <Col $sm={4}>
        <SocialIcons />
      </Col>
    </Row>
  </StyledFooter>
)

export default Footer
