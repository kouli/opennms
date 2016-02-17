'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('Remoting Page', 2, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		casper.thenOpen(opennms.root() + '-remoting/');
	},

	test: function(test) {
		casper.then(function() {
			test.assertSelectorHasText('h2 a', 'Remote Poller with GUI');
			test.assertSelectorHasText('h2 a', 'Remote Poller without GUI');
		});

		opennms.finished(test);
	}
});