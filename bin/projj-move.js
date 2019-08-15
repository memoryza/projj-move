#!/usr/bin/env node

'use strict';

const program = require('commander');
program.version(require('../package').version);
program.usage('<command>');

program
  .option('-c, --config [config file]', 'add the specified config file')

program.parse(process.argv);

if (program.config) {
  require('../index.js')(program.config);
}
