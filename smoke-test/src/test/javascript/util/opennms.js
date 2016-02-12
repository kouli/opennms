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
		this.capture('target/screenshots/timeout-wait.png');
	};
	self.casper.options.onTimeout = function() {
		this.capture('target/screenshots/timeout.png');
	};
	self.casper.options.onStepTimeout = function() {
		this.capture('target/screenshots/timeout-step.png');
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
	var self = this;

	self.casper.thenOpen(self.root() + '/rest/requisitions', {
		method: 'post',
		data: obj || {'foreign-source': foreignSource},
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	}, function(response) {
		if (response.status !== 200) {
			console.log('Unexpected response: ' + JSON.stringify(response));
			throw new CasperError('POST of requisition ' + foreignSource + ' should return success.');
		}
	});
	self.casper.back();
};

OpenNMS.prototype.fetchRequisition = function(foreignSource) {
	var self = this;

	self.casper.thenOpen(self.root() + '/rest/requisitions/' + foreignSource, {
		headers: {
			Accept: 'application/json'
		}
	});
};

OpenNMS.prototype.assertRequisitionExists = function(foreignSource) {
	var self = this;

	self.casper.thenOpen(self.root() + '/rest/requisitions/' + foreignSource, {
		headers: {
			Accept: 'application/json'
		}
	}, function(response) {
		if (response.status !== 200) {
			console.log('Unexpected response: ' + JSON.stringify(response));
			throw new CasperError('GET of requisition ' + foreignSource + ' should return success.');
		}
	});
	self.casper.back();
};

OpenNMS.prototype.importRequisition = function(foreignSource) {
	var self = this;

	self.casper.thenOpen(self.root() + '/rest/requisitions/' + foreignSource + '/import', {
		method: 'put',
		headers: {
			'Content-Type': 'application/json',
			Accept: '*/*'
		}
	}, function(response) {
		if (response.status !== 415) {
			console.log('Unexpected response: ' + JSON.stringify(response));
			throw new CasperError('(sigh) import of requisition ' + foreignSource + ' redirects to a page that eventually gives a 415 error.');
		}
	});
	self.casper.back();
	self.casper.wait(5000);
};

OpenNMS.prototype.deleteRequisition = function(foreignSource) {
	var self = this;

	self.casper.thenOpen(self.root() + '/rest/requisitions/' + foreignSource, {
		method: 'delete'
	}, function(response) {
		if (response.status !== 200) {
			console.log('Unexpected response: ' + JSON.stringify(response));
			throw new CasperError('DELETE of requisition ' + foreignSource + ' should return success.');
		}
	});
	self.casper.back();
};

OpenNMS.prototype.ensureNoRequisitions = function() {
	var self = this;

	var enrLog = function(text) {
		self.casper.echo('OpenNMS.ensureNoRequisitions: ' + text, 'INFO');
	}

	self.casper.thenOpen(self.root() + '/rest/requisitions', {
		headers: {
			Accept: 'application/json'
		}
	});

	self.casper.then(function() {
		var content = this.getPageContent();
		if (content.indexOf('"model-import"') < 0) {
			console.log('Unexpected content: ' + content);
			throw new CasperError('"model-import" JSON field should be found');
		}
		var requisition = JSON.parse(this.getPageContent());
		if (requisition.count > 0) {
			for (var i=0; i < requisition.count; i++) {
				var foreignSource = requisition['model-import'][i]['foreign-source'];
				self.casper.then(function() {
					enrLog('clearing ' + foreignSource);
					self.createOrReplaceRequisition(foreignSource);
				});
				self.casper.wait(100);
				self.casper.then(function() {
					enrLog('importing empty ' + foreignSource);
					self.importRequisition(foreignSource);
				});
				self.casper.wait(100);
				self.casper.then(function() {
					enrLog('deleting ' + foreignSource);
					self.deleteRequisition(foreignSource);
				});
				self.casper.wait(100);
			}
		}
		self.casper.then(function() {
			self.casper.back();
		});
	});
};

module.exports = function(casper, options) {
	return new OpenNMS(casper, options);
}