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

let isWorking = false;
let queue: (() => () => void)[] = [];
let result: any[] = [];

/**
 * Push work in queue
 *
 * @param {() => Function}
 *
 * @return {Void}
 */
export function pushWork(work: any) {
	queue = queue.concat(work);

	if (isWorking) {
		return;
	}

	isWorking = true;
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
			processWork();
		}

		if (result.length > 0) {
			commitWork();
			isWorking = false;
		}
	});
}

/**
 * Process work from result
 *
 * @return {Void}
 */
function commitWork() {
	requestAnimationFrame(() => {
		isWorking = false;
		result.forEach((part) => part());
		result = [];
	});
}
