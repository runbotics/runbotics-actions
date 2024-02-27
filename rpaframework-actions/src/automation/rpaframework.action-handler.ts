import {
    StatelessActionHandler,
} from "@runbotics/runbotics-sdk";

import { spawn } from 'child_process';
import { isValidJson } from "./rpaframework.utils";
import { ExecutableArgs, RpaFrameworkActionRequest, RpaFrameworkCloseWindowActionInput, RpaFrameworkGetElementActionInput, RpaFrameworkIsWindowOpenActionInput, RpaFrameworkMaximizeWindowActionInput, RpaFrameworkMinimizeWindowActionInput, RpaFrameworkMouseClickActionInput, RpaFrameworkPressKeysActionInput, RpaFrameworkSendKeysActionInput, RpaFrameworkWaitForElementActionInput } from "./rpaframework.types";
import { RpaFrameworkErrorMessage } from "./rpaframework.error-message";

export default class RpaFrameworkActionHandler extends StatelessActionHandler {

    async isWindowOpen(input: RpaFrameworkIsWindowOpenActionInput) {
        return this.executableRunner([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.IS_WINDOW_OPEN,
        ]);
    }

    async getElement(input: RpaFrameworkGetElementActionInput) {
        return this.executableRunner([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.GET_ELEMENT,
            input.locator,
        ]);
    }

    async mouseClick(input: RpaFrameworkMouseClickActionInput) {
        this.executableRunner([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.MOUSE_CLICK,
            input.locator,
        ]);
    }

    async waitForElement(input: RpaFrameworkWaitForElementActionInput) {
        return this.executableRunner([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.WAIT_FOR_ELEMENT,
            input.locator,
        ]);
    }

    async pressKeys(input: RpaFrameworkPressKeysActionInput) {
        if (!input.keys || !Array.isArray(input.keys)) {
            throw new Error(RpaFrameworkErrorMessage.keysRequired());
        }

        this.executableRunner([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.PRESS_KEYS,
            JSON.stringify(input.keys),
        ]);
    }

    async sendKeys(input: RpaFrameworkSendKeysActionInput) {
        if (input?.keys && typeof input.keys !== 'string') {
            throw new Error(RpaFrameworkErrorMessage.invalidKeysType());
        }

        const payload = {
            locator: input.locator,
            keys: input?.keys,
            send_enter: input?.sendEnter,
        };

        this.executableRunner([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.SEND_KEYS,
            JSON.stringify(payload),
        ]);
    }

    async minimizeWindow(input: RpaFrameworkMinimizeWindowActionInput) {
        return this.executableRunner([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.MINIMIZE_WINDOW,
            input.locator,
        ]);
    }

    async maximizeWindow(input: RpaFrameworkMaximizeWindowActionInput) {
        return this.executableRunner([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.MAXIMIZE_WINDOW,
            input.locator,
        ]);
    }

    async closeWindow(input: RpaFrameworkCloseWindowActionInput) {
        return this.executableRunner([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.CLOSE_WINDOW,
            input.locator,
        ]);
    }

    async getWindowElements() {
        return this.executableRunner([
            ExecutableArgs.GET_WINDOW_ELEMENTS,
        ]);
    }

    run(request: RpaFrameworkActionRequest) {
        if (![
                'rpaframework.getWindowElements'
            ].includes(request.script) &&
            !request.input.windowTitle
        ) {
            throw new Error(RpaFrameworkErrorMessage.windowTitleRequired());
        }

        if (![
                'rpaframework.isWindowOpen',
                'rpaframework.getWindowElements',
                'rpaframework.pressKeys'
            ].includes(request.script) &&
            !request.input.locator) {
            throw new Error(RpaFrameworkErrorMessage.locatorRequired());
        }

        switch (request.script) {
            case 'rpaframework.isWindowOpen':
                return this.isWindowOpen(request.input)
            case 'rpaframework.getElement':
                return this.getElement(request.input)
            case 'rpaframework.mouseClick':
                return this.mouseClick(request.input)
            case 'rpaframework.waitForElement':
                return this.waitForElement(request.input)
            case 'rpaframework.pressKeys':
                return this.pressKeys(request.input)
            case 'rpaframework.sendKeys':
                return this.sendKeys(request.input)
            case 'rpaframework.minimizeWindow':
                return this.minimizeWindow(request.input)
            case 'rpaframework.maximizeWindow':
                return this.maximizeWindow(request.input)
            case 'rpaframework.closeWindow':
                return this.closeWindow(request.input)
            case 'rpaframework.getWindowElements':
                return this.getWindowElements()
            default:
                throw new Error('Action not found');
        }
    }

    private async executableRunner(args: string[]) {
        const executablePath = process.env.RUNBOTICS_RPAFRAMEWORK_EXE_DIR;
        const child = spawn(executablePath, args);

        return new Promise((resolve, reject) => {
            let errorMessage = Buffer.alloc(0);
            let actionResult = null;

            const onData = (data: string) => {
                if (isValidJson(data)) {
                    actionResult = JSON.parse(data);
                } else {
                    actionResult = data.toString();
                }
            };

            const onError = (error: Uint8Array) => {
                errorMessage = Buffer.concat([errorMessage, error]);
            };

            const onClose = (code: number) => {
                if (code) {
                    reject(errorMessage.toString().trim());
                } else {
                    resolve(actionResult);
                }

                child.stdout.off("data", onData);
                child.stderr.off("data", onError);
                child.off("close", onClose);
            };

            child.stdout.on("data", onData);
            child.stderr.on("data", onError);
            child.on("close", onClose);
        });
    }
}
