import React from 'react'
import SocialIcons from '../components/social-icons'
import { StyledFooter } from './footer/Footer.styles'
import { Row, Col } from './layout/Layout.styles'


const Footer = () => (
      <StyledFooter>
        <Row>
          <Col $sm={8}>
            <div style={{textAlign: 'left'}}>
              <span style={{display: 'inline-block', textAlign: 'left'}}>
                © panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V. · <a href="/contact#imprint">Imprint</a> · <a href="/privacy">Privacy Policy</a>
              </span>
            </div>
          </Col>
          <Col $sm={4}>
            <SocialIcons />
          </Col>
        </Row>
      </StyledFooter>
)
export default Footer
