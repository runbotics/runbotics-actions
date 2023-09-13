import { ActionHandler, DesktopRunRequest } from "@runbotics/runbotics-sdk";
import { MultithreadRunner } from "../../multithreading/multithreadRunner";
import { MultithreadStateful } from "../../multithreading/MultithreadStateful";

export class ExcelMultithreadRunner extends MultithreadStateful {
    private handlerPath = '../automation/excel/excel.action-handler';
    private workerInstance = null;

    constructor() {
        super();
        this.workerInstance = new MultithreadRunner(this.handlerPath);
    }

    async tearDown(): Promise<void> {
        return await this.workerInstance.tearDown();
    }

    getType(): string {
        return ActionHandler.StatefulMultithreaded;
    }

    run(request: DesktopRunRequest<string, any>): Promise<any> {
        return this.workerInstance.run(request);
    }
}