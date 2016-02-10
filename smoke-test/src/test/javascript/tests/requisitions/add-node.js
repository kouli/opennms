'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

var foreignSource = 'add-node-to-requisition-test';

casper.test.begin('Add Node to Requisition', 4, {
	setUp: function() {
		opennms.initialize();
	},

	tearDown: function() {
		opennms.deleteRequisition(foreignSource);
	},

	test: function(test) {
		opennms.login();
		opennms.deleteRequisition(foreignSource);

		casper.thenOpen(opennms.root() + '/admin/index.jsp');
		casper.then(function() {
			test.assertSelectorHasText('a[href="admin/ng-requisitions/app/index.jsp"]', 'Manage Provisioning Requisitions', 'Manage Provisioning Requisitions link exists.');
		});
		casper.then(function() {
			casper.clickLabel('Manage Provisioning Requisitions');
		});

		// Add a requisition
		casper.waitForSelector('button[id="add-requisition"]', function() {
			casper.click('button[id="add-requisition"]');
		});
		casper.waitForSelector('form[class="bootbox-form"] > input', function() {
			casper.fillSelectors('form[class="bootbox-form"]', {
				'input': foreignSource
			}, true);
		});

		// Edit the requisition
		casper.waitForSelector('button[tooltip="Edit the '+foreignSource+' Requisition"]', function() {
			test.assertSelectorHasText('td[class="ng-binding"]', foreignSource);
			casper.click('button[ng-click="edit(requisition.foreignSource)"]');
		});
		casper.waitForText('There are no nodes on the ' + foreignSource);

		// Synchronize the empty requisition
		casper.thenClick('#synchronize');
		casper.waitForSelector('.modal-dialog', function() {
			test.assertSelectorHasText('button[class="btn btn-danger"]', 'No');
		});
		casper.thenClick('button[class="btn btn-danger"]');
		casper.waitWhileSelector('.modal_dialog');
		casper.waitForText('There are no nodes on the ' + foreignSource);

		opennms.finished(test);
	}
});