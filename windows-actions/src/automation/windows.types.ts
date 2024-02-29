import { DesktopRunRequest } from "@runbotics/runbotics-sdk";

export type WindowsActionRequest =
    | DesktopRunRequest<'windows.isWindowOpen', WindowsIsWindowOpenActionInput>
    | DesktopRunRequest<'windows.getElement', WindowsGetElementActionInput>
    | DesktopRunRequest<'windows.mouseClick', WindowsMouseClickActionInput>
    | DesktopRunRequest<'windows.waitForElement', WindowsWaitForElementActionInput>
    | DesktopRunRequest<'windows.pressKeys', WindowsPressKeysActionInput>
    | DesktopRunRequest<'windows.sendKeys', WindowsSendKeysActionInput>
    | DesktopRunRequest<'windows.minimizeWindow', WindowsMinimizeWindowActionInput>
    | DesktopRunRequest<'windows.maximizeWindow', WindowsMaximizeWindowActionInput>
    | DesktopRunRequest<'windows.listWindows'>;

export interface BaseActionInput {
    windowTitle: string;
    locator: string;
}

export interface WindowsIsWindowOpenActionInput extends Pick<BaseActionInput, 'windowTitle'>  {}

export interface WindowsGetElementActionInput extends BaseActionInput {}

export interface WindowsMouseClickActionInput extends BaseActionInput {}

export interface WindowsWaitForElementActionInput extends BaseActionInput {}

export interface WindowsPressKeysActionInput extends Pick<BaseActionInput, 'windowTitle'> {
    keys: string[];
}

export interface WindowsSendKeysActionInput extends BaseActionInput {
    keys?: string;
    sendEnter?: boolean;
}

export interface WindowsMinimizeWindowActionInput extends BaseActionInput {}

export interface WindowsMaximizeWindowActionInput extends BaseActionInput {}

export enum ExecutableArgs {
    WINDOW_TITLE = '-windowTitle',
    IS_WINDOW_OPEN = '-isWindowOpen',
    GET_ELEMENT = '-getElement',
    LIST_WINDOWS = '-listWindows',
    MOUSE_CLICK = '-mouseClick',
    WAIT_FOR_ELEMENT = '-waitForElement',
    PRESS_KEYS = '-pressKeys',
    SEND_KEYS = '-sendKeys',
    MINIMIZE_WINDOW = '-minimizeWindow',
    MAXIMIZE_WINDOW = '-maximizeWindow',
    CLOSE_WINDOW = '-closeWindow'
};
