// import ExcelActionHandler from "./automation/excel/excel.action-handler";
import PowerPointActionHandler from "./automation/powerpoint/power-point.action-handler";
// import { ExcelActionRequest } from "./automation/excel/excel.types";
import { MultithreadRunner } from "./multithreadRunner";

export default {
    'excel': MultithreadRunner,
    'powerpoint': PowerPointActionHandler,
};

// (async () => {
//     const logger = new Logger('PARENT');
//     const requestOpen: ExcelActionRequest = {
//         script: 'excel.open',
//         input: {
//             path: 'C:/Users/A029616/Downloads/Samples/excel_readonly_test.xlsx',
//             worksheet: 'Sheet2',
//         },
//         processInstanceId: '123',
//         rootProcessInstanceId: '123',
//         userId: 1,
//         executionContext: {
//             name: 'executionContextName',
//         },
//         trigger: {
//             name: 'triggerName',
//         },
//     };
//     const requestGetCells: ExcelActionRequest = {
//         script: 'excel.getCells',
//         input: {
//             startCell: 'A1',
//             endCell: 'H12',
//             worksheet: 'Sheet2',
//         },
//         processInstanceId: '123',
//         rootProcessInstanceId: '123',
//         userId: 1,
//         executionContext: {
//             name: 'executionContextName',
//         },
//         trigger: {
//             name: 'triggerName',
//         },
//     }
//     const requestGetCell: ExcelActionRequest = {
//         script: 'excel.getCell',
//         input: {
//             targetCell: 'A1',
//             worksheet: 'Sheet2',
//         },
//         processInstanceId: '123',
//         rootProcessInstanceId: '123',
//         userId: 1,
//         executionContext: {
//             name: 'executionContextName',
//         },
//         trigger: {
//             name: 'triggerName',
//         },
//     }
//     logger.log('starting broker: ');
//     const broker = new MultithreadRunner();
//     const openResult = await broker.run(requestOpen);
//     const cell = await broker.run(requestGetCell);
//     const cells = await broker.run(requestGetCells);
//     logger.log('continuing app execution');
//     logger.log('openResult: ', openResult);
//     logger.log('cell result: ', cell);
//     logger.log('cells result: ', cells);
// })();