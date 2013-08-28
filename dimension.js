#! /usr/bin/env node

"use strict";

var fs = require('fs'),
    os = require('os'),
    log = require('./lib/log'),
    path = require('path'),
    mkdirp = require('mkdirp'),

    actions = ['create', 'value'],

    defaultPkgPrefix = 'mojito-dimensions',
    pkgType = 'super-bundle',

    packagejson = {
        name: '',
        version: '0.0.1',
        dependencies: {
            'mojito-dimensions-base': '*'
        },
        yahoo: {
            mojito: {
                type: pkgType
            }
        }
    };

function main(env, cb) {
    var action = env.args.shift() || '',
        name = env.args.shift(),
        baseDir = env.args.shift() || process.cwd(),
        pkgPrefix = env.opts.prefix || defaultPkgPrefix,

        pkgName,
        pkgDir;

    if (actions.indexOf(action) === -1) {
        cb('Invalid action ' + action);
        return;
    }

    if (!name) {
        cb('name is required');
        return;
    }

    switch (action) {
    case 'create':
        pkgName = pkgPrefix + '-' + name.replace('-', '_').toLowerCase();
        pkgDir = path.resolve(baseDir, pkgName);

        fs.exists(pkgDir, function (exists) {
            if (exists) {
                cb("'" + pkgDir + "' exists.");
                return;
            }

            mkdirp(pkgDir, function () {
                packagejson.name = pkgName;
                fs.writeFile(path.resolve(pkgDir, 'package.json'),
                    JSON.stringify(packagejson, null, 4), function (err) {
                        if (err) {
                            cb(err);
                            return;
                        }
                        log.info('Created package:', pkgDir);
                        cb();
                    });
            });
        });
        break;

    case 'value':
        // check if we're in a dimension super-bundle
        fs.readFile(path.resolve(baseDir, 'package.json'), function (err, data) {
            var dimension,
                pkgInfo;

            if (err) {
                cb('Error reading package.json\nMake sure you\'re in the desired dimension package dir.');
                return;
            }

            pkgInfo = JSON.parse(data);
            if (!pkgInfo.name) {
                cb("No 'name' property in package.json");
                return;
            }
            if (!pkgInfo.yahoo || !pkgInfo.yahoo.mojito || !pkgInfo.yahoo.mojito.type ||
                    pkgInfo.yahoo.mojito.type !== pkgType) {
                cb("Package type is not 'super-bundle'");
                return;
            }

            dimension = pkgInfo.name.substring(pkgInfo.name.lastIndexOf('-') + 1);
            pkgDir = path.resolve(baseDir, name);

            fs.exists(pkgDir, function (exists) {
                if (exists) {
                    cb("'" + pkgDir + "' exists.");
                    return;
                }

                mkdirp(path.resolve(pkgDir, 'mojits'), function (err) {
                    var applicationyaml = [{
                        settings: [dimension + ':' + name],
                        selector: name
                    }];

                    if (err) {
                        cb(err);
                        return;
                    }
                    fs.writeFile(path.resolve(pkgDir, 'application.yaml'),
                        JSON.stringify(applicationyaml, null, 4), function (err) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            log.info('Created dimension value:', pkgDir);
                            cb();
                        });
                });
            });
        });
        break;

    default:
        cb('Invalid type');
    }
}

module.exports = main;

module.exports.usage = [
    'Usage: mojito dimension [options] [create|value] [name] [dir]',
    '',
    '  create    Creates a new dimensions super-bundle package',
    '',
    '  value     Creates a new dimension value dir in',
    '            an existing super-bundle package.',
    '',
    'Options:',
    '  --prefix  Package name prefix (default: mojito-dimensions)',
    '',
    'Examples:',
    '  To create an experiments dimension package:',
    '    mojito dimension create experiment_foo',
    '    # creates package mojito-dimensions-experiment_foo',
    '',
    '  To create a package on a different dir:',
    '    mojito dimension create experiment_foo /path/to/pkg',
    '    # creates package /path/to/pkg/mojito-dimensions-experiment_foo',
    '',
    '  To create a dimension value:',
    '    cd mojito-dimensions-experiment_foo',
    '    mojito dimension value EXP001',
    '    # initializes experiment at mojito-dimensions-experiment_foo/EXP001',
    '',
    '  Use a different package prefix:',
    '    mojito dimension --prefix=my-dimensions create experiment_foo',
    '    # creates package my-dimensions-experiment_foo',
    ''
].join(os.EOL);

main.options = [
    {shortName: null, hasValue: true, longName: 'prefix'}
];

