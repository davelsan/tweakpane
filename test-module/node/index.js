'use strict';

const Jsdom = require('jsdom').JSDOM;
// Require default module
const {Pane} = require('tweakpane');

const Package = require('../../package.json');

// Check version
if (Pane.version.toString() !== Package.version) {
	throw new Error('invalid version');
}

const PARAMS = {
	foo: 1,
};

// Create pane
const doc = new Jsdom('').window.document;
const pane = new Pane({
	document: doc,
});

// Add input
const input = pane.addInput(PARAMS, 'foo', {
	max: 1,
	min: 0,
	step: 1,
});
console.log(input);
