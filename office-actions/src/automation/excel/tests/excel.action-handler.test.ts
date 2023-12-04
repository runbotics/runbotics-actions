import ExcelActionHandler from '../excel.action-handler';
import { ExcelActionRequest, ExcelOpenActionInput, ExcelExportHtmlTableActionInput } from '../excel.types';
import isHtml from 'is-html';
import ExcelErrorMessage from '../excelErrorMessage';

const exportHtmlTableActionInput: ExcelExportHtmlTableActionInput = {
    cellRange: 'D7:N23',
    headerRow: '7',
    worksheet: undefined
};

const excelOpenActionInput: ExcelOpenActionInput = {
    path: `${__dirname}\\TEST.xlsx`,
    worksheet: undefined,
    mode: 'xlReadWrite'
};

const request: ExcelActionRequest = {
    script: 'excel.exportHtmlTable',
    input: exportHtmlTableActionInput,
    processInstanceId: 'mock processInstanceId',
    rootProcessInstanceId: 'mock rootProcessInstanceId',
    userId: 2137,
    executionContext: undefined,
    trigger: {
        name: 'mock trigger name'
    },
};

describe('ExcelActionHandler', () => {
    let excelActionHandler: ExcelActionHandler;

    beforeEach(() => {
        excelActionHandler = new ExcelActionHandler();
    });

    it('should be defined', () => {
        expect(excelActionHandler).toBeDefined();
    });

    describe('exportHtmlTable', () => {
        beforeEach(async () => await excelActionHandler.open(excelOpenActionInput));

        afterAll(async () => await excelActionHandler.tearDown());

        it('should return defined valid HTML string', async () => {
            const result = await excelActionHandler.run(request);

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(isHtml(result)).toBe(true);
        });

        it('should throw excel error createHtmlTableRequiredFields if not provided cellRange', async () => {
            const invalidWorksheetRequest: ExcelActionRequest = {
                ...request,
                input: {
                    ...request.input,
                    cellRange: undefined,
                }
            };

            const call = () => excelActionHandler.run(invalidWorksheetRequest);

            try {
                await call();

                expect(call).toThrow();
            } catch (error) {
                expect(error).toStrictEqual(new Error(ExcelErrorMessage.createHtmlTableRequiredFields()));
            }
        });

        it('should throw excel error worksheetIncorrectInput if worksheet does not exist', async () => {
            const invalidWorksheetRequest: ExcelActionRequest = {
                ...request,
                input: {
                    ...request.input,
                    worksheet: 'invalid worksheet name'
                }
            };

            const call = () => excelActionHandler.run(invalidWorksheetRequest);

            try {
                await call();

                expect(call).toThrow();
            } catch (error) {
                expect(error).toStrictEqual(new Error(ExcelErrorMessage.worksheetIncorrectInput(true)));
            }
        });

        it('should throw excel error createHtmlTableInvalidCellRange if call range has invalid range', async () => {
            const invalidWorksheetRequest: ExcelActionRequest = {
                ...request,
                input: {
                    ...request.input,
                    cellRange: 'A1:A1',
                }
            };

            const call = () => excelActionHandler.run(invalidWorksheetRequest);

            try {
                await call();

                expect(call).toThrow();
            } catch (error) {
                expect(error).toStrictEqual(new Error(ExcelErrorMessage.createHtmlTableInvalidCellRange()));
            }
        });

        it('should throw excel error createHtmlTableInvalidRow if header row value is invalid', async () => {
            const invalidWorksheetRequest: ExcelActionRequest = {
                ...request,
                input: {
                    ...request.input,
                    cellRange: 'A1:A5',
                    headerRow: '6'
                }
            };

            const call = () => excelActionHandler.run(invalidWorksheetRequest);

            try {
                await call();

                expect(call).toThrow();
            } catch (error) {
                expect(error).toStrictEqual(new Error(ExcelErrorMessage.createHtmlTableInvalidRow()));
            }
        });
    });
});
