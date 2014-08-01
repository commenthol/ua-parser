'use strict';

var
	startsWithDigit = require('./helpers').startsWithDigit;

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

module.exports = UA;
