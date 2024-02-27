export class RpaFrameworkErrorMessage {
    static windowTitleRequired() {
        return 'This action requires window title parameter. It has to be case identical.';
    }

    static locatorRequired() {
        return 'This action requires locator parameter.'
    }

    static keysRequired() {
        return 'This action requires keys parameter, ex. ["Ctrl", "C"]'
    }

    static invalidKeysType() {
        return 'This action requires keys property of type string, ex. "abc" or "123"'
    }
}
