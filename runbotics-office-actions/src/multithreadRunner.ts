import { DesktopRunRequest } from "@runbotics/runbotics-sdk";
const { Worker } = require('worker_threads');
import { Multithread } from "./multithread";

export class MultithreadRunner extends Multithread {
    private worker = null;

    constructor() {
        super();
        this.startWorker();
    }

    async tearDown(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.debug('[MULTITHREAD_RUNNER] tearing down worker');
            this.worker.postMessage({ shouldExit: true });
        });
    }

    run(request: DesktopRunRequest<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            console.debug('[MULTITHREAD_RUNNER] sending request: ', request)
            const stringRequest = JSON.stringify(request)
            this.worker.postMessage({ stringRequest });
            this.onMessage(resolve, reject);
        });
    }

    private async startWorker() {
        console.debug('[MULTITHREAD_RUNNER] start');
        this.worker = new Worker(__dirname + '/worker.js');
        console.debug('[MULTITHREAD_RUNNER] created worker');
    }

    private async onMessage(resolve, reject, callback?: () => void) {
        if (callback) callback();
        this.worker.on('message', (result) => {
            resolve(result);
        });
        this.worker.on('error', (error) => {
            console.error('got error: ', error);
            reject(error);
        });
    }
}