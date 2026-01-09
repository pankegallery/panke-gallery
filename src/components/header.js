import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import Navigation from '../components/navigation'
import { StyledHeader, Logotype, ToggleMenuButton } from './header/Header.styles'
import { Row, Col, DSmBlock, DSmNone } from './layout/Layout.styles'

class pankeHeader extends React.Component {
  render () {
    return (

      <StyledHeader>
          <Row>
            <Col $xs={9} $md={4}>
                <a href="/" title="Go to Homepage"><Logotype>panke.gallery</Logotype></a>
            </Col>
            <Col $md={8} style={{textAlign: 'right'}}>
              <DSmBlock>
                <Navigation />
              </DSmBlock>
            </Col>
            <Col $xs={3} style={{textAlign: 'right'}}>
              <DSmNone>
                <ToggleMenuButton onClick={this.props.handleClick}>
                  <FontAwesomeIcon icon={faBars} aria-label="Burger menu"/>
                </ToggleMenuButton>
              </DSmNone>
            </Col>
          </Row>
        </StyledHeader>

    ); // return
  } // render
} // class

export default pankeHeader;
