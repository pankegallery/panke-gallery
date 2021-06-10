import React from 'react'
import { Link } from 'gatsby'
//import Img from 'gatsby-image'
//import Moment from 'moment'
import EventDate from '../components/event-date-time'


class EventPreview extends React.Component {
  render() {
    var event = this.props.event;

    var eventCategory;
    if (event.eventSeries!=null) {
      eventCategory =(
        <p className="tag">
          {event.eventSeries.name}
        </p>
      );
    }
    var eventTags;
    if (event.tags!=null){
      eventTags =(
        event.tags.map(({slug, name}) => {
          return (
            <p className="tag">
              {name}
            </p>
          )
        })
      );
    }

    return(
      <article className="news-item">
            <div>{eventCategory}{eventTags}</div>
            <h3>
              <Link to={`/event/${event.slug}`}>{event.title}</Link>
            </h3>
            <div dangerouslySetInnerHTML={{
                __html: event.subtitleShortDescription.childMarkdownRemark.html
              }} />
            <p className="meta"><EventDate event={event} /></p>

      </article>
    );
  }
}

export default EventPreview
