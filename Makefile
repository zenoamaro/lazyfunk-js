DOCS=./node_modules/.bin/jsdoc
NODE=node --harmony
LINT=./node_modules/.bin/jshint
MOCHA=./node_modules/.bin/mocha --harmony
MOCHA_DIRECT=./node_modules/.bin/_mocha
ISTANBUL=$(NODE) ./node_modules/.bin/istanbul
WEBPACK=./node_modules/.bin/webpack

usage:
	@echo build ......... builds regular and minified distributables.
	@echo build-watch ... rebuilds on file change.
	@echo lint .......... lints the source.
	@echo test .......... runs the unit tests.
	@echo test-watch..... re-runs the tests on file change.
	@echo coverage ...... produces the code coverage reports.
	@echo benchmarks .... runs the benchmark suites.
	@echo docs .......... compiles the docs from the sources.
	@echo clean ......... removes the built artifacts.

lint:
	@$(LINT) lib

test:
	@$(MOCHA) test/index

test-watch:
	@$(MOCHA) -bw -R min test/index

coverage:
	@$(ISTANBUL) cover\
		$(MOCHA_DIRECT) -- -R dot test/index

ci-travis:
	@$(LINT) lib\
		&& $(ISTANBUL) cover --report lcovonly \
			$(MOCHA_DIRECT) -- -R dot test/index \
		&& $(ISTANBUL) check-coverage \
			--statements 80 \
			--functions 80 \
			--branches 80 \
			--lines 80

benchmarks:
	@$(NODE) bench/index

build:
	@$(WEBPACK) --config webpack.dev.js
	@$(WEBPACK) --config webpack.prod.js

build-watch:
	@$(WEBPACK) --config webpack.dev.js -w

docs:
	@$(DOCS) --configure .jsdocrc

clean:
	@if [ -d coverage ]; then rm -r coverage; fi; \
	 if [ -d docs ]; then rm -r docs; fi; \
	 if [ -d dist ]; then rm -r dist; fi

.PHONY: usage lint test test-watch coverage ci-travis \
        benchmarks build build-watch docs clean
