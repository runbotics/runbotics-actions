import { ExcelMultithreadRunner } from "./automation/excel/excel.multithread-runner";
import PowerPointActionHandler from "./automation/powerpoint/power-point.action-handler";

export default {
    'excel': ExcelMultithreadRunner,
    'powerpoint': PowerPointActionHandler,
};