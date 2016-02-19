'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

var foreignSource = 'quick-add-node';
var testNodeIpAddress = '192.0.2.123';
var testNodeLabel = 'AddNodePageTest';

casper.test.begin('Quick-Add Node', 7, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		opennms.ensureNoRequisitions();
	},

	test: function(test) {
		opennms.createOrReplaceRequisition(foreignSource);
		opennms.assertRequisitionExists(foreignSource);
		opennms.importRequisition(foreignSource);
		opennms.waitForRequisition(foreignSource, 1);
		casper.thenOpen(opennms.root() + '/admin/node/add.htm', function() {
			test.assertSelectorHasText('h3.panel-title', 'Basic Attributes (required)', 'The quick-add page should have a "Basic Attributes" header.');
		});
		casper.then(function() {
			this.fill('form', {
				foreignSource: foreignSource,
				ipAddress: testNodeIpAddress,
				nodeLabel: testNodeLabel
			}, false);
		});
		casper.then(function() {
			this.click('input[type="submit"][value="Provision"]');
		})

		casper.wait(2000);
		casper.then(function() {
			this.clickLabel('Provisioning Requisitions');
		});
		casper.waitForSelector('button[tooltip="Edit the '+foreignSource+' Requisition"]', function() {
			test.assertSelectorHasText('td[class="ng-binding"]', foreignSource, 'There should be a row for the test foreign source');
		});

		casper.then(function() {
			opennms.fetchRequisition(foreignSource);
		});
		casper.then(function() {
			var content = this.getPageContent();
			test.assertTruthy(content.indexOf('"date-stamp":'), '"date-stamp" JSON field should be found');
			var requisition = JSON.parse(this.getPageContent());
			test.assertTruthy(requisition, 'requisition should not be undefined');
			test.assertTruthy(requisition.node, 'requisition node should be defined');
			test.assertEquals(requisition.node.length, 1, 'requisition should have one node');
			test.assertEquals(requisition.node[0]['node-label'], testNodeLabel, 'node should have label "' + testNodeLabel + '"');
		});
		casper.back();

		opennms.finished(test);
	}
});
