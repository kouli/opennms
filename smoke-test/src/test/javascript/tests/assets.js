'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('Assets Page', 6, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		casper.thenOpen(opennms.root() + '/asset/index.jsp');
	},

	test: function(test) {
		casper.then(function() {
			test.assertElementCount('h3.panel-title', 3);
			test.assertSelectorHasText('h3.panel-title', 'Search Asset Information');
			test.assertSelectorHasText('h3.panel-title', 'Assets with Asset Numbers');
			test.assertSelectorHasText('h3.panel-title', 'Assets Inventory');
            test.assertExists('a[href="asset/nodelist.jsp?column=_allNonEmpty"]');
		});

		casper.then(function() {
			casper.clickLabel('All nodes with asset info');
		});
		casper.then(function() {
            test.assertSelectorHasText('h3.panel-title', 'Assets');
		});

		opennms.finished(test);
	}
});