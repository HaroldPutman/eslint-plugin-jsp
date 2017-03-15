'use strict';

const splitLines = require('split-lines');
const _ = require('lodash');

const beginMarker = /<%--\s*eslint-begin\s*--%>/;
const endMarker = /<%--\s*eslint-end\s*--%>/;

function preprocess(code, filepath) {
  const lines = splitLines(code);
  let enabled = false;
  lines.forEach(function(line, i, arr) {
    if (endMarker.test(line)) {
      enabled = false;
    }
    if (!enabled) {
      arr[i] = '/**/';
    }
    if (beginMarker.test(line)) {
      enabled = true;
    }
  });
  return [lines.join('\n') + '\n'];
}

function postprocess(messages, filename) {
  return _.flatten(messages);
}

module.exports = {
  preprocess,
  postprocess
};
