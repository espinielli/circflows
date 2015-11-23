#! /usr/bin/env node

var shell = require('shelljs');
var flow = require('./csv2flowmatrix');


var shell = require('shelljs'),
    path = require('path'),
    argv,
    silentState,
    BASENAME,
    VERBOSE_LEVEL,
    COMMAND;


silentState = shell.config.silent; // save old silent state
shell.config.silent = true;

BASENAME = __filename.split(path.sep).pop();

function WARN() { VERBOSE_LEVEL >= 0 && console.log.apply(console, arguments); }
function INFO() { VERBOSE_LEVEL >= 1 && console.log.apply(console, arguments); }
function DEBUG() { VERBOSE_LEVEL >= 2 && console.log.apply(console, arguments); }

WARN("Showing only important stuff");
INFO("Showing semi-important stuff too");
DEBUG("Extra chatty mode");



var argv = require('yargs')
    .usage('Usage: ' + BASENAME +' [options]')
    .demand(['f', 'o', 'r', 't'])
    .example(BASENAME + ' -f f.csv -o t.json -r regs.csv -t years.csv', 'compile the flows data into "t.json"')
    // flows
    .demand('f')
    .alias('f', 'flows')
    .nargs('f', 1)
    .describe('f', 'flows file (CSV)')
    // where to save result
    .demand('o')
    .alias('o', 'target')
    .nargs('o', 1)
    .describe('o', 'Matrix of flows\' output file')
    // regions file
    .demand('r')
    .alias('r', 'regions')
    .nargs('r', 1)
    .describe('r', 'regions file (CSV)')
    // timeline file
    .demand('t')
    .alias('t', 'timeline')
    .nargs('t', 1)
    .describe('t', 'timeline file (CSV)')
    // help
    .help('h')
    .alias('h', 'help')
    // version
    .version("0.1.0")
    .alias('V', 'version')
    // verbose: debugging always helps
    .count('verbose')
    .alias('v', 'verbose')
    .describe('v', 'verbosity levels, "v" (INFO), "vv" (DEBUG)')
    // grouping
    .group(['f', 'o', 'r', 't'], 'Options:')
    .group(['help', 'v', 'V'], 'Meta:')
    // epilogue
    .epilog('author: Enrico Spinielli. Copyright Eurocontrol/PRU 2015')
    .wrap(null)
    .argv;

VERBOSE_LEVEL = argv.verbose;

// flow.toMatrix('./data/extra-flows.csv', 'json/extra-flows.json', './data/regions.csv', './data/years.csv');
DEBUG(JSON.stringify(argv));
var files = [argv.f, argv.r, argv.t],
	exitcode = 0;
for (var i = files.length - 1; i >= 0; i--) {
	if (!shell.test('-f', files[i])) {
		WARN(BASENAME + ": File '" + files[i] + "' does not exist or is not a regular file.");
		exitcode = 1;
	}
};

if (exitcode === 1) {
	shell.exit(1);
}

flow.toMatrix(argv.f, argv.o, argv.r, argv.t);

shell.config.silent = silentState; // restore old silent state

// -*- mode: javascript; -*-