import React from 'react'
import { Link } from 'gatsby'
import EventDate from '../components/event-date-time'
import { processExternalLinks } from '../utils/processExternalLinks'
import { NewsArticle, Meta, Tag } from './content/Content.styles'


class EventPreview extends React.Component {
  render() {
    var event = this.props.event;

    var eventCategory;
    if (event.eventSeries!=null) {
      eventCategory =(
        <Tag>
          {event.eventSeries.name}
        </Tag>
      );
    }
    var eventTags;
    if (event.tags!=null){
      eventTags =(
        event.tags.map(({slug, name}) => {
          return (
            <Tag key={slug}>
              {name}
            </Tag>
          )
        })
      );
    }

    return(
      <NewsArticle>
        <div>{eventCategory}{eventTags}</div>
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
