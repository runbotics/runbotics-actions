import { basename } from "path";

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
    index?: number | undefined;
    slideStart?: number | undefined;
    slideEnd?: number | undefined;
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
        const args: any[] = [input.filePath];

        input.index ? args.push(input.index) : args.push(0);
        if (input.slideStart !== undefined) {
            args.push(input.slideStart);
        }
        if (input.slideEnd !== undefined) {
            args.push(input.slideEnd);
        }
        this.session.ActivePresentation.Slides.InsertFromFile(...args);
    }

    async runMacro(input: PowerPointRunMacroInput) {
        let macroName = input.macro;
        const fileName = basename(this.openedFiles);
        macroName = `${fileName}!${macroName}`;

        const params = input.functionParams ?? [];

        if (params.length > 30) {
            throw new Error("Macro can have maximum 30 arguments.");
        }

        return this.session.Run(macroName, ...params);
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
