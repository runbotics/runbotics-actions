import { MultithreadStatefulRunner } from "@runbotics/runbotics-sdk";

const HANDLER_PATH = '@runbotics/runbotics-actions/dist/excel.action-handler';

export class ExcelMultithreadRunner extends MultithreadStatefulRunner {
    constructor() {
        super(HANDLER_PATH);
    }
}