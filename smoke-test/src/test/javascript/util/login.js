'use strict';

var defaultOptions = {
	url: 'http://localhost:8980/opennms',
	username: 'admin',
	password: 'admin'
};

function Login(casper) {
	this.casper = casper;
	this.started = false;
}

Login.prototype.login = function login(options) {
	var self = this;

	if (!options) { options = {}; }
	for (var key in defaultOptions) {
		if (!options.hasOwnProperty(key)) {
			options[key] = defaultOptions[key];
		}
	}
	self.casper.log('Filling in OpenNMS form.');

	var formFill = function() {
		this.fill('form', {
			j_username: options.username,
			j_password: options.password
		}, true);
	};

	if (self.started) {
		self.casper.thenOpen(options.url, formFill, true);
	} else {
		self.started = true;
		self.casper.start(options.url, formFill, true);
	}
	self.casper.then(function() {
		self.casper.log('Finished filling out the form.');
	});
}

module.exports = function(casper) {
	return new Login(casper);
};