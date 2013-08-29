# mojito-cli-dimension

Build Status
------------

[![Build Status](https://travis-ci.org/yahoo/mojito-cli-dimension.png)](https://travis-ci.org/yahoo/mojito-cli-dimension)

Usage
-----

Provides `dimension` _mojito-cli_ command for creating dimensions `super-bundle` packages.

## Install

```bash
npm install mojito-cli-dimension -g
```

## Usage

```bash
$ mojito help dimension

    Usage: mojito dimension [options] [create|value] [name] [dir]

      create    Creates a new dimensions super-bundle package

      value     Creates a new dimension value dir in
                an existing super-bundle package.

    Options:
      --prefix  Package name prefix (default: mojito-dimensions)

    Examples:
      To create an experiments dimension package:
        mojito dimension create experiment_foo
        # creates package mojito-dimensions-experiment_foo

      To create a package on a different dir:
        mojito dimension create experiment_foo /path/to/pkg
        # creates package /path/to/pkg/mojito-dimensions-experiment_foo

      To create a dimension value:
        cd mojito-dimensions-experiment_foo
        mojito dimension value EXP001
        # initializes experiment at mojito-dimensions-experiment_foo/EXP001

      Use a different package prefix:
        mojito dimension --prefix=my-dimensions create experiment_foo
        # creates package my-dimensions-experiment_foo
```

See: [mojito-dimensions-base]

[mojito-dimensions-base]: https://github.com/yahoo/mojito-dimensions-base