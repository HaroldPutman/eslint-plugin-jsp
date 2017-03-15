/**
 * @fileoverview Process javascript in JSP files
 * @author Harold Putman
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


const jspProcessor = require('./processors/jsp');

// import processors
module.exports.processors = {
    '.jsp': jspProcessor,
};
