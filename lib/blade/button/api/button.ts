import {forceCast} from '../../../misc/type-util';
import {BladeApi, LabelableApi} from '../../common/api/blade';
import {LabeledController} from '../../labeled/controller';
import {ButtonController} from '../controller/button';

interface ButtonApiEventHandlers {
	click: () => void;
}

export class ButtonApi implements BladeApi, LabelableApi {
	/**
	 * @hidden
	 */
	public readonly controller_: LabeledController<ButtonController>;

	/**
	 * @hidden
	 */
	constructor(buttonController: LabeledController<ButtonController>) {
		this.controller_ = buttonController;
	}

	get disabled(): boolean {
		return this.controller_.viewProps.get('disabled');
	}

	set disabled(disabled: boolean) {
		this.controller_.viewProps.set('disabled', disabled);
	}

	get hidden(): boolean {
		return this.controller_.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller_.viewProps.set('hidden', hidden);
	}

	get label(): string | undefined {
		return this.controller_.props.get('label');
	}

	set label(label: string | undefined) {
		this.controller_.props.set('label', label);
	}

	get title(): string {
		return this.controller_.valueController.props.get('title');
	}

	set title(title: string) {
		this.controller_.valueController.props.set('title', title);
	}

	public dispose(): void {
		this.controller_.blade.dispose();
	}

	public on<EventName extends keyof ButtonApiEventHandlers>(
		eventName: EventName,
		handler: ButtonApiEventHandlers[EventName],
	): ButtonApi {
		const emitter = this.controller_.valueController.emitter;
		// TODO: Type-safe
		emitter.on(eventName, forceCast(handler.bind(this)));
		return this;
	}
}
