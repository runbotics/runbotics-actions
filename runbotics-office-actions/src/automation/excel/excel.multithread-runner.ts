import { ActionHandler, DesktopRunRequest, MultithreadStateful, MultithreadRunner } from "@runbotics/runbotics-sdk";

export class ExcelMultithreadRunner extends MultithreadStateful {
    private handlerPath = '@runbotics/runbotics-actions/dist/automation/excel/excel.action-handler';
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