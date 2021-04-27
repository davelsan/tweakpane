import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {createNumberFormatter, parseNumber} from '../../converter/number';
import {PrimitiveValue} from '../../model/primitive-value';
import {ValueMap} from '../../model/value-map';
import {createViewProps} from '../../model/view-props';
import {NumberTextController} from './number-text';

describe(NumberTextController.name, () => {
	it('should update value with key', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new NumberTextController(doc, {
			baseStep: 1,
			parser: parseNumber,
			props: new ValueMap({
				draggingScale: 1,
				formatter: createNumberFormatter(0),
			}),
			value: new PrimitiveValue(123),
			viewProps: createViewProps(),
		});

		c.view.inputElement.dispatchEvent(
			TestUtil.createKeyboardEvent(win, 'keydown', {
				key: 'ArrowUp',
				shiftKey: true,
			}),
		);
		assert.strictEqual(c.value.rawValue, 123 + 10);
	});

	it('should revert value for invalid input', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new NumberTextController(doc, {
			baseStep: 1,
			parser: parseNumber,
			props: new ValueMap({
				draggingScale: 1,
				formatter: createNumberFormatter(0),
			}),
			value: new PrimitiveValue(123),
			viewProps: createViewProps(),
		});

		const inputElem = c.view.inputElement;
		inputElem.value = 'foobar';
		inputElem.dispatchEvent(TestUtil.createEvent(win, 'change'));
		assert.strictEqual(inputElem.value, '123');
	});
});
