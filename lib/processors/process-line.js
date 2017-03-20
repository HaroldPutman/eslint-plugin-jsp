'use strict';

module.exports = function (inbuf, opt) {
  let outbuf = '';
  let index = 0;
  let c;
  const options = {
    upperCaseStrings: false
  };

  if (typeof options !== 'undefined') {
    Object.assign(options, opt);
  }

  /**
   * Get the next character from input
   */
  function nextch() {
    c = inbuf.charAt(index++);
    return !!c;
  }

  /**
   * Add a character to the output buffer
   */
  function append(ch) {
    if (ch) {
      outbuf += ch;
    }
  }

  /**
   * Check if the input matches pattern starting at the current position.
   */
  function lookahead(searchString) {
    return inbuf.startsWith(searchString, index);
  }

  /**
   * Process single quoted string. Turns string to upper case for
   * testing purposes.
   */
  function sqString() {
    append(c);
    while(nextch()) {
      if (c == '\'') {
        return true;
      }
      if (c == '\\') {
        append(c);
        nextch();
      }
      append(options.upperCaseStrings ? c.toUpperCase() : c);
    }
    return false;
  }

  /**
   * Process double quoted string. Turns string to upper case for
   * testing purposes.
   */
  function dqString() {
    append(c);
    while(nextch()) {
      if (c == '"') {
        return true;
      }
      if (c == '\\') {
        append(c);
        nextch();
      }
      append(options.upperCaseStrings ? c.toUpperCase() : c);
    }
    return false;
  }

  function jspComment() {
    const restorePoint = index;
    let tempbuf = '/* -';
    nextch(); nextch(); nextch();
    while(nextch()) {
      if (c == '-' && lookahead('-%>')) {
        tempbuf += '- */';
        nextch(); nextch(); nextch(); nextch();
        append(tempbuf);
        return true;
      }
      tempbuf += c;
    }
    // unterminated comment, put everything back
    append('<');
    index = restorePoint;
    return false;
  }

  function xmlComment() {
    const restorePoint = index;
    let tempbuf = '/* -';
    nextch(); nextch(); nextch();
    while(nextch()) {
      if (c == '-' && lookahead('->')) {
        tempbuf += ' */';
        nextch(); nextch(); nextch();
        append(tempbuf);
        return true;
      }
      tempbuf += c;
    }
    // unterminated comment, put everything back
    append('<');
    index = restorePoint;
    return false;
  }

  /**
   * Process an XML element
   */
  function jspElement() {
    // matches xml element
    const expected = /^<(\/?(\w+:)?\w+)(\s+(\w+:)?\w+(=("[^"]*"|'[^']*'))?)*\s*\/?>/;
    const match = expected.exec(inbuf.substr(index - 1));
    if (match) {
      if (match[0].length < 5) {
        append('/**/');
      } else if (match[0].length < 6) {
        append('/* */');
      } else {
        append('/* ');
        append(match[0].substr(1, match[0].length - 6));
        append(' */');
      }
      index += match[0].length - 1;
      nextch();
      return true;
    }
    // didn't match
    return false;
  }

  function elExpression() {
    const restorePoint = index;
    let tempbuf = '/* ';
    let inString = false;
    nextch(); // '{'
    while(nextch()) {
      if (c == '\'' || c == '\"') {
        if (c == inString) {
          inString = false;
        } else {
          inString = c;
        }
      }
      if (c == '}' && !inString) {
        nextch();
        if (tempbuf.length == 4) {
          append('/**/');
        } else {
          append(tempbuf.substr(0, Math.max(2, tempbuf.length - 3)));
          append(' */');
        }
        return true;
      }
      tempbuf += c;
    }
    append('$');
    index = restorePoint;
    return false;
  }

  while (nextch()) {
    if (c == '\'') {
      sqString();
    }
    if (c == '"') {
      dqString();
    }
    if (c == '$' && lookahead('{')) {
      elExpression();
    }
    if (c == '<') {
      if (lookahead('%--')) {
        jspComment();
      } else if (lookahead('!--')) {
        xmlComment();
      } else {
        jspElement();
      }
    }
    append(c);
  }
  return outbuf;
};
