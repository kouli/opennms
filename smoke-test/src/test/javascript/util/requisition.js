'use strict';

function Requisition(casper) {
	this.casper = casper;
}

Requisition.prototype.getRequisition = function getRequisition(foreignSource) {
};

Requisition.prototype.assertRequisitionExists = function assertRequisitionExists(foreignSource) {
	var self = this;


};

module.exports = function(casper) {
	return new Requisition(casper);
};