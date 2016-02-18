'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('Node List Page', 4, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		opennms.createOrReplaceRequisition('node-list-test', {
			node: [
				{
					'foreign-id': 'a',
					'node-label': 'a'
				},
				{
					'foreign-id': 'b',
					'node-label': 'b'
				}
			]
		});
		opennms.importRequisition('node-list-test');
		casper.then(function() {
			this.wait(5000);
		});
		casper.thenOpen(opennms.root() + '/element/nodeList.htm');
	},

	test: function(test) {
		casper.then(function() {
			test.assertSelectorHasText('h3.panel-title', 'Nodes');
			test.assertExists('i.fa-database', 'database node info toggle should exist');
			test.assertSelectorHasText('div#content > p > a', 'Show interfaces');
		});
		casper.then(function() {
			casper.clickLabel('Show interfaces');
		});
		casper.then(function() {
			test.assertSelectorHasText('div#content > p > a', 'Hide interfaces');
		});

		opennms.finished(test);
	}
});
