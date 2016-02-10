function Selector(selector, text) {
	this.selector = selector;
	this.text = text;
}

var numTests = 36;

var links = {
	// OpenNMS System
	'System Configuration': 'OpenNMS Configuration',
	'Configure Users, Groups and On-Call Roles': 'Users and Groups',

	// Provisioning
	'Manage Provisioning Requisitions': new Selector('h4', 'Requisitions (0)'),
	'Import and Export Asset Information': 'Import and Export Assets',
	'Manage Surveillance Categories': 'Surveillance Categories',
	'Configure Discovery': 'General Settings',
	'Manually Add an Interface': 'Enter IP Address',
	'Delete Nodes': 'Delete Nodes',

	// Event Management
	'Manually Send an Event': 'Send Event to OpenNMS',
	'Configure Notifications': 'Configure Notifications',
	'Customize Event Configurations': new Selector('div[id="content"] > iframe[src="admin-events"]'),

	// Service Monitoring
	'Configure Scheduled Outages': new Selector('form > input[value="New Name"]'),
	'Configure SNMP Community Names by IP Address': 'SNMP Config Lookup',
	'Manage and Unmanage Interfaces and Services': 'Manage and Unmanage Interfaces and Services',

	// Performance Measurement
	'Configure SNMP Collections and Data Collection Groups': new Selector('div[id="content"] > iframe'),
	'Configure SNMP Data Collection per Interface': 'Manage SNMP Data Collection per Interface',
	'Configure Thresholds': 'Threshold Configuration',

	// Distributed Monitoring
	'Manage Monitoring Locations': new Selector('div.panel > table tr a', 'Location Name'),
	'Manage Applications': 'Applications',
	'Manage Remote Pollers': 'Remote Poller Status',
	'Manage Minions': new Selector('div.panel > table tr a', 'ID'),

	// Additional Tools
	'Instrumentation Log Reader': 'Filtering',
	'SNMP MIB Compiler': new Selector('div[id="content"] > iframe[src="mib-compiler"]'),
	'Ops Board Configuration': new Selector('div[id="content"] > iframe[src="osgi/wallboard-config"]'),
	'Surveillance Views Configuration': new Selector('div[id="content"] > iframe[src="osgi/vaadin-surveillance-views-config"]'),
	'JMX Configuration Generator': new Selector('div[id="content"] > iframe[src="osgi/jmx-config-tool"]')
};

casper.test.begin('Admin Page Links', numTests, function suite(test) {
	var opennms = require('../../util/opennms')(casper),
		utils = require('utils');

	opennms.initialize();
	opennms.login();

	var adminLink = opennms.root() + '/admin/index.jsp';

	casper.thenOpen(adminLink, function() {
		test.assertElementCount('h3.panel-title', 8);
		test.assertSelectorHasText('h3.panel-title', 'OpenNMS System');
		test.assertSelectorHasText('h3.panel-title', 'Provisioning');
		test.assertSelectorHasText('h3.panel-title', 'Event Management');
		test.assertSelectorHasText('h3.panel-title', 'Service Monitoring');
		test.assertSelectorHasText('h3.panel-title', 'Performance Measurement');
		test.assertSelectorHasText('h3.panel-title', 'Distributed Monitoring');
		test.assertSelectorHasText('h3.panel-title', 'Additional Tools');
		test.assertSelectorHasText('h3.panel-title', 'Descriptions');
	});

	var linkNames = Object.keys(links);

	casper.then(function() {
		test.assertElementCount('div.panel li', linkNames.length, 'Admin page should have ' + linkNames.length + ' links.');
	});

	var processLink = function(linkName, subject) {
		var selector, matchText;
		if (subject instanceof Selector) {
			selector = subject.selector;
			matchText = subject.text;
		} else {
			selector = 'h3.panel-title';
			matchText = subject;
		}

		casper.thenOpen(adminLink);
		casper.then(function() {
			casper.clickLabel(linkName);

			casper.waitForSelector(selector, function() {
				if (matchText) {
					test.assertSelectorHasText(selector, matchText, linkName + ' should contain text "' + matchText + '"');
				} else {
					test.assertExists(selector, linkName + ' should contain the CSS selector: ' + selector);
				}
			});

			casper.then(function() {
				casper.back();
			});
		});
	};

	for (var i=0, len=linkNames.length; i < len; i++) {
		var linkName = linkNames[i];
		var subject = links[linkName];
		processLink(linkName, subject);
	}

	opennms.finished(test);
});