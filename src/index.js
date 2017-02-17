#!/usr/bin/env node

const Calenduh = require('calenduh');
const debug = require('debug')('daily-schedule');
const moment = require('moment');
const async = require('async');

const cal = new Calenduh(`${__dirname}/../client_secret.json`);

const events = [];

cal.calendarList().then((lists) => {
  async.each(lists, (list, cb) => {
    cal.events(list.id, {
      timeMin: moment().startOf('day').toISOString(),
      timeMax: moment().endOf('day').toISOString(),
    }).then((eventsRetrieved) => {
      debug('Retrieved events');
      events.push(...eventsRetrieved);
      cb();
    }).catch((err) => {
      debug('Error in index.js cal.events');
      debug(err);
      // can't pass error because async each would stop
      cb();
    });
  }, () => {
    debug('async.each callback');
    const sorted = events.sort((a, b) => moment(a.start.dateTime) - moment(b.end.dateTime));
    sorted.forEach((e) => {
      process.stdout.write(
        `${e.summary} (${moment(e.start.dateTime).format('HH:mm')}-${moment(e.end.dateTime).format('HH:mm')})\n`,
      );
    });
  });
}).catch((err) => {
  debug('Error while getting calendar lists');
  debug(err);
});
