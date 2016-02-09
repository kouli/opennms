'use strict';

var defaultOptions = {
	url: 'http://localhost:8980/opennms',
	username: 'admin',
	password: 'admin'
};

function extend(target, source) {
	for (var key in source) {
		if (!target.hasOwnProperty(key)) {
			target[key] = source[key];
		}
	}
	return target;
}

function OpenNMS(casper, options) {
	this.casper = casper;
	this._options = options || {};
	extend(this._options, defaultOptions);

	this.initialize();
}

OpenNMS.prototype.initialize = function() {
	var self = this;
	self.configureViewport();
	self.configureLogging();
	self.enableScreenshots();
};

OpenNMS.prototype.configureLogging = function() {
	var self = this;
	if (!self.casper._loggingConfigured) {
		self.casper.on('remote.message', function(message) {
			self.casper.log(message, 'debug');
		});
		self.casper._loggingConfigured = true;
	}
};

OpenNMS.prototype.configureViewport = function() {
	var self = this;
	self.casper.options.viewportSize = {
		width: 1920,
		height: 1024
	};
};

var cleanText = function(text) {
	return text.replace(/[^A-Za-z0-9]+/gm, '-').replace(/^\-/, '').replace(/\-$/, '').toLowerCase();
};

OpenNMS.prototype.enableScreenshots = function() {
	var self = this;
	self.casper.options.onWaitTimeout = function() {
		this.capture('target/screenshots/timeout.png');
		self.casper.exit(1);
	};
	if (!self.casper._screenshotsEnabled) {
		self.casper.test.on('fail', function(failure) {
			//console.log('error: ' + JSON.stringify(failure));
			var message, file;
			if (failure && typeof failure.message === 'string' || failure.message instanceof String) {
				message = cleanText(failure.message);
			}
			if (failure && failure.file && failure.file.indexOf('src/test/javascript/tests') === 0) {
				file = cleanText(failure.file.replace('src/test/javascript/tests/', '').replace(/.js$/, ''));
			}
			if (!message && !file) {
				console.log('Unsure how to handle failure: ' + JSON.stringify(failure));
			} else {
				var outfile = message + '.png';
				if (file) {
					outfile = file + '-' + outfile;
				}
				self.casper.capture('target/screenshots/' + outfile);
			}
		});
		self.casper._screenshotsEnabled = true;
	}
};

OpenNMS.prototype.login = function login() {
	var self = this;

	self.casper.log('Filling OpenNMS login form.');
	var options = self.options();

	var formFill = function() {
		this.fill('form', {
			j_username: options.username,
			j_password: options.password
		}, true);
	};

	var url = self.root() + '/login.jsp';
	//console.log('opening URL: ' + url);
	if (self.casper._started) {
		self.casper.thenOpen(url, formFill, true);
	} else {
		self.casper._started = true;
		self.casper.start(url, formFill, true);
	}
	self.casper.then(function() {
		self.casper.log('Finished logging in.');
	});
	self.casper.setHttpAuth(options.username, options.password);
}

OpenNMS.prototype.logout = function() {
	var self = this;
	self.casper.thenOpen(self.root() + '/j_spring_security_logout');
	delete self.casper._started;
};

OpenNMS.prototype.options = function() {
	return extend({}, this._options);
};

OpenNMS.prototype.root = function() {
	return this.options().url;
};

OpenNMS.prototype.finished = function(test) {
	var self = this;
	self.logout();
	self.casper.run(function() {
		setTimeout(function() {
			test.done();
		},0);
	});
};

OpenNMS.prototype.createOrReplaceRequisition = function(foreignSource, obj) {
	var self = this,
		options = self.options();

	self.casper.thenOpen(self.root() + '/rest/requisitions', {
		method: 'post',
		data: obj || {'foreign-source': foreignSource},
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	}, function(response) {
		self.casper.test.assertEquals(response.status, 200, 'POST of requisition ' + foreignSource + ' should return success.');
	});
	self.casper.back();
};

OpenNMS.prototype.assertRequisitionExists = function(foreignSource) {
	var self = this,
		options = self.options();

	self.casper.thenOpen(self.root() + '/rest/requisitions/' + foreignSource, {
		headers: {
			Accept: 'application/json'
		}
	}, function(response) {
		self.casper.test.assertEquals(response.status, 200, 'GET of requisition ' + foreignSource + ' should return success.');
	});
	self.casper.back();
};

OpenNMS.prototype.deleteRequisition = function(foreignSource) {
	var self = this,
		options = self.options();

	self.casper.thenOpen(self.root() + '/rest/requisitions/' + foreignSource, {
		method: 'delete'
	}, function(response) {
		self.casper.test.assertEquals(response.status, 200, 'DELETE of requisition ' + foreignSource + ' should return success.');
	});
	self.casper.back();
};

module.exports = function(casper, options) {
	return new OpenNMS(casper, options);
}