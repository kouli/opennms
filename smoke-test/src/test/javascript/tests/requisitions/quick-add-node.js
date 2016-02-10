'use strict';

casper.test.begin('Quick-Add Node', 2, function suite(test) {
	var opennms = require('../../util/opennms')(casper),
		utils = require('utils');

	var foreignSource = 'quick-add-node';

	opennms.login();
	opennms.createOrReplaceRequisition(foreignSource);
	opennms.assertRequisitionExists(foreignSource);
	opennms.importRequisition(foreignSource);

	setTimeout(function() {
		casper.thenOpen(opennms.root() + '/admin/node/add.htm', function() {
			test.assertSelectorHasText('h3[class="panel-title"]', 'Basic Attributes (required)');
		});

		casper.fill('form', {
			foreignSource: foreignSource,
			ipAddress: '192.0.2.123',
			nodeLabel: 'AddNodePageTest'
		}, true);

		/*
		casper.clickLabel('Provisioning Requisitions');
		casper.waitForSelector('button[tooltip="Edit the '+foreignSource+' Requisition"]', function() {
			test.assertSelectorHasText('td[class="ng-binding"]', foreignSource);
		});

		setTimeout(function() {
			opennms.assertRequisitionExists(foreignSource);
			casper.then(function() {
				var requisition = JSON.parse(this.getPageContent());
				console.log('requisition: ' + JSON.stringify(requisition));
			});

		}, 1000);
		*/
	}, 1000);

	test.tearDown(function() {
		opennms.deleteRequisition(foreignSource);
	});

	opennms.finished(test);
});