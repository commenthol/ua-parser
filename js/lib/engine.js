var
	OS = require('./os').OS;

exports.Engine = Engine;

function Engine(family, major, minor, patch) {
	this.family = family || 'Other';
	this.major = major || null;
	this.minor = minor || null;
	this.patch = patch || null;
}

require('util').inherits(Engine, OS);

function multiReplace(str, m) {
	return str.replace(/\$(\d)/g, function(tmp, i) {
		return m[i] || '';
	}).replace(/^\s+|\s+$/gm, '');
}

exports.makeParser = function(regexes) {
	var parsers = regexes.map(function (obj) {
		var regexp,
				famRep   = obj.family_replacement,
				majorRep = obj.v1_replacement,
				minorRep = obj.v2_replacement,
				patchRep = obj.v3_replacement;
				
		if (obj.regex_flag) {
			regexp = new RegExp(obj.regex, obj.regex_flag);
		}
		else {
			regexp = new RegExp(obj.regex);
		}

		function parser(str) {
			var m = str.match(regexp);
			if (!m) { return null; }

			var
				family = famRep  ? multiReplace(famRep, m)   : m[1],
				major = majorRep ? multiReplace(majorRep, m) : m[2],
				minor = minorRep ? multiReplace(minorRep, m) : m[3],
				patch = patchRep ? multiReplace(patchRep, m) : m[4];

			return new Engine(family, major, minor, patch);
		}

		return parser;
	});

	function parser(str) {
		var obj;

		if (typeof str === 'string') {
			for (var i = 0, length = parsers.length; i < length; i++) {
				obj = parsers[i](str);
				if (obj) { return obj; }
			}
		}

		return obj || new Engine();
	}

	return parser;
};
