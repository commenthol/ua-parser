'use strict';

var
	Device = require('./device'),
	replaceMatches = require('./replacematches');

function parser (regexes, options) {
	var self = {};
	self.options = options || {};

	function _make(obj) {
		var
			regexp        = (obj.regex_flag ? new RegExp(obj.regex, obj.regex_flag) : new RegExp(obj.regex)),
			deviceRep = obj.device_replacement,
			brandRep  = obj.brand_replacement,
			modelRep  = obj.model_replacement;

		return function (str) {
			var m = str.match(regexp);
			if (!m) { return null; }

			var
				family = deviceRep ? replaceMatches(deviceRep, m) : m[1],
				brand  = brandRep  ? replaceMatches(brandRep, m)  : null,
				model  = modelRep  ? replaceMatches(modelRep, m)  : m[1];

			return new Device(family, brand, model);
		};
	}

	self.parsers = (regexes||[]).map(_make);

	self.parse = function (str) {
		var obj, length, i;

		if (typeof str === 'string') {
			for (i = 0, length = self.parsers.length; i < length; i++) {
				obj = self.parsers[i](str);
				if (obj) { return obj; }
			}
		}

		return obj || new Device();
	};

	return self;
}

module.exports = parser;
