import { parentPort } from "worker_threads";
import { ExcelActionRequest } from "./automation/excel/excel.types";
import ExcelActionHandler from "./automation/excel/excel.action-handler";

interface ExcelWorkerParams {
    stringRequest: string;
    shouldExit: boolean;
}

(async () => {
    const handlerInstance = new ExcelActionHandler();

    console.log('[WORKER] start')
    await parentPort.on('message', async ({ stringRequest, shouldExit = false }: ExcelWorkerParams) => {
        if (shouldExit) {
            await handlerInstance.tearDown();
            return;
        }

        if (!stringRequest) {
            throw new Error('No request provided');
        }

        const request: ExcelActionRequest = JSON.parse(stringRequest);
        await handlerInstance
            .run(request)
            .then((result) => parentPort.postMessage(result))
            .catch((error) => parentPort.postMessage(error));
    })
})();