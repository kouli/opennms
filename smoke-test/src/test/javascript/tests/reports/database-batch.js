'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('Database Batch Reports', 8, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		casper.thenOpen(opennms.root() + '/report/index.jsp');
	},

	test: function(test) {
		casper.then(function() {
			casper.clickLabel('Database Reports');
		});
		casper.then(function() {
			casper.clickLabel('List reports');
		});
		casper.then(function() {
			test.assertElementCount('h3.panel-title', 1);
			test.assertSelectorHasText('h3.panel-title', 'Local Report Repository');
		});

		casper.then(function() {
			casper.click('td[class="o-report-deliver"] a');
		});
		casper.then(function() {
			test.assertElementCount('h3.panel-title', 1);
			test.assertSelectorHasText('h3.panel-title', 'Report Parameters');
			var matching = casper.getElementsInfo('h3').filter(function(element) {
				return element.text.indexOf('Error') >= 0;
			});
			test.assertFalsy(matching.length, 'There should be no H3 elements with "Error" in them.');
		});
		casper.then(function() {
			casper.back();
		});

		casper.then(function() {
			casper.click('td[class="o-report-schedule"] a');
		});
		casper.then(function() {
			test.assertElementCount('h3.panel-title', 1);
			test.assertSelectorHasText('h3.panel-title', 'Report Parameters');
			var matching = casper.getElementsInfo('h3').filter(function(element) {
				return element.text.indexOf('Error') >= 0;
			});
			test.assertFalsy(matching.length, 'There should be no H3 elements with "Error" in them.');
		});
		casper.then(function() {
			casper.back();
		});

		opennms.finished(test);
	}
});