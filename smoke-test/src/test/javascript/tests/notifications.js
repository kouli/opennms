'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('Notifications Page', 21, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		casper.thenOpen(opennms.root() + '/notification/index.jsp');
	},

	test: function(test) {
		casper.then(function() {
			test.assertSelectorHasText('h3.panel-title', 'Notification queries');
			test.assertSelectorHasText('h3.panel-title', 'Outstanding and Acknowledged Notices');
			test.assertSelectorHasText('h3.panel-title', 'Notification Escalation');

			test.assertSelectorHasText('form button', 'Check notices');
			test.assertSelectorHasText('form button', 'Get details');

			test.assertExists('div.panel-body ul > li > a', 'Your outstanding notices');
			test.assertExists('div.panel-body ul > li > a', 'All outstanding notices');
			test.assertExists('div.panel-body ul > li > a', 'All acknowledged notices');
		});

		casper.then(function() {
			casper.clickLabel('Your outstanding notices');
		});
		casper.then(function() {
			test.assertSelectorHasText('div#content > p > strong', 'outstanding');
			test.assertSelectorHasText('div#content > p > a', '[Show acknowledged]');
			test.assertSelectorHasText('th a', 'Respond Time');
			test.assertSelectorHasText('span[class="label label-default"]', 'admin was notified [-]');
			test.assertSelectorHasText('div#content > p > a', '[Remove all]');
		});
		casper.back();

		casper.then(function() {
			casper.clickLabel('All outstanding notices');
		});
		casper.then(function() {
			test.assertSelectorHasText('div#content > p > strong', 'outstanding');
			test.assertSelectorHasText('div#content > p > a', '[Show acknowledged]');
			test.assertSelectorHasText('th a', 'Respond Time');
			test.assertSelectorDoesntHaveText('span[class="label label-default"]', 'admin was notified [-]');
		});
		casper.back();

		casper.then(function() {
			casper.clickLabel('All acknowledged notices');
		});
		casper.then(function() {
			test.assertSelectorHasText('div#content > p > strong', 'acknowledged');
			test.assertSelectorHasText('div#content > p > a', '[Show outstanding]');
			test.assertSelectorHasText('th a', 'Respond Time');
			test.assertSelectorDoesntHaveText('span[class="label label-default"]', 'admin was notified [-]');
		});

		opennms.finished(test);
	}
});
