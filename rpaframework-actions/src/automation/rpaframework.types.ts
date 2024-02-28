import { DesktopRunRequest } from "@runbotics/runbotics-sdk";

export type RpaFrameworkActionRequest =
    | DesktopRunRequest<'rpaFramework.isWindowOpen', RpaFrameworkIsWindowOpenActionInput>
    | DesktopRunRequest<'rpaFramework.getElement', RpaFrameworkGetElementActionInput>
    | DesktopRunRequest<'rpaFramework.mouseClick', RpaFrameworkMouseClickActionInput>
    | DesktopRunRequest<'rpaFramework.waitForElement', RpaFrameworkWaitForElementActionInput>
    | DesktopRunRequest<'rpaFramework.pressKeys', RpaFrameworkPressKeysActionInput>
    | DesktopRunRequest<'rpaFramework.sendKeys', RpaFrameworkSendKeysActionInput>
    | DesktopRunRequest<'rpaFramework.minimizeWindow', RpaFrameworkMinimizeWindowActionInput>
    | DesktopRunRequest<'rpaFramework.maximizeWindow', RpaFrameworkMaximizeWindowActionInput>
    | DesktopRunRequest<'rpaFramework.listWindows'>;

export interface BaseActionInput {
    windowTitle: string;
    locator: string;
}

export interface RpaFrameworkIsWindowOpenActionInput extends Pick<BaseActionInput, 'windowTitle'>  {}

export interface RpaFrameworkGetElementActionInput extends BaseActionInput {}

export interface RpaFrameworkMouseClickActionInput extends BaseActionInput {}

export interface RpaFrameworkWaitForElementActionInput extends BaseActionInput {}

export interface RpaFrameworkPressKeysActionInput extends Pick<BaseActionInput, 'windowTitle'> {
    keys: string[];
}

export interface RpaFrameworkSendKeysActionInput extends BaseActionInput {
    keys?: string;
    sendEnter?: boolean;
}

export interface RpaFrameworkMinimizeWindowActionInput extends BaseActionInput {}

export interface RpaFrameworkMaximizeWindowActionInput extends BaseActionInput {}

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
