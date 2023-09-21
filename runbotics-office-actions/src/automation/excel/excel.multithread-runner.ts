import { MultithreadStatefulRunner } from "@runbotics/runbotics-sdk";
import path from 'path';

const HANDLER_PATH = path.resolve('./dist/automation/excel/excel.action-handler.js');

export class ExcelMultithreadRunner {
    private instance = null;
    constructor() {
        console.log('ExcelMultithreadRunner constructor', HANDLER_PATH)
        // super(HANDLER_PATH);
        this.instance = new MultithreadStatefulRunner(HANDLER_PATH);
    }

    async teardown() {
        await this.instance.tearDown();
    }

    async run(request) {
        const result = await this.instance.run(request);
        return result;
    }
}