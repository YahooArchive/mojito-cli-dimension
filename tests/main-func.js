/*jslint nomen: true, stupid: true */

"use strict";

var path = require('path'),
    fs = require('fs'),
    test = require('tap').test,

    log = require('../lib/log'),
    fn = require('../'),

    artifacts = path.join(__dirname, '../artifacts'),
    fixtures = path.join(__dirname, 'fixtures');

log.pause();

function getEnv(args, opts) {
    return {
        args: args || [],
        opts: opts || {}
    };
}

// these tests create files/dirs in tests/artifacts

test('[func] create dimension dir', function (t) {
    var name = 'experiment_dimension',
        args = ['create', name, artifacts];


    function cb(err) {
        var pkgName = 'mojito-dimensions-' + name,
            pkgType = 'super-bundle',
            pkgDir = path.join(artifacts, pkgName),
            pkgJson,
            pkgInfo;

        t.ok(fs.existsSync(pkgDir), pkgDir);

        pkgJson = path.join(pkgDir, 'package.json');
        t.ok(fs.existsSync(pkgJson), pkgJson);

        fs.readFile(pkgJson, function (err, data) {
            pkgInfo = JSON.parse(data);
            t.equal(pkgInfo.name, pkgName, 'Package name');

            t.equal(pkgInfo.yahoo.mojito.type, pkgType, 'Package type');
        });
    }

    t.plan(4);
    fn(getEnv(args), cb);
});

test('[func] create dimension dir with prefix', function (t) {
    var name = 'experiment_dimension',
        prefix = 'my-prefix',
        args = ['create', name, artifacts],
        opts = {prefix: prefix};


    function cb(err) {
        var pkgName = prefix + '-' + name,
            pkgType = 'super-bundle',
            pkgDir = path.join(artifacts, pkgName),
            pkgJson,
            pkgInfo;

        t.ok(fs.existsSync(pkgDir), pkgDir);

        pkgJson = path.join(pkgDir, 'package.json');
        t.ok(fs.existsSync(pkgJson), pkgJson);

        fs.readFile(pkgJson, function (err, data) {
            pkgInfo = JSON.parse(data);
            t.equal(pkgInfo.name, pkgName, 'Package name');

            t.equal(pkgInfo.yahoo.mojito.type, pkgType, 'Package type');
        });
    }

    t.plan(4);
    fn(getEnv(args, opts), cb);
});

test('[func] value invalid pkg dir', function (t) {
    var name = 'foo',
        args = ['value', name, 'foo'];

    function cb(err) {
        t.equal(err, 'Error reading package.json\nMake sure you\'re in the desired dimension package dir.', 'Error');
    }

    t.plan(1);
    fn(getEnv(args), cb);
});

test('[func] value no name pkg', function (t) {
    var name = 'foo',
        args = ['value', name, path.join(fixtures, 'noname')];

    function cb(err) {
        t.equal(err, "No 'name' property in package.json", 'Error');
    }

    t.plan(1);
    fn(getEnv(args), cb);
});

test('[func] value invalid pkg type', function (t) {
    var name = 'foo',
        args = ['value', name, path.join(fixtures, 'invalidtype')];

    function cb(err) {
        t.equal(err, "Package type is not 'super-bundle'", 'Error');
    }

    t.plan(1);
    fn(getEnv(args), cb);
});

test('[func] value foo dir', function (t) {
    var dimensionName = 'experiment_dimension',
        dimensionValue = 'foo',
        pkgName = 'mojito-dimensions-' + dimensionName,
        pkgDir = path.join(artifacts, pkgName),
        args = ['value', dimensionValue, pkgDir];

    function cb(err) {
        var appYaml = path.join(pkgDir, dimensionValue, 'application.yaml'),
            mojitsDir = path.join(pkgDir, dimensionValue, 'mojits');

        t.ok(fs.existsSync(appYaml), appYaml);

        fs.stat(mojitsDir, function (err, stats) {
            t.ok(stats.isDirectory(), mojitsDir);
        });

        fs.readFile(appYaml, function (err, data) {
            var yaml = JSON.parse(data);
            t.equal(yaml[0].settings[0], dimensionName + ':' + dimensionValue, 'context');
            t.equal(yaml[0].selector, dimensionValue, 'selector');
        });
    }

    t.plan(4);
    fn(getEnv(args), cb);
});

test('[func] create existing dir', function (t) {
    var name = 'experiment_dimension',
        args = ['create', name, artifacts],

        expected = "'" + path.join(artifacts, 'mojito-dimensions-experiment_dimension') + "' exists.";


    function cb(err) {
        t.equal(err, expected, 'Error');
    }

    t.plan(1);
    fn(getEnv(args), cb);
});

test('[func] value existing dir', function (t) {
    var name = 'foo',
        pkgDir = path.join(artifacts, 'mojito-dimensions-experiment_dimension'),
        args = ['value', name, pkgDir],

        expected = "'" + path.join(pkgDir, name) + "' exists.";

    function cb(err) {
        t.equal(err, expected, 'Error');
    }

    t.plan(1);
    fn(getEnv(args), cb);
});
