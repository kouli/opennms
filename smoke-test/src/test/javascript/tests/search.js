'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('Search Page', 20, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		casper.thenOpen(opennms.root() + '/element/index.jsp');
	},

	test: function(test) {
		casper.then(function() {
			test.assertElementCount('h3.panel-title', 3);
			test.assertSelectorHasText('h3.panel-title', 'Search for Nodes');
			test.assertSelectorHasText('h3.panel-title', 'Search Asset Information');
			test.assertSelectorHasText('h3.panel-title', 'Search Options');
		});

		casper.then(function() {
			test.assertElementCount('form', 9);
			test.assertExists('form[action="element/nodeList.htm"] input#byname_nodename', '"Name containing" form should exist');
			test.assertExists('form[action="element/nodeList.htm"] input#byip_iplike', '"TCP/IP Address like" form should exist');
			test.assertExists('form[action="element/nodeList.htm"] select[name="mib2Parm"]', '"System attribute" form should exist');
			test.assertExists('form[action="element/nodeList.htm"] select[name="snmpParm"]', '"Interface attribute" form should exist');
			test.assertExists('form[action="element/nodeList.htm"] select#byservice_service', '"Providing service" form should exist');
			test.assertExists('form[action="element/nodeList.htm"] input[name="maclike"]', '"MAC Address like" form should exist');
			test.assertExists('form[action="element/nodeList.htm"] input[name="foreignSource"]', '"Foreign Source name like" form should exist');
			test.assertExists('form[action="asset/nodelist.jsp"] select#bycat_value', 'Asset "Category" form should exist');
			test.assertExists('form[action="asset/nodelist.jsp"] select#byfield_column', 'Asset "Field Containing text" form should exist');
		});
		casper.then(function() {
			casper.clickLabel('All nodes');
		});
		casper.then(function() {
			test.assertElementCount('h3.panel-title', 1);
			test.assertSelectorHasText('h3.panel-title', 'Nodes');
			casper.back();
		});

		casper.then(function() {
			casper.clickLabel('All nodes and their interfaces');
		});
		casper.then(function() {
			test.assertElementCount('h3.panel-title', 1);
			test.assertSelectorHasText('h3.panel-title', 'Nodes and their interfaces');
			casper.back();
		});

		casper.then(function() {
			casper.clickLabel('All nodes with asset info');
		});
		casper.then(function() {
			test.assertElementCount('h3.panel-title', 1);
			test.assertSelectorHasText('h3.panel-title', 'Assets');
			casper.back();
		});

		opennms.finished(test);
	}
});