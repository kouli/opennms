'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('Event List Page', 16, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		casper.thenOpen(opennms.root() + '/event/list');
	},

	test: function(test) {
		casper.then(function() {
			test.assertExists('form[name="event_search"]', 'event search form should exist');
			test.assertExists('form[name="acknowledge_form"]', 'acknowledgement form should exist');

			test.assertSelectorHasText('th a', 'ID');
			test.assertSelectorHasText('th a', 'Severity');
			test.assertSelectorHasText('th a', 'Time');
			test.assertSelectorHasText('th a', 'Node');
			test.assertSelectorHasText('th a', 'Interface');
			test.assertSelectorHasText('th a', 'Service');
		});

		casper.then(function() {
			casper.click('button[onclick="$(\'#advancedSearchModal\').modal()"]');
		});
		casper.then(function() {
			test.assertExists('input[name="msgsub"]');
			test.assertExists('input[name="iplike"]');
			test.assertExists('input[name="nodenamelike"]');
			test.assertExists('select[name="severity"]');
			test.assertExists('input[name="exactuei"]');
			test.assertExists('select[name="service"]');
			test.assertExists('input[name="usebeforetime"]');
		});

		casper.thenOpen(opennms.root()+'/event/detail.jsp?id=999999999');
		casper.then(function() {
			test.assertSelectorHasText('div#content > p', 'Event not found in database.');
		});

		opennms.finished(test);
	}
});