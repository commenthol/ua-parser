var assert = require('assert'),
    Engine = require('../lib/engine').Engine,
    makeParser = require('../lib/engine').makeParser;

suite('Engine object', function() {
  test('Engine constructor with no arguments', function() {
    var eng = new Engine();
    assert.strictEqual(eng.family, 'Other');
    assert.strictEqual(eng.major, null);
    assert.strictEqual(eng.minor, null);
    assert.strictEqual(eng.patch, null);
  });

  test('Engine constructor with valid arguments', function() {
    var eng = new Engine('Gecko', '16', '3', 'beta');
    assert.strictEqual(eng.family, 'Gecko');
    assert.strictEqual(eng.major, '16');
    assert.strictEqual(eng.minor, '3');
    assert.strictEqual(eng.patch, 'beta');
  });

  test('Engine#toVersionString with only numerical args', function() {
    assert.strictEqual(new Engine('Firefox', '16', '3', '2').toVersionString(), '16.3.2');
  });

  test('Engine#toVersionString with non numerical patch version', function() {
    assert.strictEqual(new Engine('Firefox', '16', '3', 'beta').toVersionString(), '16.3beta');
  });

  test('Engine#toString for known Engine', function() {
    assert.strictEqual(new Engine('Gecko', '16', '3', '2').toString(), 'Gecko 16.3.2');
  });

  test('Engine#toString for unknown Engine', function() {
    assert.strictEqual(new Engine().toString(), 'Other');
  });
});


suite('Engine parser', function() {
  test('makeParser returns a function', function() {
    assert.equal(typeof makeParser([]), 'function');
  });

  test('Unexpected args don\'t throw', function() {
    var parse = makeParser([]);
    assert.doesNotThrow(function() { parse('Foo'); });
    assert.doesNotThrow(function() { parse(''); });
    assert.doesNotThrow(function() { parse(); });
    assert.doesNotThrow(function() { parse(null); });
    assert.doesNotThrow(function() { parse({}); });
    assert.doesNotThrow(function() { parse(123); });
  });

  test('Parser returns an instance of Engine when unsuccessful at parsing', function() {
    assert.ok(makeParser([])('bar') instanceof Engine);
  });

  test('Parser returns an instance of Engine when sucessful', function() {
    var parse = makeParser([{regex: 'foo'}]);
    assert.ok(parse('foo') instanceof Engine);
  });

  test('Parser correctly identifies Engine name', function() {
    var parse = makeParser([{regex: '(foo)'}]);
    assert.strictEqual(parse('foo').family, 'foo');
  });

  test('Parser correctly identifies version numbers', function() {
    var parse = makeParser([{regex: '(foo) (\\d)\\.(\\d)\\.(\\d)'}]),
        eng = parse('foo 1.2.3');
    assert.strictEqual(eng.family, 'foo');
    assert.strictEqual(eng.major, '1');
    assert.strictEqual(eng.minor, '2');
    assert.strictEqual(eng.patch, '3');
  });

  test('Parser correctly processes replacements', function() {
    var parse = makeParser([{
      regex: '(foo) (\\d)\\.(\\d).(\\d)',
      family_replacement: '$1bar',
      v1_replacement: 'a',
      v2_replacement: 'b',
      v3_replacement: 'c'
    }]);
  
    var eng = parse('foo 1.2.3');
    assert.strictEqual(eng.family, 'foobar');
    assert.strictEqual(eng.major, 'a');
    assert.strictEqual(eng.minor, 'b');
    assert.strictEqual(eng.patch, 'c');
  });

  test('Parser correctly processes multi replacements', function() {
    var parse = makeParser([{
      regex: '(\\d)\\.(\\d).(\\d) (foo)',
      family_replacement: '$4bar',
      v1_replacement: '$1',
      v2_replacement: '$2',
      v3_replacement: '$3'
    }]);
  
    var eng = parse('1.2.3 foo');
    assert.strictEqual(eng.family, 'foobar');
    assert.strictEqual(eng.major, '1');
    assert.strictEqual(eng.minor, '2');
    assert.strictEqual(eng.patch, '3');
  });

});

