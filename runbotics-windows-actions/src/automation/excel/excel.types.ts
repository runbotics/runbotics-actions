import { DesktopRunRequest } from "@runbotics/runbotics-sdk";

export type ExcelActionRequest =
    | DesktopRunRequest<"excel.open", ExcelOpenActionInput>
    | DesktopRunRequest<"excel.getCell", ExcelGetCellActionInput>
    | DesktopRunRequest<"excel.getCells", ExcelGetCellsActionInput>
    | DesktopRunRequest<"excel.close">
    | DesktopRunRequest<"excel.save">
    | DesktopRunRequest<"excel.setCell", ExcelSetCellActionInput>
    | DesktopRunRequest<"excel.setCells", ExcelSetCellsActionInput>
    | DesktopRunRequest<"excel.findFirstEmptyRow", ExcelFindFirstEmptyRowActionInput>
    | DesktopRunRequest<"excel.clearCells", ExcelClearCellsActionInput>
    | DesktopRunRequest<"excel.deleteColumns", ExcelDeleteColumnsActionInput>;

export interface ExcelOpenActionInput {
    path: string;
    worksheet?: string;
    mode?: "xlReadOnly" | "xlReadWrite";
};

export interface ExcelGetCellActionInput {
    row: number;
    column: string;
    worksheet?: string;
};

export type ExcelGetCellsActionInput = {
    startColumn?: string;
    startRow?: string;
    endColumn: string;
    endRow: string;
    worksheet?: string;
};

export interface ExcelSaveActionInput {
    fileName: string;
}

export interface ExcelSetCellActionInput {
    row: number;
    column: string;
    value: unknown;
    worksheet?: string;
};

export interface ExcelSetCellsActionInput {
    cellValues: ExcelArrayStructure;
    startColumn?: string;
    startRow?: string;
    worksheet?: string;
};

export interface ExcelFindFirstEmptyRowActionInput {
    startColumn?: string;
    startRow?: string;
    worksheet?: string;
}

export interface StartCellCoordinates {
    startColumn: number;
    startRow: number;
}

export interface ExcelDeleteColumnsActionInput {
    columnRange: string;
    worksheet?: string;
};

export interface GetCellCoordinatesParams {
    startColumn?: number | string;
    startRow?: number;
    endColumn?: number | string;
    endRow?: number;
}

export interface CellCoordinates {
    startColumn?: number;
    startRow?: number;
    endColumn?: number;
    endRow?: number;
}

export interface ExcelClearCellsActionInput {
    targetCells: string[] | string;
    worksheet?: string;
};

export type ExcelArrayStructure = unknown[][]