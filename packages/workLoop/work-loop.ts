/**
 * Add requestIdleCallback support for browsers who don't support it
 *
 * @param {Function} handler
 *
 * @return {Promise<Function>}
 */
window.requestIdleCallback = window.requestIdleCallback || customRequestIdleCallback;

function customRequestIdleCallback(handler: (obj: object) => void) {
	const startTime = Date.now();

	return setTimeout(() => {
		handler({
			didTimeout: false,
			timeRemaining: () => {
				return Math.max(0, 50.0 - (Date.now() - startTime));
			},
		});
	}, 1);
}

let queue: (() => () => void)[] = [];
let result: any[] = [];
let isProcessWork = false;

/**
 * Push work in queue
 *
 * @param {() => Function}
 *
 * @return {Void}
 */
export function pushWork(work: any) {
	queue = queue.concat(work);

	if (isProcessWork) {
		return;
	}

	processWork();
}

/**
 * Process Work from queue
 *
 * @return {Void}
 */
function processWork() {
	window.requestIdleCallback((deadline) => {
		while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && queue.length > 0) {
			const work = queue[0];
			const part = work();
			result = result.concat(part);
			queue = queue.slice(1);
		}

		if (queue.length > 0) {
			return processWork();
		}

		if (result.length > 0) {
			return commitWork();
		}
	});
}

/**
 * Process work from result
 *
 * @return {Void}
 */
function commitWork() {
	isProcessWork = false;
	requestAnimationFrame(() => {
		result.forEach((part) => part());
		result = [];
	});
}
