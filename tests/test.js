'use strict';

const test = require('tap').test;
const CLIEngine = require('eslint').CLIEngine;
const fs = require('fs');
const path = require('path');
const plugin = require('..');

function fixture(name) {
  return fs.readFileSync(path.join(__dirname, `./fixtures/${name}`), 'utf8');
}

function createCliEngine() {
  const cli = new CLIEngine({
    extensions: ['*'],
    useEslintrc: false,
    rules: {
      quotes: [2, 'single'],
      indent: [2],
    },
  });
  cli.addPlugin('jsp', plugin);
  return cli;
}

test('jsp', (assert) => {
  const code = fixture('test.jsp');
  const cli = createCliEngine();
  const report = cli.executeOnText(code, 'test.jsp');
  const messages = report.results[0].messages;
  assert.deepEqual(messages[0].ruleId, 'indent');
  assert.deepEqual(messages[0].line, 6);
  assert.deepEqual(messages[0].column, 5);
  assert.deepEqual(messages[1].ruleId, 'quotes');
  assert.deepEqual(messages[1].line, 6);
  assert.deepEqual(messages[1].column, 13);
  assert.end();
});


test('features', (assert) => {
  const code = fixture('features.jsp');
  const cli = createCliEngine();
  const report = cli.executeOnText(code, 'features.jsp');
  assert.equal(report.results[0].errorCount, 0);
  assert.equal(report.results[0].warningCount, 0);
  assert.deepEqual(report.results[0].messages, []);
  assert.end();
});
