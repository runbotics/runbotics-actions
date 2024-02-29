import {
    StatelessActionHandler,
} from "@runbotics/runbotics-sdk";

import { spawn } from 'child_process';
import { isValidJson } from "./windows.utils";
import {
    ExecutableArgs,
    WindowsActionRequest,
    WindowsGetElementActionInput,
    WindowsIsWindowOpenActionInput,
    WindowsMaximizeWindowActionInput,
    WindowsMinimizeWindowActionInput,
    WindowsMouseClickActionInput,
    WindowsPressKeysActionInput,
    WindowsSendKeysActionInput,
    WindowsWaitForElementActionInput
} from "./windows.types";
import { WindowsErrorMessage } from "./windows.error-message";

export default class WindowsActionHandler extends StatelessActionHandler {

    async isWindowOpen(input: WindowsIsWindowOpenActionInput) {
        return this.executeAction([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.IS_WINDOW_OPEN,
        ]);
    }

    async getElement(input: WindowsGetElementActionInput) {
        return this.executeAction([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.GET_ELEMENT,
            input.locator,
        ]);
    }

    async mouseClick(input: WindowsMouseClickActionInput) {
        this.executeAction([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.MOUSE_CLICK,
            input.locator,
        ]);
    }

    async waitForElement(input: WindowsWaitForElementActionInput) {
        return this.executeAction([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.WAIT_FOR_ELEMENT,
            input.locator,
        ]);
    }

    async pressKeys(input: WindowsPressKeysActionInput) {
        if (!input.keys || !Array.isArray(input.keys)) {
            throw new Error(WindowsErrorMessage.keysRequired());
        }

        this.executeAction([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.PRESS_KEYS,
            JSON.stringify(input.keys),
        ]);
    }

    async sendKeys(input: WindowsSendKeysActionInput) {
        if (input?.keys && typeof input.keys !== 'string') {
            throw new Error(WindowsErrorMessage.invalidKeysType());
        }

        const payload = {
            locator: input.locator,
            keys: input?.keys,
            send_enter: input?.sendEnter,
        };

        this.executeAction([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.SEND_KEYS,
            JSON.stringify(payload),
        ]);
    }

    async minimizeWindow(input: WindowsMinimizeWindowActionInput) {
        return this.executeAction([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.MINIMIZE_WINDOW,
            input.locator,
        ]);
    }

    async maximizeWindow(input: WindowsMaximizeWindowActionInput) {
        return this.executeAction([
            ExecutableArgs.WINDOW_TITLE,
            input.windowTitle,
            ExecutableArgs.MAXIMIZE_WINDOW,
            input.locator,
        ]);
    }

    async listWindows() {
        return this.executeAction([
            ExecutableArgs.LIST_WINDOWS,
        ]);
    }

    run(request: WindowsActionRequest) {
        if (![
            'windows.listWindows'
        ].includes(request.script) &&
            !request.input.windowTitle
        ) {
            throw new Error(WindowsErrorMessage.windowTitleRequired());
        }

        if (![
            'windows.isWindowOpen',
            'windows.listWindows',
            'windows.pressKeys'
        ].includes(request.script) &&
            !request.input.locator) {
            throw new Error(WindowsErrorMessage.locatorRequired());
        }

        switch (request.script) {
            case 'windows.isWindowOpen':
                return this.isWindowOpen(request.input)
            case 'windows.getElement':
                return this.getElement(request.input)
            case 'windows.mouseClick':
                return this.mouseClick(request.input)
            case 'windows.waitForElement':
                return this.waitForElement(request.input)
            case 'windows.pressKeys':
                return this.pressKeys(request.input)
            case 'windows.sendKeys':
                return this.sendKeys(request.input)
            case 'windows.minimizeWindow':
                return this.minimizeWindow(request.input)
            case 'windows.maximizeWindow':
                return this.maximizeWindow(request.input)
            case 'windows.listWindows':
                return this.listWindows()
            default:
                throw new Error('Action not found');
        }
    }

    private async executeAction(args: string[]) {
        const executablePath = process.env.RUNBOTICS_EXECUTABLE_PATH;
        if (!executablePath) {
            return Promise.reject(new Error('No executable path was provided.'));
        }

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
