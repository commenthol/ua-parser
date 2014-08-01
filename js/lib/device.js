'use strict';

var replaceMatches = require('./replacematches');

exports.Device = Device;

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

exports.makeParser = function(regexes) {
  var parsers = (regexes||[]).map(function (obj) {
    var regexp,
        deviceRep = obj.device_replacement,
        brandRep = obj.brand_replacement,
        modelRep  = obj.model_replacement;
        
    if (obj.regex_flag) {
      regexp = new RegExp(obj.regex, obj.regex_flag);
    }
    else {
      regexp = new RegExp(obj.regex);
    }

    function parser(str) {
      var m = str.match(regexp);
      if (!m) { return null; }

      var family = deviceRep ? replaceMatches(deviceRep, m) : m[1];
      var brand  = brandRep  ? replaceMatches(brandRep, m)  : null;
      var model  = modelRep  ? replaceMatches(modelRep, m)  : m[1];
      return new Device(family, brand, model);
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

    return obj || new Device();
  }

  return parser;
};
