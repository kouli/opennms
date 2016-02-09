'use strict';

function CasperConfigurer(casper) {
	this.casper = casper;

	this.initialize();
}

CasperConfigurer.prototype.initialize = function() {
	var self = this;
	self.configureViewport();
	self.configureLogging();
	self.enableScreenshots();
	self.enableXunit();
};

CasperConfigurer.prototype.configureLogging = function() {
	var self = this;
	self.casper.on('remote.message', function(message) {
		self.casper.log(message, 'debug');
	});
};

CasperConfigurer.prototype.configureViewport = function() {
	var self = this;
	self.casper.options.viewportSize = {
		width: 1920,
		height: 1024
	};
};

CasperConfigurer.prototype.enableScreenshots = function() {
	var self = this;
	self.casper.options.onWaitTimeout = function() {
		this.capture('target/screenshots/timeout.png');
		self.casper.exit(1);
	};
	self.casper.test.on('fail', function(failure) {
		if (failure && typeof failure.message === 'string' || failure.message instanceof String) {
			var message = failure.message.replace(/[^A-Za-z0-9]+/gm, '-').replace(/^\-/, '').replace(/\-$/, '').toLowerCase();
			self.casper.capture('target/screenshots/' + message + '.png');
		} else {
			console.log('Unsure how to handle failure: ' + JSON.stringify(failure));
		}
	});
};

CasperConfigurer.prototype.enableXunit = function() {
	var testName, self = this;
	if (self.casper.cli && self.casper.cli.args) {
		for (var i=0, len=self.casper.cli.args.length, arg; i < len; i++) {
			arg = self.casper.cli.args[i];
			if (arg.indexOf('src/test/javascript/tests') === 0) {
				testName = arg.replace('src/test/javascript/tests/', '').replace(/[^A-Za-z0-9-]+/, '-').replace(/\.js$/, '');
			}
		}
	}

	if (testName) {
		self.casper.test.on('tests.complete', function() {
			console.log('Tests complete.');
			this.renderResults(undefined, undefined, 'target/failsafe-results/' + testName + '.xml');
		});
	} else {
		console.log('WARNING: Unable to infer test name from casper arguments.  Unable to write xUnit output.');
	}
};

module.exports = function(casper) {
	return new CasperConfigurer(casper);
}