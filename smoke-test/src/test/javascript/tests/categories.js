'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('Categories', 4, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
	},

	test: function(test) {
		casper.then(function() {
			casper.clickLabel('Network Interfaces');
		});
		casper.then(function() {

		});
		casper.then(function() {
			test.assertUrlMatches(/rtc\/category\.jsp/);

			test.assertSelectorHasText('table.severity th', 'Nodes');
			test.assertSelectorHasText('table.severity th', 'Outages');
			test.assertSelectorHasText('table.severity th', '24hr Availability');
		});

		opennms.finished(test);
	}
});