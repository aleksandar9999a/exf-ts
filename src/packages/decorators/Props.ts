export function Props(target: any, key: string): any {
	Object.defineProperty(target, key, {
		set(newValue) {
			if(typeof this.setProps === 'function') {
				this.setProps(key, newValue);
			}
		},
		get() {
			if(typeof this.getProps === 'function') {
				return this.getProps(key);
			}

			return undefined;
		}
	});
}
