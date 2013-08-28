

"use strict";

var test = require('tap').test,
    log = require('../lib/log');

test('debug level was added', function (t) {
    t.equal('function', typeof log.debug);
    t.ok(log.style.hasOwnProperty('debug'));
    t.ok(log.disp.hasOwnProperty('debug'));
    t.ok(log.levels.hasOwnProperty('debug'));
    t.end();
});

test('debug log level is below verbose', function (t) {
    t.ok(log.levels.verbose > log.levels.debug);
    t.equal(999, log.levels.debug);
    t.end();
});

test('no heading', function (t) {
    t.equal('', log.heading);
    t.end();
});