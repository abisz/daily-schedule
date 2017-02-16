#!/usr/bin/env node

const Calenduh = require('calenduh');
const debug = require('debug')('daily-schedule');
const moment = require('moment');

const log = console.log;
const cal = new Calenduh(`${__dirname}/../client_secret.json`);

cal.calendarList().then((lists) => {
  lists.forEach((list) => {
    cal.events(list.id, {
      timeMin: moment().toISOString(),
      timeMax: moment().add(1, 'day').toISOString(),
    }).then((events) => {
      debug('Retrieved events');
      events.forEach((e) => {
        log(`${e.summary} (${moment(e.start.dateTime).format('HH:mm')} - ${moment(e.end.dateTime).format('HH:mm')})`);
      });
    }).catch((err) => {
      debug('Error in index.js cal.events');
      debug(err);
    });
  });
}).catch((err) => {
  debug('Error while getting calendar lists');
  debug(err);
});

