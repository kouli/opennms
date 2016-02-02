'use strict';

var configureCasper = function(casper) {
	casper.on('remote.message', function(message) {
		casper.log(message, 'debug');
	});
	casper.options.viewportSize = {
		width: 1920,
		height: 1024
	};
	casper.options.onWaitTimeout = function() {
		this.capture('target/screenshots/timeout.png');
		casper.exit(1);
	};
	casper.test.on('fail', function(failure) {
		if (failure && typeof failure.message === 'string' || failure.message instanceof String) {
			var message = failure.message.replace(/[^A-Za-z0-9]+/gm, '-').replace(/^\-/, '').replace(/\-$/, '').toLowerCase();
			casper.capture('target/screenshots/' + message + '.png');
		} else {
			console.log('Unsure how to handle failure: ' + JSON.stringify(failure));
		}
		casper.exit(1);
	});

	/*
	var testName;
	if (casper.cli && casper.cli.args) {
		for (var i=0, len=casper.cli.args.length, arg; i < len; i++) {
			arg = casper.cli.args[i];
			if (arg.indexOf('src/test/javascript/tests') === 0) {
				testName = arg.replace('src/test/javascript/tests/', '').replace(/[^A-Za-z0-9-]+/, '-').replace(/\.js$/, '');
			}
		}
	}

	if (testName) {
		casper.test.on('tests.complete', function() {
			console.log('Tests complete.');
			this.renderResults(undefined, undefined, 'target/failsafe-results/' + testName + '.xml');
		});
	} else {
		console.log('WARNING: Unable to infer test name from casper arguments.  Unable to write xUnit output.');
	}
	*/
};

module.exports = {
	configure: configureCasper
};