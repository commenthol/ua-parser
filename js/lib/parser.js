'use strict';

var
	UA = require('./ua'),
	replaceMatches = require('./replacematches');

function parser (regexes, options) {
	var self = {};
	self.options = options || {};

	function _make(obj) {
		var
			regexp        = (obj.regex_flag ? new RegExp(obj.regex, obj.regex_flag) : new RegExp(obj.regex)),
			familyPrefix  = self.options.prefix || 'family',
			versionPrefix = (self.options.prefix ? self.options.prefix + '_' : ''),
			famRep        = obj[familyPrefix + '_replacement'],
			majorRep      = obj[versionPrefix + 'v1_replacement'],
			minorRep      = obj[versionPrefix + 'v2_replacement'],
			patchRep      = obj[versionPrefix + 'v3_replacement'],
			patchMinorRep = obj[versionPrefix + 'v4_replacement'],
			typeRep       = obj[versionPrefix + 'type_replacement'];

		return function (str) {
			var m = str.match(regexp);
			if (!m) { return null; }

			var
				family = famRep  ? replaceMatches(famRep, m)   : m[1],
				major = majorRep ? replaceMatches(majorRep, m) : m[2],
				minor = minorRep ? replaceMatches(minorRep, m) : m[3],
				patch = patchRep ? replaceMatches(patchRep, m) : m[4],
				patchMinor;

			if (self.options.usePatchMinor) {
				patchMinor = (patchMinorRep ? replaceMatches(patchMinorRep, m) : m[5]) || null;
			}
			return new UA(family, major, minor, patch, patchMinor, typeRep);
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

		return obj || new UA();
	};

	return self;
}

module.exports = parser;
