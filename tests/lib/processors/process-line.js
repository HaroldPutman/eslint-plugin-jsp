'use strict';

const test = require('tap').test;
const process = require('../../../lib/processors/process-line');
test('processLine', (assert) => {
  const result = process('large');
  assert.deepEqual(result, 'large');
  assert.end();
});

test('process sqString', (assert) => {
  let result = process('This is a \'single quoted\' string', { upperCaseStrings : true });
  assert.deepEqual(result, 'This is a \'SINGLE QUOTED\' string');
  result = process('Escaped \'don\\\'t\' quote', { upperCaseStrings : true });
  assert.deepEqual(result, 'Escaped \'DON\\\'T\' quote');
  result = process('Bad escaped \'success\\', { upperCaseStrings : true });
  assert.deepEqual(result, 'Bad escaped \'SUCCESS\\');
  result = process('Unterminated \'string is OK', { upperCaseStrings : true });
  assert.deepEqual(result, 'Unterminated \'STRING IS OK');
  assert.end();
});

test('process dqString', (assert) => {
  let result = process('This is a "double quoted" string', { upperCaseStrings : true });
  assert.deepEqual(result, 'This is a "DOUBLE QUOTED" string');
  result = process('Escaped "say \\"no\\"" quote', { upperCaseStrings : true });
  assert.deepEqual(result, 'Escaped "SAY \\"NO\\"" quote');
  result = process('Bad escaped "success\\', { upperCaseStrings : true });
  assert.deepEqual(result, 'Bad escaped "SUCCESS\\');
  result = process('Unterminated "string is OK', { upperCaseStrings : true });
  assert.deepEqual(result, 'Unterminated "STRING IS OK');
  assert.end();
});

test('jsp comment', (assert) => {
  let result = process('   <%-- normal comment --%> here');
  assert.deepEqual(result, '   /* - normal comment - */ here');
  result = process('A <%-- comment-with-dashes --%> works');
  assert.deepEqual(result, 'A /* - comment-with-dashes - */ works');
  result = process('<%-- Unterminated comment');
  assert.deepEqual(result, '<%-- Unterminated comment');
  assert.end();
});

test('xml comment', (assert) => {
  let result = process('   <!-- normal comment --> here');
  assert.deepEqual(result, '   /* - normal comment  */ here');
  result = process('A <!-- comment-with-dashes --> works');
  assert.deepEqual(result, 'A /* - comment-with-dashes  */ works');
  result = process('<!-- Unterminated comment');
  assert.deepEqual(result, '<!-- Unterminated comment');
  assert.end();
});

test('xml elements', (assert) => {
  let result = process(' <c:choose> ');
  assert.deepEqual(result, ' /* c:ch */ ');
  result = process('<tag terminated="not"', { upperCaseStrings : true });
  assert.deepEqual(result, '<tag terminated="NOT"');
  result = process('tiny tags: <a> <ab> <abc> <abcd> <abcde>');
  assert.deepEqual(result, 'tiny tags: /**/ /**/ /* */ /*  */ /* a */');
  result = process('<element attr="value" prop/>');
  assert.deepEqual(result, '/* element attr="value" p */');
  result = process('</element>');
  assert.deepEqual(result, '/* /ele */');
  assert.end();
});

test('el expressions', (assert) => {
  let result = process(    'var a = ${expression};');
  assert.deepEqual(result, 'var a = /* express */;');
  result = process(        'var a = ${param[\'mycom.productId\']};');
  assert.deepEqual(result, 'var a = /* param[\'mycom.productI */;');
  result = process(        'var a = ${param["mycom.productId"]};');
  assert.deepEqual(result, 'var a = /* param["mycom.productI */;');
  result = process(        'var a = ${"a" lt "}"};');
  assert.deepEqual(result, 'var a = /* "a" lt  */;');
  result = process(        'var a = ${\'a\' lt \'}\'};');
  assert.deepEqual(result, 'var a = /* \'a\' lt  */;');
  result = process(        'var a = ${a};');
  assert.deepEqual(result, 'var a = /**/;');
  result = process(        'var a = ${ab};');
  assert.deepEqual(result, 'var a = /* */;');
  result = process(        'var a = ${abc};');
  assert.deepEqual(result, 'var a = /*  */;');
  result = process(        'var a = ${abcd};');
  assert.deepEqual(result, 'var a = /* a */;');
  result = process(        'var a = ${syntax["erro};');
  assert.deepEqual(result, 'var a = ${syntax["erro};');
  result = process(        'var a = ${unterminated;');
  assert.deepEqual(result, 'var a = ${unterminated;');
  assert.end();
});

test('real examples', (assert) => {
  let result = process(' var hiddenBreadboxItems = <cqsearch:json attribute="advancedFilterQueries"/> /* jsp-result:{} */;');
  assert.deepEqual(result, ' var hiddenBreadboxItems = /* cqsearch:json attribute="advancedFilterQueri */ /* jsp-result:{} */;');
  result = process('var a =  (b < 3) ? \'a\' : \'>\';');
  assert.deepEqual(result, 'var a =  (b < 3) ? \'a\' : \'>\';');
  result = process('var a = <c f="dolt"/> ; //string in xml is not js string');
  assert.deepEqual(result, 'var a = /* c f="do */ ; //string in xml is not js string');
  result = process('var a="<a></a>"  // don\'t touch xml inside string');
  assert.deepEqual(result, 'var a="<a></a>"  // don\'t touch xml inside string');
  assert.end();
});
