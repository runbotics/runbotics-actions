import { DesktopRunRequest } from "@runbotics/runbotics-sdk";
const { Worker } = require('worker_threads');
import { WorkerMessageType } from "./types";
import { MultithreadStateful } from "./MultithreadStateful";

export class MultithreadRunner extends MultithreadStateful {
    private worker = null;

    constructor(handlerPath: string) {
        super();
        this.startWorker(handlerPath);
    }

    async tearDown(): Promise<void> {
        return await this.worker.postMessage({ type: WorkerMessageType.EXIT });
    }

    run(request: DesktopRunRequest<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            const stringRequest = JSON.stringify(request)
            this.worker.postMessage({ type: WorkerMessageType.RUN, stringRequest });
            this.onMessage(resolve, reject);
        });
    }

    private async startWorker(handlerPath) {
        this.worker = new Worker(__dirname + '/multithreading/worker.js', { workerData: { handlerPath } });
    }

    private async onMessage(resolve, reject, callback?: () => void) {
        if (callback) callback();
        this.worker.on('message', (result) => {
            resolve(result);
        });
        this.worker.on('error', (error) => {
            reject(error);
        });
    }
}