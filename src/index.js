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
  .option('-d, --date [date]', 'Show schedule of specific date')
  .parse(process.argv);

const today = !program.tomorrow && !program.date;

let day;
let dayString;

if (program.date) {
  if (Date.parse(program.date)) {
    day = moment(Date.parse(program.date));
    dayString = day.format('DD.MM.YYYY');
  } else {
    process.stdout.write(chalk.red('Date Parsing Error\n'));
    process.exit();
  }
} else {
  day = program.tomorrow ? moment().add(1, 'day') : moment();
  dayString = today ? 'today' : 'tomorrow';
}

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

  process.stdout.write(chalk.white.underline(`Schedule for ${dayString}:\n`));

  const sorted = events.sort((a, b) => moment(a.start.dateTime) - moment(b.end.dateTime));
  sorted.forEach((e) => {
    const time = `(${moment(e.start.dateTime).format('HH:mm')}-${moment(e.end.dateTime).format('HH:mm')})`;
    const line = `${e.summary} ${time}`;
    const color = today && moment(e.start.dateTime) < moment() ? chalk.dim : chalk.white;
    process.stdout.write(color(`${line}\n`));
  });
})
  .catch((err) => {
    debug('Error from cal.allEvents()');
    debug(err);
    process.exit();
  });
