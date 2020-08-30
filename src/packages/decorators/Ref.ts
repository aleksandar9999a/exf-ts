export function Ref({ id }: { id: string }): any {
	return function (target: any, key: string) {
		Object.defineProperty(target, key, {
			get() {
				if(typeof this.root.getElementById === 'function') {
					return this.root.getElementById(id);
				}

				return;
			}
		});
	}
}
