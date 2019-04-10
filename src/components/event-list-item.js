import React from 'react'
import Link from 'gatsby-link'
import EventDate from '../components/event-date-time'
import Tag from '../components/tag'


class EventListItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {show: true};
  }

  render() {
    var event = this.props.event;

    if (event.eventSeries!=null){
      var eventCategory =(
        <Tag ref="tagElement" tag={event.eventSeries} type="eventSeries" handleClick={this.props.handleClick}/>
      );
      var articleClass = `news-item ${event.eventSeries.slug}`;
    }
    else {
      var eventCategory;
      var articleClass = 'news-item';
    }

    return(
      <article ref="eventItem" className={articleClass}>
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

