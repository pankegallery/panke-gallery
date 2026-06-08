import React from 'react'
import { Link } from 'gatsby'
import EventDate from '../components/event-date-time'
import Tag from '../components/tag'
import { processExternalLinks } from '../utils/processExternalLinks'
import { Col, Row } from './layout/Layout.styles'
import { NewsArticle } from './content/Content.styles'


class EventListItem extends React.Component {

  render() {
    var event = this.props.event;

    var eventCategory;

    if (event.eventSeries!=null) {
      eventCategory =(
        <Tag
          ref={this.tagElement}
          tag={event.eventSeries}
          type="eventSeries"
          handleClick={this.props.handleClick}
          filterIsOn={this.props.filterIsOn}
        />
      );
    }

    return(
      <NewsArticle>
        <Row>
          <Col $md={4} $sm={4} $xs={12}>
              {eventCategory}
          </Col>
          <Col $md={8} $sm={8} $xs={12}>
            <h3>
              <Link to={`/event/${event.slug}`}>{event.title}</Link>
            </h3>
            <div dangerouslySetInnerHTML={{
                __html: processExternalLinks(event.subtitleShortDescription.childMarkdownRemark.html)
              }} />
            <p className="meta"><EventDate event={event} /></p>
          </Col>
        </Row>
      </NewsArticle>

      
    );
  }
}

export default EventListItem;

