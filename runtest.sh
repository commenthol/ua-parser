#!/bin/bash

pwd=$(pwd)

## node
npm test
## python
python py/ua_parser/user_agent_parser_test.py
## php
php php/bin/uaparser.php ua-parser:convert
cd php && ../vendor/bin/phpunit --exclude-group performance && cd $pwd
## java
## - single test
#~ cd java && mvn -Dtest=ParserTest#testReplacementQuoting test && cd $pwd
## - ~ 1min
cd java && mvn -Dtest=UserAgentTest,OSTest,DeviceTest,ParserTest test && cd $pwd
## - ~ 5min
#~ cd java && mvn test && cd $pwd 
## perl
export DEV_TESTS=1
cd perl && perl Makefile.PL && make test && make clean && cd $pwd
