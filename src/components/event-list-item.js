import React from 'react'
import { Link } from 'gatsby'
import EventDate from '../components/event-date-time'
import Tag from '../components/tag'


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
      <article className="news-item">
        <div className="row">
          <div className="col-md-4 col-sm-4 col-xs-12">
              {eventCategory}
          </div>
          <div className="col-md-8 col-sm-8 col-xs-12">
            <h3>
              <Link to={`/event/${event.slug}`}>{event.title}</Link>
            </h3>
            <p dangerouslySetInnerHTML={{
                __html: event.subtitleShortDescription.childMarkdownRemark.html
              }} />
            <p className="meta"><EventDate event={event} /></p>
          </div>
        </div>
      </article>
    );
  }
}

export default EventListItem;

