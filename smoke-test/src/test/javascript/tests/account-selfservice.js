'use strict';

var opennms = require('../../util/opennms')(casper),
	utils = require('utils');

casper.test.begin('User Account Page', 10, {
	setUp: function() {
		opennms.initialize();
		opennms.login();
		casper.thenOpen(opennms.root() + '/account/selfService/index.jsp');
	},

	test: function(test) {
		casper.then(function() {
			test.assertElementCount('h3.panel-title', 2);
			test.assertSelectorHasText('h3.panel-title', 'User Account Self-Service');
			test.assertSelectorHasText('h3.panel-title', 'Account Self-Service Options');
		});

		casper.then(function() {
			test.assertElementCount('div.panel-body a', 1);
			test.assertExists('div.panel-body a', 'Change Password');
		});

		casper.then(function() {
			casper.click('div.panel-body a[href="javascript:changePassword()"]');
		});
		casper.then(function() {
			test.assertExists('form input#input_oldpass');
			casper.fill('form[name="goForm"]', {
				oldpass: '12345',
				pass1: '23456',
				pass2: '34567'
			}, false);
		});
		casper.then(function() {
			casper.waitForAlert(function(response) {
				test.assertEquals(response.data, 'The two new password fields do not match!', 'Receive an alert about the new passwords not matching.');
			}, function timeout() {
				test.fail('Never received non-matching password failure alert.');
			});
			casper.clickLabel('Submit');
		});

		casper.then(function() {
			test.assertDoesntExist('div.form-group.has-error input#input_oldpass');
			test.assertExists('form[name="goForm"] input[name="pass1"]');
			casper.fill('form[name="goForm"]', {
				oldpass: '12345',
				pass1: '23456',
				pass2: '23456'
			}, false);
		});
		casper.then(function() {
			casper.clickLabel('Submit');
		});
		casper.then(function() {
			test.assertExists('div.form-group.has-error input#input_oldpass', 'Form should give an error about an incorrect old password.');
		});

		opennms.finished(test);
	}
});