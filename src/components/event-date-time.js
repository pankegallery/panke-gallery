import React from 'react';
import Moment from 'moment'

class EventDateComp extends React.Component {
  render() {
    var thisevent = this.props.event;
    var eventDate = Moment(thisevent.date).format('DD MMMM YYYY');
    var eventTime = Moment(thisevent.date).format('HH:mm')
    console.log('open' + thisevent.openEnd)
    if (thisevent.openEnd) {
      var eventEnd = 'open end';
    }else{
      var eventEnd = Moment(thisevent.endTime).format('HH:mm');
    }
    return(
      <span>
        {eventDate} from {eventTime} &thinsp;&ndash;&thinsp;{eventEnd}
      </span>
    );
  }
}

export default EventDateComp;

