import { ExcelMultithreadRunner } from "./automation/excel/excel.multithread-runner";
import { ExcelActionRequest } from "./automation/excel/excel.types";
// import PowerPointActionHandler from "./automation/powerpoint/power-point.action-handler";

export default {
    'excel': ExcelMultithreadRunner,
    // 'powerpoint': PowerPointActionHandler,
};

(async () => {
    // @ts-ignore
    const openFileRequest: ExcelActionRequest = {
        script: 'excel.open',
        processInstanceId: '1032',
        rootProcessInstanceId: '2301',
        userId: 1,
        trigger: {
            name: 'siema',
        },
        input: {
            path: "C:\\Users\\A029616\\Downloads\\Samples\\test.xlsx",
        }
    }

    console.log('Starting runner...')
    const runner = new ExcelMultithreadRunner();
    console.log('running open file request')
    await runner.run(openFileRequest);
    console.log('open file request finished')
    // @ts-ignore
    await runner.run({
        script: 'excel.setCell',
        processInstanceId: '1032',
        rootProcessInstanceId: '2301',
        userId: 1,
        trigger: {
            name: 'siema',
        },
        input: {
            targetCell: 'A1',
            value: 'HELOO',
        }
    });
    // @ts-ignore
    const cellValue = await runner.run({
        script: 'excel.getCell',
        processInstanceId: '1032',
        rootProcessInstanceId: '2301',
        userId: 1,
        trigger: {
            name: 'siema',
        },
        input: {
            targetCell: 'A1'
        }
    });
    console.log('cell value', cellValue)
    // @ts-ignore
    await runner.run({
        script: 'excel.save',
        processInstanceId: '1032',
        rootProcessInstanceId: '2301',
        userId: 1,
        trigger: {
            name: 'siema',
        },
        input: {
            path: "C:\\Users\\A029616\\Downloads\\Samples\\test_result.xlsx",
        }
    });

    console.log('closing runner')
    runner.teardown();
})();