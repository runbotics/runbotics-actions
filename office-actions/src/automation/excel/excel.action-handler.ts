import { StatefulActionHandler } from '@runbotics/runbotics-sdk';
import XLSX from 'xlsx';
import {
    ExcelActionRequest,
    ExcelGetCellActionInput,
    ExcelOpenActionInput,
    ExcelSaveActionInput,
    ExcelSetCellActionInput,
    ExcelSetCellsActionInput,
    ExcelFindFirstEmptyRowActionInput,
    CellCoordinates,
    ExcelGetCellsActionInput,
    ExcelClearCellsActionInput,
    ExcelDeleteColumnsActionInput,
    ExcelCreateWorksheetActionInput,
    ExcelCreateWorksheetActionOutput,
    ExcelRenameWorksheetActionInput,
    ExcelSetActiveWorksheetActionInput,
    ExcelInsertColumnsActionInput,
    ExcelRunMacroInput,
    ExcelDeleteWorksheetActionInput,
    ExcelWorksheetExistActionInput,
    ExcelInsertRowsActionInput,
    ExcelDeleteRowsActionInput,
    RegexPatterns,
    ExcelReadTableActionInput,
    ExcelCellValue,
    ExcelExportToCsvActionInput,
    ExcelExportHtmlTableActionInput,
} from './excel.types';
import ExcelErrorMessage from './excelErrorMessage';
import { existsSync } from 'fs';

export default class ExcelActionHandler extends StatefulActionHandler {
    private session = null;

    constructor() {
        super();
    }

    async open(input: ExcelOpenActionInput): Promise<void> {
        const winax = await import('@runbotics/winax');
        this.session = new winax.Object('Excel.Application', {
            activate: true,
        });
        this.session.Workbooks.Open(input.path);
        this.session.Visible = true;
        this.session.Application.DisplayAlerts = false;
        if (input.worksheet) {
            this.checkIsWorksheetNameCorrect(input.worksheet, true);
            this.session.Worksheets(input.worksheet).Activate();
        }

        // if (input.mode) {
        //     excel.ActiveWorkbook.ChangeFileAccess(input.mode);
        // }
    }

    /**
     * @description Closes Excel application ignoring unsaved changes
     */
    async close(): Promise<void> {
        this.session?.Quit();

        this.session = null;
    }

    async save(input: ExcelSaveActionInput) {
        if (input.fileName) {
            this.session.ActiveWorkbook.SaveAs(input.fileName);
        } else {
            this.session.ActiveWorkbook.Save();
        }
    }

    async getCell(input: ExcelGetCellActionInput): Promise<unknown> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        return this.session
            .Worksheets(input.worksheet ?? this.session.ActiveSheet.Name)
            .Range(input.targetCell)
            .Value();
    }

    async getCells(input: ExcelGetCellsActionInput): Promise<unknown[][]> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        try {
            const cellValues: ExcelCellValue[][] = [];
            const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
            const { column: startColumn, row: startRow } = this.getDividedCellCoordinates(input.startCell);
            const { column: endColumn, row: endRow } = this.getDividedCellCoordinates(input.endCell);

            for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
                const rowValues: ExcelCellValue[] = [];
                for (let columnIdx = startColumn; columnIdx <= endColumn; columnIdx++) {
                    rowValues.push(targetWorksheet.Cells(rowIdx, columnIdx).Value() ?? '');
                }
                cellValues.push(rowValues);
            }

            return cellValues;
        } catch (e) {
            throw new Error(ExcelErrorMessage.getCellsIncorrectInput());
        }
    }

    async setCell(input: ExcelSetCellActionInput): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        try {
            const cell = this.session
                .Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name)
                .Range(input.targetCell);

            cell.Value = input.value;
        } catch (e) {
            throw new Error(ExcelErrorMessage.setCellIncorrectInput());
        }
    }

    async setCells(input: ExcelSetCellsActionInput): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const cellValues = this.parseExcelStructureArray(input.cellValues, ExcelErrorMessage.setCellsIncorrectInput());
        const { row: startRow, column: startColumn } = this.getDividedCellCoordinates(input.startCell);
        let columnCounter = startColumn,
            rowCounter = startRow;
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
        for (const rowValues of cellValues) {
            for (const cellValue of rowValues) {
                try {
                    if (cellValue !== '') targetWorksheet.Cells(rowCounter, columnCounter).Value = cellValue ?? '';
                    columnCounter++;
                } catch (e) {
                    throw new Error(ExcelErrorMessage.setCellsIncorrectInput());
                }
            }
            rowCounter++;
            columnCounter = startColumn;
        }
    }

    async findFirstEmptyRow(input: ExcelFindFirstEmptyRowActionInput): Promise<number> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const { column: startColumn, row: startRow } = this.getDividedCellCoordinates(input.startCell);
        let rowCounter = startRow;
        while (
            this.session
                .Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name)
                .Cells(rowCounter, startColumn)
                .Value()
        )
            rowCounter++;
        return rowCounter;
    }

    async deleteColumns(input: ExcelDeleteColumnsActionInput): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const columnRange = this.parseOneDimensionalArray(input.columnRange);
        try {
            const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
            if (!Array.isArray(columnRange)) targetWorksheet.Columns(columnRange).Delete();
            else {
                const sortedColumns = this.sortColumns(columnRange);
                sortedColumns.forEach((column, idx) => {
                    const columnCoordinate = this.getColumnCoordinate(column);
                    targetWorksheet.Columns(columnCoordinate - idx).Delete();
                });
            }
        } catch (e) {
            throw new Error(ExcelErrorMessage.deleteColumnsIncorrectInput());
        }
    }

    async createWorksheet(input: ExcelCreateWorksheetActionInput): Promise<ExcelCreateWorksheetActionOutput> {
        const worksheets = this.session.Worksheets;
        const worksheetsCount = worksheets.Count;
        let worksheet: string;

        if (input?.name) {
            this.checkIsWorksheetNameCorrect(input.name, false);
            worksheet = this.session.Worksheets.Add(null, this.session.Worksheets(worksheetsCount)).Name = input.name;
        } else {
            worksheet = this.session.Worksheets.Add(null, this.session.Worksheets(worksheetsCount)).Name;
        }

        return worksheet;
    }

    async renameWorksheet(input: ExcelRenameWorksheetActionInput): Promise<void> {
        this.checkIsWorksheetNameCorrect(input.newName, false);

        if (input?.worksheet) {
            this.checkIsWorksheetNameCorrect(input.worksheet, true);
            this.session.Worksheets(input.worksheet).Name = input.newName;
        } else {
            this.session.ActiveSheet.Name = input.newName;
        }
    }

    async setActiveWorksheet(input: ExcelSetActiveWorksheetActionInput): Promise<void> {
        if (input.worksheet === this.session.ActiveSheet.Name) return;

        this.checkIsWorksheetNameCorrect(input.worksheet, true);
        this.session.Worksheets(input.worksheet).Activate();
    }

    async insertColumnsBefore(input: ExcelInsertColumnsActionInput): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);

        try {
            const column = this.getColumnCoordinate(input.column);
            const amount = input.amount;
            if (this.isNegativeInteger(amount)) throw new Error();

            targetWorksheet
                .Range(targetWorksheet.Columns(column), targetWorksheet.Columns(column + amount - 1))
                .Insert();
        } catch (e) {
            throw new Error(ExcelErrorMessage.insertColumnsIncorrectInput());
        }
    }

    async insertColumnsAfter(input: ExcelInsertColumnsActionInput): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);

        try {
            const column = this.getColumnCoordinate(input.column);
            const amount = input.amount;
            if (this.isNegativeInteger(amount)) throw new Error();

            targetWorksheet
                .Range(targetWorksheet.Columns(column + 1), targetWorksheet.Columns(column + amount))
                .Insert();
        } catch (e) {
            throw new Error(ExcelErrorMessage.insertColumnsIncorrectInput());
        }
    }

    async insertRowsBefore(input: ExcelInsertRowsActionInput): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
        const startingRow = input.startingRow;
        const rowsNumber = input.rowsNumber;

        if (this.isNegativeInteger(startingRow) || this.isNegativeInteger(rowsNumber)) {
            throw new Error(ExcelErrorMessage.insertRowsIncorrectInput());
        }

        try {
            targetWorksheet
                .Range(targetWorksheet.Rows(startingRow), targetWorksheet.Rows(startingRow + rowsNumber - 1))
                .Insert();
        } catch (e) {
            throw new Error(ExcelErrorMessage.insertRowsIncorrectInput());
        }
    }

    async deleteRows(input: ExcelDeleteRowsActionInput): Promise<void> {
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);

        if (input.rowRange.match(/\d+:\d+/g)) return targetWorksheet.Rows(input.rowRange).Delete();

        try {
            const rows = JSON.parse(input.rowRange);

            if (!Array.isArray(rows)) return targetWorksheet.Rows(rows).Delete();
            rows.sort().forEach((row, idx) => {
                targetWorksheet.Rows(row - idx).Delete();
            });
        } catch (e) {
            throw new Error(ExcelErrorMessage.deleteRowsIncorrectInput());
        }
    }

    async insertRowsAfter(input: ExcelInsertRowsActionInput): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
        const startingRow = input.startingRow;
        const rowsNumber = input.rowsNumber;

        if (this.isNegativeInteger(startingRow) || this.isNegativeInteger(rowsNumber)) {
            throw new Error(ExcelErrorMessage.insertRowsIncorrectInput());
        }

        try {
            targetWorksheet
                .Range(targetWorksheet.Rows(startingRow + 1), targetWorksheet.Rows(startingRow + rowsNumber))
                .Insert();
        } catch (e) {
            throw new Error(ExcelErrorMessage.insertRowsIncorrectInput());
        }
    }

    async exportToCsv(input: ExcelExportToCsvActionInput): Promise<string> {
        const inputFilepath = input.filePath;
        const pathMatch = inputFilepath.match('(.*)xlsx?$');

        if (!existsSync(inputFilepath) || !pathMatch.length) {
            throw new Error(ExcelErrorMessage.exportToCsvFileIncorrectInput());
        }

        const pathWithoutExtension = pathMatch[1];
        const outputFilepath = pathWithoutExtension + 'csv';

        if (existsSync(outputFilepath)) {
            throw new Error(ExcelErrorMessage.exportToCsvFileAlreadyExists());
        }

        const workBook = XLSX.readFile(inputFilepath);
        // FS is only specified in ParsingOptions (e.g. readFile) but it works with writeFile as well.
        XLSX.writeFile(workBook, outputFilepath, { bookType: 'csv', FS: ';' } as XLSX.WritingOptions);
        return outputFilepath;
    }

    async clearCells(input: ExcelClearCellsActionInput): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const targetCells = this.parseOneDimensionalArray(input.targetCells);
        try {
            const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
            if (!Array.isArray(targetCells)) targetWorksheet.Range(targetCells).Clear();
            else for (const cellCoordinate of targetCells) targetWorksheet.Range(cellCoordinate).Clear();
        } catch (e) {
            throw new Error(ExcelErrorMessage.clearCellsIncorrectInput());
        }
    }

    async exportHtmlTable(input: ExcelExportHtmlTableActionInput): Promise<string> {
        if (!input.cellRange) {
            throw new Error(ExcelErrorMessage.createHtmlTableRequiredFields());
        }

        // Excel range pattern (e.g. A123:E456)
        if (!input.cellRange.match(/^[A-Za-z]+[0-9]+:[A-Za-z]+[0-9]+$/)) {
            throw new Error(ExcelErrorMessage.createHtmlTableInvalidRangeFormat());
        }

        const [startCell, endCell] = input.cellRange.split(':');
        const isSingleCellRange = startCell === endCell;
        if (isSingleCellRange) {
            throw new Error(ExcelErrorMessage.createHtmlTableInvalidCellRange());
        }

        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);

        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
        const rowsRange = targetWorksheet.Range(input.cellRange).Rows;
        const rowsCount = rowsRange.Count;

        if (input.rowLevel && Number(input.rowLevel) <= 0) {
            throw new Error(ExcelErrorMessage.createHtmlTableInvalidRowLevel());
        }

        const rowLevel = input.rowLevel ? Number(input.rowLevel) : 1;

        const headerRow = input.headerRow;
        if (headerRow && (Number(headerRow) <= 0 || Number(headerRow) > rowsCount)) {
            throw new Error(ExcelErrorMessage.createHtmlTableInvalidRow());
        }

        const rangeValues = [];

        const { column: startColumn, row: startRow } = this.getDividedCellCoordinates(startCell);
        const { column: endColumn, row: endRow } = this.getDividedCellCoordinates(endCell);

        for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
            const rowOutlineLevel = rowsRange.Rows(rowIdx).OutlineLevel;
            if (rowOutlineLevel > rowLevel) continue;
            
            const rowValues: ExcelCellValue[] = [];
         
            for (let columnIdx = startColumn; columnIdx <= endColumn; columnIdx++) {
                rowValues.push(targetWorksheet.Cells(rowIdx, columnIdx).Text ?? '');
            }

            rangeValues.push(rowValues);
        }

        const htmlTable = this.createHtmlTable(rangeValues, headerRow);

        return htmlTable;
    }

    private createHtmlTable(data: unknown[][], row?: string) {
        const headerRow = row && Number(row) > 0 ? Number(row) - 1 : 0;
        const headers = data[headerRow];

        const tableStyle = 'overflow: auto; border: 1px solid #dededf; height: 100%; table-layout: auto; border-collapse: collapse; border-spacing: 1px;';
        const thStyle = 'border: 1px solid #dededf; background-color: #eceff1; color: #000000; padding: 5px 15px; text-align: left; height: 20.4pt; white-space: nowrap;';
        const tdStyle = 'border: 1px solid #dededf; background-color: #ffffff; color: #000000; padding: 5px 15px; text-align: left; height: 14.4pt; white-space: nowrap;';

        let tableHtml = `<table style="${tableStyle}"><thead><tr>`;

        for (const header of headers) {
            tableHtml += `<th style="${thStyle}">${header ?? ''}</th>`;
        }

        tableHtml += '</tr></thead><tbody>';

        for (let i = 0; i < data.length; i++) {
            if (i !== headerRow) {
                tableHtml += '<tr>';
                for (const cell of data[i]) {
                    tableHtml += `<td style="${tdStyle}">${cell ?? ''}</td>`;
                }
                tableHtml += '</tr>';
            }
        }

        tableHtml += '</tbody></table>';

        return tableHtml;
    }

    async deleteWorksheet(input: ExcelDeleteWorksheetActionInput): Promise<void> {
        this.checkIsWorksheetNameCorrect(input.worksheet, true);

        const targetWorksheet = this.session.Worksheets(input.worksheet);

        targetWorksheet.Delete();
    }

    async isWorksheetPresent(input: ExcelWorksheetExistActionInput): Promise<boolean> {
        return this.checkIfWorksheetExist(input.worksheet);
    }

    async readTable(input: ExcelReadTableActionInput): Promise<ExcelCellValue[][]> {
        if (input?.worksheet) this.checkWorksheet(input.worksheet, true);
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
        const tables = targetWorksheet.ListObjects;
        const targetTable = this.getTableByName(input.tableName, tables);

        return input.shouldIncludeHeaders ? targetTable : targetTable.slice(1);
    }

    /**
     * @description Function throws an error if the Excel worksheet exists
     * and we expect it does not exist, or if it does not exist and we expect it to exist.
     */
    private checkWorksheet(worksheet: string, shouldExist: boolean): void {
        if (
            (shouldExist && !this.checkIfWorksheetExist(worksheet)) ||
            (!shouldExist && (worksheet.trim() === '' || this.checkIfWorksheetExist(worksheet)))
        ) {
            throw new Error(ExcelErrorMessage.worksheetIncorrectInput(shouldExist));
        }
    }

    async runMacro(input: ExcelRunMacroInput) {
        if (input.functionParams === undefined || input.functionParams.length === 0) {
            return this.session.Run(input.macro);
        }

        switch (input.functionParams.length) {
            case 1:
                return this.session.Run(input.macro, input.functionParams[0]);
            case 2:
                return this.session.Run(input.macro, input.functionParams[0], input.functionParams[1]);
            case 3:
                return this.session.Run(
                    input.macro,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2]
                );
            case 4:
                return this.session.Run(
                    input.macro,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2],
                    input.functionParams[3]
                );
            case 5:
                return this.session.Run(
                    input.macro,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2],
                    input.functionParams[3],
                    input.functionParams[4]
                );
            case 6:
                return this.session.Run(
                    input.macro,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2],
                    input.functionParams[3],
                    input.functionParams[4],
                    input.functionParams[5]
                );
            case 7:
                return this.session.Run(
                    input.macro,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2],
                    input.functionParams[3],
                    input.functionParams[4],
                    input.functionParams[5],
                    input.functionParams[6]
                );
            case 8:
                return this.session.Run(
                    input.macro,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2],
                    input.functionParams[3],
                    input.functionParams[4],
                    input.functionParams[5],
                    input.functionParams[6],
                    input.functionParams[7]
                );
            case 9:
                return this.session.Run(
                    input.macro,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2],
                    input.functionParams[3],
                    input.functionParams[4],
                    input.functionParams[5],
                    input.functionParams[6],
                    input.functionParams[7],
                    input.functionParams[8]
                );
            case 10:
                return this.session.Run(
                    input.macro,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2],
                    input.functionParams[3],
                    input.functionParams[4],
                    input.functionParams[5],
                    input.functionParams[6],
                    input.functionParams[7],
                    input.functionParams[8],
                    input.functionParams[9]
                );
            default:
                throw new Error(ExcelErrorMessage.getRunMacroToManyArguments());
        }
    }

    run(request: ExcelActionRequest) {
        if (process.platform !== 'win32' && request.script !== 'excel.exportToCsv') {
            throw new Error('Excel actions can be run only on Windows bot');
        }

        if (!['excel.open', 'excel.exportToCsv'].includes(request.script)) {
            this.isApplicationOpen();
        }

        switch (request.script) {
            case 'excel.open':
                return this.open(request.input);
            case 'excel.getCell':
                return this.getCell(request.input);
            case 'excel.getCells':
                return this.getCells(request.input);
            case 'excel.setCell':
                return this.setCell(request.input);
            case 'excel.findFirstEmptyRow':
                return this.findFirstEmptyRow(request.input);
            case 'excel.clearCells':
                return this.clearCells(request.input);
            case 'excel.setCells':
                return this.setCells(request.input);
            case 'excel.worksheetExists':
                return this.isWorksheetPresent(request.input);
            case 'excel.createWorksheet':
                return this.createWorksheet(request.input);
            case 'excel.renameWorksheet':
                return this.renameWorksheet(request.input);
            case 'excel.setActiveWorksheet':
                return this.setActiveWorksheet(request.input);
            case 'excel.insertColumnsBefore':
                return this.insertColumnsBefore(request.input);
            case 'excel.insertColumnsAfter':
                return this.insertColumnsAfter(request.input);
            case 'excel.runMacro':
                return this.runMacro(request.input);
            case 'excel.deleteWorksheet':
                return this.deleteWorksheet(request.input);
            case 'excel.worksheetExists':
                return this.isWorksheetPresent(request.input);
            case 'excel.deleteColumns':
                return this.deleteColumns(request.input);
            case 'excel.deleteRows':
                return this.deleteRows(request.input);
            case 'excel.insertRowsBefore':
                return this.insertRowsBefore(request.input);
            case 'excel.insertRowsAfter':
                return this.insertRowsAfter(request.input);
            case 'excel.save':
                return this.save(request.input);
            case 'excel.close':
                return this.close();
            case 'excel.readTable':
                return this.readTable(request.input);
            case 'excel.exportToCsv':
                return this.exportToCsv(request.input);
            case 'excel.exportHtmlTable':
                return this.exportHtmlTable(request.input);
            default:
                throw new Error('Action not found');
        }
    }

    async tearDown() {
        await this.close();
    }

    /**
     * @description Function throws an error if there is no active Excel session (application is not open)
     */
    private isApplicationOpen() {
        if (!this.session) {
            throw new Error(ExcelErrorMessage.getNoActiveSession());
        }
    }

    /**
     * @description Function throws an error if the Excel worksheet exists
     * and we expect it does not exist, or if it does not exist and we expect it to exist.
     */
    private checkIsWorksheetNameCorrect(worksheet: string, shouldExist: boolean): void {
        if (
            (shouldExist && !this.checkIfWorksheetExist(worksheet)) ||
            (!shouldExist &&
                (this.checkIfWorksheetExist(worksheet) ||
                    worksheet.length > 31 ||
                    !worksheet.match(RegexPatterns.EXCEL_WORKSHEET_NAME)))
        ) {
            throw new Error(ExcelErrorMessage.worksheetIncorrectInput(shouldExist));
        }
    }

    /**
     * @description Divides cell coordinates into row and column coordinates, and converts column name to column number
     * @param cell - cell coordinates, e.g. AZ283
     * @returns separated row and column coordinates of the cell
     * @throws Error if cell coordinates are incorrect
     * @example getDividedCellCoordinates('C25') // { column: 3, row: 25 }
     */
    private getDividedCellCoordinates(cell: string): CellCoordinates {
        const cellMatch = cell.match(/([A-Z]+)([0-9]+)/);
        if (!cellMatch || cellMatch.length !== 3)
            throw new Error(ExcelErrorMessage.divideCellCoordinatesIncorrectInput());

        return {
            column: this.getColumnCoordinate(cellMatch[1]),
            row: Number(cellMatch[2]),
        };
    }

    /**
     * @description Converts column name to column number
     * @param column - column name, e.g. AZ
     * @returns column number
     * @example getColumnCoordinate('C') // 3
     */
    private getColumnCoordinate(column: string): number {
        if (!column || typeof column === 'number')
            throw new Error(ExcelErrorMessage.getColumnCoordinateIncorrectInput());
        return this.session.ActiveSheet.Range(`${column}1`).Column;
    }

    /**
     * @description Sorts columns by their length and alphabetically
     * @param columns - array of column names, e.g. ['A', 'AZ', 'B', 'C']
     * @returns sorted array of column names
     * @example sortColumns(['A', 'AZ', 'B', 'C']) // ['A', 'B', 'C', 'AZ']
     */
    private sortColumns(columns: string[]): string[] {
        return columns.sort((a, b) => {
            if (a.length !== b.length) {
                return a.length - b.length;
            }
            return a.localeCompare(b);
        });
    }

    /**
     * @description Checks if worksheet exists in the Excel session
     * @param worksheet - worksheet name
     * @returns true if worksheet exists, false otherwise
     * @example checkIfWorksheetExist('Sheet1') // true
     */
    private checkIfWorksheetExist(worksheet: string): boolean {
        const worksheets = this.session.Worksheets;
        const worksheetUpper = worksheet.toUpperCase();
        for (let i = 1; i <= worksheets.Count; i++) {
            const sheet = worksheets(i);
            if (sheet.Name.toUpperCase() === worksheetUpper) {
                return true;
            }
        }
        return false;
    }

    /**
     * @description Parses value to array if it's string
     * @param value - Raw or stringified Excel list of lists
     * @param errorMessage - error message to throw if parsing fails
     * @returns list of lists as Excel structure array
     * @throws Error if parsing fails
     * @example parseExcelStructureArray("[["A1", "B1", "C1"], ["A2", "B2", "C2"]]") // [["A1", "B1", "C1"], ["A2", "B2", "C2"]]
     */
    private parseExcelStructureArray(value: string | ExcelCellValue[][], errorMessage: string): ExcelCellValue[][] {
        try {
            return Array.isArray(value) ? value : JSON.parse(value);
        } catch (e) {
            throw new Error(errorMessage);
        }
    }

    /**
     * @description Parses value to array if it's string
     * @param value - Raw or stringified list of cell coordinates
     * @returns array of cell coordinates or input value if parsing fails
     * @example parseOneDimensionalArray("[["A1", "B1", "C1"], ["A2", "B2", "C2"]]") // [["A1", "B1", "C1"], ["A2", "B2", "C2"]]
     * @example parseOneDimensionalArray("A1") // "A1"
     * @example parseOneDimensionalArray("A1:C5") // "A1:C5"
     */
    private parseOneDimensionalArray = (value: string | string[]): string | string[] => {
        try {
            return Array.isArray(value) ? value : JSON.parse(value);
        } catch (e) {
            return value;
        }
    };

    private getTableByName(name: string, tables: any): any {
        const tablesNum = tables.Count;
        for (let i = 1; i <= tablesNum; i++) {
            const table = tables.Item(i);
            if (table.Name === name) {
                return table.Range.Value();
            }
        }
        throw new Error(ExcelErrorMessage.tableNotFoundIncorrectInput());
    }

    private isNegativeInteger(number: number): boolean {
        return (Number.isInteger(number) && number < 0)
    }
}