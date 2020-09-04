/**
 * Add requestIdleCallback support for browsers who don't support it
 *
 * @param {Function} handler
 *
 * @return {Promise<Function>}
 */
window.requestIdleCallback = window.requestIdleCallback || customRequestIdleCallback;
function customRequestIdleCallback(handler) {
    var startTime = Date.now();
    return setTimeout(function () {
        handler({
            didTimeout: false,
            timeRemaining: function () {
                return Math.max(0, 50.0 - (Date.now() - startTime));
            },
        });
    }, 1);
}
var isWorking = false;
var queue = [];
var result = [];
/**
 * Push work in queue
 *
 * @param {() => Function}
 *
 * @return {Void}
 */
export function pushWork(work) {
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
    window.requestIdleCallback(function (deadline) {
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && queue.length > 0) {
            var work = queue[0];
            var part = work();
            result = result.concat(part);
            queue = queue.slice(1);
        }
        if (queue.length > 0) {
            processWork();
        }
        if (result.length > 0) {
            commitWork();
        }
    });
}
/**
 * Process work from result
 *
 * @return {Void}
 */
function commitWork() {
    requestAnimationFrame(function () {
        isWorking = false;
        result.forEach(function (part) { return part(); });
        result = [];
    });
}
//# sourceMappingURL=work-loop.js.map