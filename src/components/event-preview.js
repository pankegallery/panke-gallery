import React from 'react'
import { Link } from 'gatsby'
import EventDate from '../components/event-date-time'
import { processExternalLinks } from '../utils/processExternalLinks'
import { NewsArticle, Meta } from './content/Content.styles'


class EventPreview extends React.Component {
  render() {
    var event = this.props.event;

    return(
      <NewsArticle>
        <h3>
          <Link to={`/event/${event.slug}`}>{event.title}</Link>
        </h3>
        <div dangerouslySetInnerHTML={{
            __html: processExternalLinks(event.subtitleShortDescription.childMarkdownRemark.html)
          }} />
        <Meta><EventDate event={event} /></Meta>
      </NewsArticle>
    );
  }
}

export default EventPreview
