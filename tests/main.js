"use strict";

var path = require('path'),
    test = require('tap').test,
    log = require('../lib/log'),
    fn = require('../');

log.pause();

function noop() {}

function getEnv(args) {
    return {
        args: args || [],
        opts: {}
    };
}

// error conditions, no side effects

test('no param', function (t) {
    t.plan(1);

    function cb(err) {
        t.equal(err, 'Invalid action ', 'Error');
    }

    fn(getEnv(), cb);
});

test('invalid action', function (t) {
    t.plan(1);

    function cb(err) {
        t.equal(err, 'Invalid action foo', 'Error');
    }

    fn(getEnv(['foo']), cb);
});

test('no value', function (t) {
    t.plan(1);

    function cb(err) {
        t.equal(err, 'name is required', 'Error');
    }

    fn(getEnv(['create']), cb);
});
