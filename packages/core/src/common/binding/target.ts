import {TpError} from '../tp-error.js';

export type Bindable = Record<string, any>;

/**
 * A binding target.
 */
export class BindingTarget<
	T extends Bindable = Bindable,
	K extends keyof T = keyof T,
> {
	/**
	 * The property name of the binding.
	 */
	public readonly key: K;
	private readonly obj_: T;

	/**
	 * @hidden
	 */
	constructor(obj: T, key: K) {
		this.obj_ = obj;
		this.key = key;
	}

	public static isBindable(obj: unknown): obj is Bindable {
		if (obj === null) {
			return false;
		}
		if (typeof obj !== 'object' && typeof obj !== 'function') {
			return false;
		}
		return true;
	}

	/**
	 * Read a bound value.
	 * @return A bound value
	 */
	public read(): T[K] {
		return this.obj_[this.key];
	}

	/**
	 * Write a value.
	 * @param value The value to write to the target.
	 */
	public write(value: T[K]): void {
		this.obj_[this.key] = value;
	}

	/**
	 * Write a value to the target property.
	 * @param name The property name.
	 * @param value The value to write to the target.
	 */
	public writeProperty(name: K, value: T[K]): void {
		const valueObj = this.read();

		if (!BindingTarget.isBindable(valueObj)) {
			throw TpError.notBindable();
		}
		if (!(name in valueObj)) {
			throw TpError.propertyNotFound(name as string);
		}
		valueObj[name] = value;
	}
}
