'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('Reports Page', 15, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		casper.thenOpen(opennms.root() + '/report/index.jsp');
	},

	test: function(test) {
		casper.then(function() {
			test.assertSelectorHasText('h3.panel-title', 'Report');
			test.assertSelectorHasText('h3.panel-title', 'Descriptions');
			test.assertExists('form[name="resourceGraphs"] input#resourceName', 'Resource graphs form should exist');
			test.assertExists('form[name="kscReports"] input#kscName', 'KSC reports form should exist');
		});

		casper.then(function() {
			casper.clickLabel('Charts');
		});
		casper.then(function() {
			test.assertExists('img[src="charts?chart-name=sample-bar-chart"]', 'Sample Bar Chart image should exist');
			casper.back();
		});

		casper.then(function() {
			casper.clickLabel('Resource Graphs');
		});
		casper.then(function() {
			test.assertSelectorHasText('h3.panel-title', 'Network Performance Data');
			test.assertTextExists('Choose a resource for a standard performance report.');
			test.assertTextExists('Choose a resource for a custom performance report.');
			casper.back();
		});

		casper.then(function() {
			casper.clickLabel('KSC Performance, Nodes, Domains');
		});
		casper.then(function() {
			test.assertSelectorHasText('h3.panel-title', 'Customized Reports');
			test.assertSelectorHasText('h3.panel-title', 'Descriptions');
			test.assertSelectorHasText('h3.panel-title', 'Node & Domain Interface Reports');
			casper.back();
		});

		casper.then(function() {
			casper.clickLabel('Database Reports');
		});
		casper.then(function() {
			test.assertSelectorHasText('h3.panel-title', 'Database Reports');
			test.assertSelectorHasText('h3.panel-title', 'Descriptions');
			casper.back();
		});

		casper.then(function() {
			casper.clickLabel('Statistics Reports');
		});
		casper.then(function() {
			test.assertSelectorHasText('h3.panel-title', 'Statistics Report List');
			test.assertTextExists('None found.');
			casper.back();
		});

		opennms.finished(test);
	}
});