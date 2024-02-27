import { DesktopRunRequest } from "@runbotics/runbotics-sdk";

export type RpaFrameworkActionRequest =
    | DesktopRunRequest<'rpaframework.isWindowOpen', RpaFrameworkIsWindowOpenActionInput>
    | DesktopRunRequest<'rpaframework.getElement', RpaFrameworkGetElementActionInput>
    | DesktopRunRequest<'rpaframework.mouseClick', RpaFrameworkMouseClickActionInput>
    | DesktopRunRequest<'rpaframework.waitForElement', RpaFrameworkWaitForElementActionInput>
    | DesktopRunRequest<'rpaframework.pressKeys', RpaFrameworkPressKeysActionInput>
    | DesktopRunRequest<'rpaframework.sendKeys', RpaFrameworkSendKeysActionInput>
    | DesktopRunRequest<'rpaframework.minimizeWindow', RpaFrameworkMinimizeWindowActionInput>
    | DesktopRunRequest<'rpaframework.maximizeWindow', RpaFrameworkMaximizeWindowActionInput>
    | DesktopRunRequest<'rpaframework.closeWindow', RpaFrameworkCloseWindowActionInput>
    | DesktopRunRequest<'rpaframework.getWindowElements'>;

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

export interface RpaFrameworkCloseWindowActionInput extends BaseActionInput {}

export enum ExecutableArgs {
    WINDOW_TITLE = '-windowTitle',
    IS_WINDOW_OPEN = '-isWindowOpen',
    GET_ELEMENT = '-getElement',
    GET_WINDOW_ELEMENTS = '-getWindowElements',
    MOUSE_CLICK = '-mouseClick',
    WAIT_FOR_ELEMENT = '-waitForElement',
    PRESS_KEYS = '-pressKeys',
    SEND_KEYS = '-sendKeys',
    MINIMIZE_WINDOW = '-minimizeWindow',
    MAXIMIZE_WINDOW = '-maximizeWindow',
    CLOSE_WINDOW = '-closeWindow'
};
