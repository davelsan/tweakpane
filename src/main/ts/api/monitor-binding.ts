import {forceCast} from '../misc/type-util';
import {MonitorBindingController} from '../plugin/common/controller/monitor-binding';
import {ComponentApi} from './component-api';
import * as EventHandlerAdapters from './event-handler-adapters';

interface MonitorBindingApiEventHandlers<T> {
	update: (value: T) => void;
}

/**
 * The API for the monitor binding between the parameter and the pane.
 */
export class MonitorBindingApi<T> implements ComponentApi {
	/**
	 * @hidden
	 */
	public readonly controller: MonitorBindingController<T>;

	/**
	 * @hidden
	 */
	constructor(bindingController: MonitorBindingController<T>) {
		this.controller = bindingController;
	}

	get hidden(): boolean {
		return this.controller.viewModel.hidden;
	}

	set hidden(hidden: boolean) {
		this.controller.viewModel.hidden = hidden;
	}

	public dispose(): void {
		this.controller.viewModel.dispose();
	}

	public on<EventName extends keyof MonitorBindingApiEventHandlers<T>>(
		eventName: EventName,
		handler: MonitorBindingApiEventHandlers<T>[EventName],
	): MonitorBindingApi<T> {
		EventHandlerAdapters.monitor({
			binding: this.controller.binding,
			eventName: eventName,
			// TODO: Type-safe
			handler: forceCast(handler.bind(this)),
		});
		return this;
	}

	public refresh(): void {
		this.controller.binding.read();
	}
}
