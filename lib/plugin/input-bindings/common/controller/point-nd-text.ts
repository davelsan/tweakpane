import {Constraint} from '../../../common/constraint/constraint';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {connectValues} from '../../../common/model/value-sync';
import {ViewProps} from '../../../common/view/view';
import {NumberTextController} from '../../number/controller/number-text';
import {PointNdConstraint} from '../constraint/point-nd';
import {PointNdAssembly} from '../model/point-nd';
import {PointNdTextView} from '../view/point-nd-text';

interface Axis {
	baseStep: number;
	draggingScale: number;
	formatter: Formatter<number>;
}

interface Config<PointNd> {
	assembly: PointNdAssembly<PointNd>;
	axes: Axis[];
	parser: Parser<number>;
	value: Value<PointNd>;
	viewProps: ViewProps;
}

function findAxisConstraint<PointNd>(
	config: Config<PointNd>,
	index: number,
): Constraint<number> | undefined {
	const pc = config.value.constraint;
	if (!(pc instanceof PointNdConstraint)) {
		return undefined;
	}
	return pc.components[index];
}

function createAxisController<PointNd>(
	doc: Document,
	config: Config<PointNd>,
	index: number,
): NumberTextController {
	return new NumberTextController(doc, {
		arrayPosition:
			index === 0 ? 'fst' : index === config.axes.length - 1 ? 'lst' : 'mid',
		baseStep: config.axes[index].baseStep,
		formatter: config.axes[index].formatter,
		draggingScale: config.axes[index].draggingScale,
		parser: config.parser,
		value: new Value(0, {
			constraint: findAxisConstraint(config, index),
		}),
		viewProps: config.viewProps,
	});
}

/**
 * @hidden
 */
export class PointNdTextController<PointNd>
	implements ValueController<PointNd> {
	public readonly value: Value<PointNd>;
	public readonly view: PointNdTextView;
	public readonly viewProps: ViewProps;
	private readonly acs_: NumberTextController[];

	constructor(doc: Document, config: Config<PointNd>) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.acs_ = config.axes.map((_, index) =>
			createAxisController(doc, config, index),
		);
		this.acs_.forEach((c, index) => {
			connectValues({
				primary: this.value,
				secondary: c.value,
				forward: (p) => {
					return config.assembly.toComponents(p.rawValue)[index];
				},
				backward: (p, s) => {
					const comps = config.assembly.toComponents(p.rawValue);
					comps[index] = s.rawValue;
					return config.assembly.fromComponents(comps);
				},
			});
		});

		this.view = new PointNdTextView(doc, {
			textViews: this.acs_.map((ac) => ac.view),
		});
	}
}
