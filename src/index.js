#!/usr/bin/env node

const Calenduh = require('calenduh');
const debug = require('debug')('daily-schedule');
const moment = require('moment');

const cal = new Calenduh(`${__dirname}/../client_secret.json`);

cal.allEvents({
  timeMin: moment().startOf('day').toISOString(),
  timeMax: moment().endOf('day').toISOString(),
}).then((events) => {
  const sorted = events.sort((a, b) => moment(a.start.dateTime) - moment(b.end.dateTime));
  sorted.forEach((e) => {
    const time = `(${moment(e.start.dateTime).format('HH:mm')}-${moment(e.end.dateTime).format('HH:mm')})`;
    const line = `${e.summary} ${time}`;
    process.stdout.write(`${line}\n`);
  });
})
  .catch((err) => {
    debug('Error from cal.allEvents()');
    debug(err);
    process.exit();
  });
