import React from 'react';
import Moment from 'moment';
import { formatEventTime } from '../utils/formatDateRange';

/**
 * The date and time of an event as one line, e.g.
 * "03 November 2026 from 19:00 – 21:00", for the event page, /rosa and the
 * event list. The time comes from `formatEventTime`, so it matches the event
 * rows on the homepage and /events.
 *
 * @param {Object} props
 * @param {Object} props.event - A Contentful event node with `date`, and
 *   `endTime` or `openEnd`.
 */
const EventDate = ({ event }) => (
  <span>
    {Moment(event.date).format('DD MMMM YYYY')} from {formatEventTime(event)}
  </span>
);

export default EventDate;
