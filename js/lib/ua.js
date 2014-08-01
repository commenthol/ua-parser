'use strict';

var startsWithDigit = require('./helpers').startsWithDigit;
var replaceMatches = require('./replacematches');

exports.UA = UA;

function UA(family, major, minor, patch, patchMinor, type) {
  this.family = family || 'Other';
  this.major = major || null;
  this.minor = minor || null;
  this.patch = patch || null;
  if (typeof patchMinor !== 'undefined') { this.patchMinor = patchMinor || null; }
  if (typeof type !== 'undefined') { this.type = type || null; }
}

UA.prototype.toVersionString = function() {
  var output = '';
  if (this.major !== null) {
    output += this.major;
    if (this.minor !== null) {
      output += '.' + this.minor;
      if (this.patch !== null) {
        if (startsWithDigit(this.patch)) { output += '.'; }
        output += this.patch;
        if (this.patchMinor !== null && this.patchMinor !== undefined) {
          if (startsWithDigit(this.patchMinor)) { output += '.'; }
          output += this.patchMinor;
        }
      }
    }
  }
  return output;
};

UA.prototype.toString = function() {
  var suffix = this.toVersionString();
  if (suffix) { suffix = ' ' + suffix; }
  return this.family + suffix;
};

function _makeParsers(obj, options) {
  var regexp        = new RegExp(obj.regex),
      familyPrefix  = options.prefix || 'family',
      versionPrefix = (options.prefix ? options.prefix + '_' : ''),
      famRep        = obj[familyPrefix + '_replacement'],
      majorRep      = obj[versionPrefix + 'v1_replacement'],
      minorRep      = obj[versionPrefix + 'v2_replacement'],
      patchRep      = obj[versionPrefix + 'v3_replacement'],
      patchMinorRep = obj[versionPrefix + 'v4_replacement'],
      typeRep       = obj[versionPrefix + 'type_replacement'];

  function parser(str) {
    var m = str.match(regexp);
    if (!m) { return null; }

    var family = famRep  ? replaceMatches(famRep, m)   : m[1],
        major = majorRep ? replaceMatches(majorRep, m) : m[2],
        minor = minorRep ? replaceMatches(minorRep, m) : m[3],
        patch = patchRep ? replaceMatches(patchRep, m) : m[4],
        patchMinor;

    if (options.usePatchMinor) {
      patchMinor = (patchMinorRep ? replaceMatches(patchMinorRep, m) : m[5]) || null;
    }
    return new UA(family, major, minor, patch, patchMinor, typeRep);
  }

  return parser;
}

exports.makeParser = function(regexes, options) {
  options = options || {};
  
  var parsers = (regexes||[]).map(function(obj) {
    return _makeParsers(obj, options);
  }); 

  function parser(str) {
    var obj;

    if (typeof str === 'string') {
      for (var i = 0, length = parsers.length; i < length; i++) {
        obj = parsers[i](str);
        if (obj) { return obj; }
      }
    }

    obj = obj || new UA();
    if (options.usePatchMinor) {
      obj.patchMinor = obj.patchMinor || null;
    }
    return obj;
  }

  return parser;
};
