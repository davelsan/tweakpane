import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {ButtonController} from '../../button/controller/button';
import {BladeController} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {LabeledController} from '../../labeled/controller';
import {LabeledPropsObject} from '../../labeled/view';
import {FolderEvents} from '../model/folder';
import {FolderController} from './folder';

function createSomeBladeController(doc: Document): BladeController {
	return new LabeledController(doc, {
		blade: new Blade(),
		props: new ValueMap({
			label: undefined,
		} as LabeledPropsObject),
		valueController: new ButtonController(doc, {
			props: new ValueMap({
				title: 'Foobar',
			}),
			viewProps: createViewProps(),
		}),
	});
}

describe(FolderController.name, () => {
	it('should toggle expanded by clicking title', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			title: 'Push',
			blade: new Blade(),
			viewProps: createViewProps(),
		});

		assert.strictEqual(c.folder.expanded, true);

		c.folder.emitter.on('change', (ev: FolderEvents['change']) => {
			if (ev.propertyName !== 'expanded') {
				return;
			}
			assert.strictEqual(c.folder.expanded, false);
			done();
		});

		c.view.titleElement.click();
	});

	it('should remove list item after disposing child view', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			title: 'Push',
			blade: new Blade(),
			viewProps: createViewProps(),
		});
		const bc = createSomeBladeController(doc);
		c.bladeRack.add(bc);

		assert.strictEqual(c.bladeRack.items.length, 1);
		bc.blade.dispose();
		assert.strictEqual(c.bladeRack.items.length, 0);
	});

	it('should add view element to subfolder', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			title: 'Folder',
			blade: new Blade(),
			viewProps: createViewProps(),
		});

		const sc = new FolderController(doc, {
			title: 'Subfolder',
			blade: new Blade(),
			viewProps: createViewProps(),
		});
		c.bladeRack.add(sc);

		const bc = createSomeBladeController(doc);
		sc.bladeRack.add(bc);
		assert.strictEqual(sc.view.element.contains(bc.view.element), true);
	});

	it('should dispose sub controllers', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			title: '',
			blade: new Blade(),
			viewProps: createViewProps(),
		});

		const bcs = [
			createSomeBladeController(doc),
			createSomeBladeController(doc),
			createSomeBladeController(doc),
		];
		bcs.forEach((bc) => {
			c.bladeRack.add(bc);
		});
		c.blade.dispose();

		bcs.forEach((bc) => {
			assert.strictEqual(bc.blade.disposed, true);
		});
	});

	it('should dispose nested controllers', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			title: '',
			blade: new Blade(),
			viewProps: createViewProps(),
		});
		const sc = new FolderController(doc, {
			title: '',
			blade: new Blade(),
			viewProps: createViewProps(),
		});
		c.bladeRack.add(sc);
		const bc = createSomeBladeController(doc);
		sc.bladeRack.add(bc);

		c.blade.dispose();

		assert.strictEqual(bc.blade.disposed, true);
	});
});
