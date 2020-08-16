import { IWorkLoop } from "../interfaces/interfaces";

window.requestIdleCallback = window.requestIdleCallback || function (handler) {
    const startTime = Date.now();

    return setTimeout(() => {
        handler({
            didTimeout: false,
            timeRemaining: () => {
                return Math.max(0, 50.0 - (Date.now() - startTime));
            }
        });
    }, 1);
}

export class WorkLoop implements IWorkLoop {
    private isWorking = false;
    private queue: Function[] = [];
    private result: Function[] = [];

    pushWork(work: Function) {
        this.queue = this.queue.concat(work);

        if (this.isWorking) { 
            return; 
        }

        this.isWorking = true;
        this.processWork();
    }

    private processWork() {
        window.requestIdleCallback((deadline) => {
            while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && this.queue.length > 0) {
                const work = this.queue[0];
                const part = work();
                this.result = this.result.concat(part);
                this.queue = this.queue.slice(1);
            }

            if (this.queue.length > 0) { 
                this.processWork();
            }

            if (this.result.length > 0) { 
                this.commitWork(); 
            }
        })
    }

    private commitWork() {
        requestAnimationFrame(() => {
            this.isWorking = false;
            this.result.forEach(part => part());
            this.result = [];
        });
    }
}