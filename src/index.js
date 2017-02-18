#!/usr/bin/env node

const Calenduh = require('calenduh');
const debug = require('debug')('daily-schedule');
const moment = require('moment');
const chalk = require('chalk');
const program = require('commander');
const app = require('../package.json');

const cal = new Calenduh(`${__dirname}/../client_secret.json`);

program
  .version(app.version)
  .option('-t, --tomorrow', 'Show schedule of tomorrow')
  .parse(process.argv);

const day = program.tomorrow ? moment().add(1, 'day') : moment();
const start = day.startOf('day').toISOString();
const end = day.endOf('day').toISOString();

cal.allEvents({
  timeMin: start,
  timeMax: end,
}).then((events) => {
  if (events.length === 0) {
    debug('No events');
    process.stdout.write(`No events for ${program.tomorrow ? 'tomorrow' : 'today'}!\n`);
    process.exit();
  }
  const sorted = events.sort((a, b) => moment(a.start.dateTime) - moment(b.end.dateTime));
  sorted.forEach((e) => {
    const time = `(${moment(e.start.dateTime).format('HH:mm')}-${moment(e.end.dateTime).format('HH:mm')})`;
    const line = `${e.summary} ${time}`;
    const color = moment(e.start.dateTime) < moment() ? chalk.dim : chalk.white;
    process.stdout.write(color(`${line}\n`));
  });
})
  .catch((err) => {
    debug('Error from cal.allEvents()');
    debug(err);
    process.exit();
  });
