sfdx-steampunk-data
===================

Steampunk&#39;s SFDX Data Plugin

[![Version](https://img.shields.io/npm/v/@steampunk/sfdx-steampunk-data.svg)](https://www.npmjs.com/package/@steampunk/sfdx-steampunk-data)
[![Known Vulnerabilities](https://snyk.io/test/github/steampunkfoundry/sfdx-steampunk-data/badge.svg)](https://snyk.io/test/github/steampunkfoundry/sfdx-steampunk-data)
[![Downloads/week](https://img.shields.io/npm/dw/@steampunk/sfdx-steampunk-data.svg)](https://www.npmjs.com/package/@steampunk/sfdx-steampunk-data)
[![License](https://img.shields.io/npm/l/@steampunk/sfdx-steampunk-data.svg)](https://www.npmjs.com/package/@steampunk/sfdx-steampunk-data)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-steampunk-data
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-steampunk-data/0.1.0 win32-x64 node-v16.7.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-helloorg--n-string--f--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

print a greeting and your org IDs

```
print a greeting and your org IDs

USAGE
  $ sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --force                                                                       example boolean flag
  -n, --name=name                                                                   name to print

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ sfdx hello:org --targetusername myOrg@example.com --targetdevhubusername devhub@org.com
     Hello world! This is org: MyOrg and I will be around until Tue Mar 20 2018!
     My hub org id is: 00Dxx000000001234
  
  $ sfdx hello:org --name myname --targetusername myOrg@example.com
     Hello myname! This is org: MyOrg and I will be around until Tue Mar 20 2018!
```
<!-- commandsstop -->
