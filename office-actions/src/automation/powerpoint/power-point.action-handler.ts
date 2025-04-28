import { DesktopRunRequest, StatefulActionHandler } from "@runbotics/runbotics-sdk";

export type PowerPointActionRequest =
| DesktopRunRequest<'powerpoint.open', PowerPointOpenActionInput>
| DesktopRunRequest<'powerpoint.save', PowerPointSaveActionInput>
| DesktopRunRequest<'powerpoint.insert', PowerPointInsertActionInput>
| DesktopRunRequest<'powerpoint.runMacro', PowerPointRunMacroInput>
| DesktopRunRequest<'powerpoint.close', PowerPointCloseActionInput>;

export type PowerPointOpenActionInput = {
    filePath: string;
};
export type PowerPointOpenActionOutput = any;

export type PowerPointInsertActionInput = {
    filePath: string;
};
export type PowerPointInsertActionOutput = any;

export type PowerPointRunMacroInput = {
    macro: string;
    functionParams?: Array<string>;
};

export type PowerPointSaveActionInput = {};
export type PowerPointSaveActionOutput = any;

export type PowerPointCloseActionInput = {};
export type PowerPointCloseActionOutput = any;

export default class PowerPointActionHandler extends StatefulActionHandler {
    private session = null;
    private openedFiles = null;

    constructor() {
        super();
    }

    async open(
        input: PowerPointOpenActionInput
    ): Promise<PowerPointOpenActionOutput> {
        const winax = await import('@runbotics/winax');

        this.session = new winax.Object("PowerPoint.Application", {
            activate: true,
        });

        this.session.Presentations.Open(input.filePath);

        this.openedFiles = input.filePath;
    }

    async insertSlide(
        input: PowerPointInsertActionInput
    ): Promise<PowerPointInsertActionOutput> {
        this.isApplicationOpen();
        this.session.ActivePresentation.Slides.InsertFromFile(
            input.filePath,
            0
        );
    }

    async runMacro(input: PowerPointRunMacroInput) {
        let macroName = input.macro;
        const fileName = require("path").basename(this.openedFiles);
        macroName = `${fileName}!${macroName}`;

        if (input.functionParams === undefined || input.functionParams.length === 0) {
            return this.session.Run(macroName);
        }

        switch (input.functionParams.length) {
            case 1:
                return this.session.Run(macroName, input.functionParams[0]);
            case 2:
                return this.session.Run(macroName, input.functionParams[0], input.functionParams[1]);
            case 3:
                return this.session.Run(
                    macroName,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2]
                );
            case 4:
                return this.session.Run(
                    macroName,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2],
                    input.functionParams[3]
                );
            case 5:
                return this.session.Run(
                    macroName,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2],
                    input.functionParams[3],
                    input.functionParams[4]
                );
            case 6:
                return this.session.Run(
                    macroName,
                    input.functionParams[0],
                    input.functionParams[1],
                    input.functionParams[2],
                    input.functionParams[3],
                    input.functionParams[4],
                    input.functionParams[5]
                );
            case 7:
                return this.session.Run(
                    macroName,
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
                    macroName,
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
                    macroName,
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
                    macroName,
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
                throw new Error('Macro can have maximum 10 arguments.');
        }
    }

    async saveAs(
        input: PowerPointSaveActionInput
    ): Promise<PowerPointSaveActionOutput> {
        this.isApplicationOpen();
        this.session.ActivePresentation.SaveAs(this.openedFiles);
    }

    async close(): Promise<PowerPointCloseActionOutput> {
        this.session?.Quit();
        this.session = null;
        this.openedFiles = null;
    }

    private isApplicationOpen() {
        if (!this.session) {
            throw new Error('Use open application action before');
        }
    }

    run(request: PowerPointActionRequest) {
        if (process.platform !== 'win32') {
            throw new Error('PowerPoint actions can be run only on Windows bot');
        }

        switch (request.script) {
            case "powerpoint.open":
                return this.open(request.input);
            case "powerpoint.insert":
                return this.insertSlide(request.input);
            case "powerpoint.runMacro":
                return this.runMacro(request.input);
            case "powerpoint.save":
                return this.saveAs(request.input);
            case "powerpoint.close":
                return this.close();
            default:
                throw new Error("Action not found");
        }
    }

    async tearDown() {
        await this.close();
    }
}
