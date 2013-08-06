exports.Device = Device
function Device(family, brand, model) {
  this.family = family || 'Other';
  this.brand = brand || null;
  this.model = model || null;
}

Device.prototype.toString = function() {
  return this.family;
};

function replacer(options, str, matches) {
  var i;
  if (str) {
    for (i in matches) {
      if (matches[i]) {
        str = str.replace('$' + i, matches[i]);
      }
      else {
        str = str.replace('$' + i, '');
      }
    } 
  }
  else {
    if (options.first && matches && matches[1]) {
      str = matches[1];
    }
    else {
      str = null;
    }
  }
  return str;
}

exports.makeParser = function(regexes) {
  var parsers = regexes.map(function (obj) {
    var regexp = new RegExp(obj.regex),
        deviceRep = obj.device_replacement,
        brandRep = obj.brand,
        modelRep = obj.model;

    function parser(str) {
      var m = str.match(regexp);
      if (!m) { return null; }

      var family = replacer({first: true}, deviceRep, m);
      var brand = replacer({}, brandRep, m);
      var model = replacer({first: true}, modelRep, m);
      return new Device(family, brand, model);
    }

    return parser;
  });

  function parser(str, ua_family, os_family) {
    var obj;

    if (typeof str === 'string') {
      for (var i = 0, length = parsers.length; i < length; i++) {
        obj = parsers[i](str, ua_family, os_family);
        if (obj) { return obj; }
      }
    }

    return obj || new Device();
  }

  return parser;
};
