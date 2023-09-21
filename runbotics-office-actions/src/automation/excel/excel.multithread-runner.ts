import { MultithreadStatefulRunner } from "@runbotics/runbotics-sdk";
import path from 'path';

const HANDLER_PATH = path.resolve('./dist/automation/excel/excel.action-handler.js');

export class ExcelMultithreadRunner extends MultithreadStatefulRunner {
    constructor() {
        console.log('ExcelMultithreadRunner constructor', HANDLER_PATH)
        super(HANDLER_PATH);
    }
}