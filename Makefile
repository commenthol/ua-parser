PWD = $(shell pwd)

all: test

test: test-js test-py test-php test-perl test-java

test-js:
	npm test

test-py:
	python py/ua_parser/user_agent_parser_test.py

test-php:
	php php/bin/uaparser.php ua-parser:convert
	cd php && ../vendor/bin/phpunit --exclude-group performance
	@cd $(PWD)

test-perl:
	cd perl && perl Makefile.PL
	cd perl && make
	cd perl && export DEV_TESTS=1 && make test
	@cd $(PWD)

test-java:
	cd java && mvn -Dtest=UserAgentTest,OSTest,DeviceTest,ParserTest test
	@cd $(PWD)

clean:
	cd perl && make clean
	@cd $(PWD)

.PHONY: all clean
