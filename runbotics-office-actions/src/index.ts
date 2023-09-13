import { ExcelMultithreadRunner } from "./automation/excel/excelMultithreadRunner";
import PowerPointActionHandler from "./automation/powerpoint/power-point.action-handler";

export default {
    'excel': ExcelMultithreadRunner,
    'powerpoint': PowerPointActionHandler,
};