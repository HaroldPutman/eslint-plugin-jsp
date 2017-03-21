'use strict';

const splitLines = require('split-lines');
const _ = require('lodash');
const process = require('./process-line');

const jspResult = /\/\*(?: -)?\s*jsp-result:(.*?)\s*(?:- )?\*\//g;
const beginMarker = /<%--\s*eslint-begin\s*--%>/;
const endMarker = /<%--\s*eslint-end\s*--%>/;

function preprocess(code, filepath) {
  filepath; // unused param
  const lines = splitLines(code);
  let enabled = false;
  lines.forEach(function(line, i, arr) {
    if (endMarker.test(line)) {
      enabled = false;
    }
    if (!enabled) {
      arr[i] = '/* ' + line.substr(0, Math.max(0, line.length - 6)) + ' */';
    } else {
      let acc = process(line);
      acc = acc.replace(jspResult, '$1');
      arr[i] = acc;
    }
    if (beginMarker.test(line)) {
      enabled = true;
    }
  });
  return [lines.join('\n') + '\n'];
}

function postprocess(messages, filename) {
  filename; // unused param
  return _.flatten(messages);
}

module.exports = {
  preprocess,
  postprocess
};
