import React from 'react'
import SocialIcons from '../components/social-icons'
import { StyledFooter } from './footer/Footer.styles'
import { Row, Col, TextCenter } from './layout/Layout.styles'


const Footer = () => (
      <StyledFooter>
        <Row>
          <Col $sm={8} style={{textAlign: 'center'}}>
            <TextCenter style={{textAlign: 'left', display: 'inline-block'}}>
              © panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V. · <a href="/contact#imprint">Imprint</a> · <a href="/privacy">Privacy Policy</a>
            </TextCenter>
          </Col>
          <Col $sm={4}>
            <SocialIcons />
          </Col>
        </Row>
      </StyledFooter>
)
export default Footer
