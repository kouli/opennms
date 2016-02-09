'use strict';

casper.test.begin('Quick-Add Node', 2, function suite(test) {
	var opennms = require('../../util/opennms')(casper),
		utils = require('utils');

	var foreignSource = 'quick-add-node';

	opennms.login();
	opennms.createOrReplaceRequisition(foreignSource);
	opennms.assertRequisitionExists(foreignSource);

	opennms.finished(test);
});