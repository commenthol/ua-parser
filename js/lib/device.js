'use strict';

function Device(family, brand, model) {
  this.family = family || 'Other';
  this.brand = brand || null;
  this.model = model || null;
}

Device.prototype.toString = function() {
  var output = '';
	if (this.brand !== null) {
		output += this.brand;
		if (this.model !== null) {
			output += ' ' + this.model;
		}
	}
	else if (this.family) {
		output = this.family;
	}
	return output;
};

module.exports = Device;
