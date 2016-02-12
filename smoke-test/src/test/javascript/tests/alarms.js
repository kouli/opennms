'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('Alarms Page', 15, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		opennms.createEvent({
			uei: 'uei.opennms.org/internal/importer/importFailed',
			source: 'AlarmsPageTest',
			parms: [
				{
					parmName: 'importResource',
					value: 'foo'
				}
			]
		});
		casper.thenOpen(opennms.root() + '/alarm/index.htm');
	},

	test: function(test) {
		casper.then(function() {
			test.assertElementCount('h3.panel-title', 3);
			test.assertSelectorHasText('h3.panel-title', 'Alarm Queries');
			test.assertSelectorHasText('h3.panel-title', 'Alarm Filter Favorites');
			test.assertSelectorHasText('h3.panel-title', 'Outstanding and acknowledged alarms');
			test.assertExists('form input#byalarmid_id');
		});

		casper.then(function() {
			casper.clickLabel('All alarms (summary)');
		});
        var alarmDetailLink;
		casper.then(function() {
			test.assertExists('a[title="Show acknowledged alarm(s)"]');
            test.assertTextDoesntExist('First Event Time');
            alarmDetailLink = casper.getElementAttribute('a[href*="alarm/detail.htm"]', 'href');
            test.assertTruthy(alarmDetailLink.indexOf(opennms.root()) === 0, 'Alarm detail link should start with the OpenNMS URL.');
		});
        casper.then(function() {
            casper.click('a[href="' + alarmDetailLink + '"]');
        });
        casper.then(function() {
            test.assertSelectorHasText('table.severity th:first-of-type', 'Severity');
            test.assertSelectorHasText('table.severity th:nth-of-type(2)', 'Node');
        });
        casper.then(function() {
            casper.back();
        });
        casper.then(function() {
            casper.back();
        });

        casper.then(function() {
            casper.clickLabel('All alarms (detail)');
        });
        casper.then(function() {
            test.assertExists('a[title="Show acknowledged alarm(s)"]');
            test.assertTextExists('First Event Time');
        });
        casper.then(function() {
            casper.back();
        });

        casper.then(function() {
            casper.clickLabel('Advanced Search');
        });
        casper.then(function() {
            test.assertExists('input[name="msgsub"]');
            test.assertExists('input[name="iplike"]');
        });
        casper.then(function() {
            casper.back();
        });

        casper.thenOpen(opennms.root() + '/alarm/detail.htm?id=999999999', function() {
            test.assertSelectorHasText('h1:first-of-type', 'Alarm ID Not Found');
        });

		opennms.finished(test);
	}
});