import {isEmpty} from '../misc/type-util';
import {InputBindingController} from '../plugin/blade/common/controller/input-binding';
import {BindingTarget} from '../plugin/common/binding/target';
import {PaneError} from '../plugin/common/pane-error';
import {createController} from '../plugin/input-binding';
import {Plugins} from './plugins';
import {InputParams} from './types';

/**
 * @hidden
 */
export function createInputBindingController(
	document: Document,
	target: BindingTarget,
	params: InputParams,
): InputBindingController<unknown> {
	const initialValue = target.read();

	if (isEmpty(initialValue)) {
		throw new PaneError({
			context: {
				key: target.key,
			},
			type: 'emptyvalue',
		});
	}

	const bc = Plugins.inputs.reduce(
		(result: InputBindingController<unknown> | null, plugin) =>
			result ||
			createController(plugin, {
				document: document,
				target: target,
				params: params,
			}),
		null,
	);
	if (bc) {
		return bc;
	}

	throw new PaneError({
		context: {
			key: target.key,
		},
		type: 'nomatchingcontroller',
	});
}
