import argparse
import json
import windows.actions as actions
import sys

sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

def setup_args():
    parser = argparse.ArgumentParser(description='List of options for RPA Framework actions')

    parser.add_argument('-windowTitle', '--windowTitle', required=False, help='Title of the window dialog')

    group1 = parser.add_argument_group('Get Element')
    group1.add_argument('-getElement', '--getElementLocator', help='Gets an window element by provided locator')
    group2 = parser.add_argument_group('List Windows')
    group2.add_argument('-listWindows', '--listWindows', nargs='?', const=True, help='Gets details of all currently running windows')
    group3 = parser.add_argument_group('Is Window Open')
    group3.add_argument('-isWindowOpen', '--isWindowOpen', nargs='?', const=True, help='Checks if provided window is open')
    group4 = parser.add_argument_group('Mouse Click')
    group4.add_argument('-mouseClick', '--mouseClickLocator', help='Performs mouse click on the element by provided locator')
    group5 = parser.add_argument_group('Wait For Element')
    group5.add_argument('-waitForElement', '--waitForElementLocator', help='Waits for a window element by provided locator')
    group6 = parser.add_argument_group('Press Keys')
    group6.add_argument('-pressKeys', '--pressKeysJsonArray', help='Presses key combination provided as JSON array')
    group7 = parser.add_argument_group('Send Keys')
    group7.add_argument('-sendKeys', '--sendKeysJsonBody', help='Sends keys to specified element by provided locator')
    group8 = parser.add_argument_group('Minimize Window')
    group8.add_argument('-minimizeWindow', '--minimizeWindowLocator', help='Minimize window by provided locator')
    group9 = parser.add_argument_group('Maximize Window')
    group9.add_argument('-maximizeWindow', '--maximizeWindowLocator', help='Maximize window by provided locator')

    return parser.parse_args()

def action_handler():
    args = setup_args()

    if args.listWindows:
        windows = actions.list_windows()
        if not windows: raise ValueError(f"Cannot find windows")

        for window in windows:
            window.pop('object')

        print(json.dumps(windows))
        return

    window_title = args.windowTitle

    if args.isWindowOpen:
        is_open = actions.is_window_open(window_title)
        print(json.dumps(is_open))
        return

    pid = actions.get_pid_by_window_title(window_title)
    if pid is None: raise ValueError(f"Cannot get pid for window title '{window_title}'")

    app = actions.connect_by_pid(pid)
    if app is None: raise ValueError(f"Cannot connect to app by pid '{pid}'")

    if args.getElementLocator:
        locator = args.getElementLocator

        element = actions.get_element(locator)
        if element is False: raise ValueError(f"Cannot find element for locator '{locator}'")

        element_dict = vars(element)
        element_dict.pop('item')
        element_dict.pop('_sibling_element_compare')

        print(json.dumps(element_dict))

    if args.mouseClickLocator:
        locator = args.mouseClickLocator

        actions.mouse_click(locator)

    if args.waitForElementLocator:
        locator = args.waitForElementLocator

        elements = actions.wait_for_element(locator)
        if not elements: raise ValueError(f"Cannot find elements for locator '{locator}'")

        for element in elements:
            element.pop('object')
            element.pop('control')

        print(json.dumps(elements))

    if args.pressKeysJsonArray:
        press_keys = json.loads(args.pressKeysJsonArray)

        actions.press_keys(press_keys)

    if args.sendKeysJsonBody:
        send_keys_json = json.loads(args.sendKeysJsonBody)

        locator = send_keys_json.get('locator')
        keys = send_keys_json.get('keys')
        send_enter = send_keys_json.get('send_enter')

        actions.send_keys(
            locator,
            keys,
            send_enter
        )

    if args.minimizeWindowLocator:
        locator = args.minimizeWindowLocator

        actions.minimize_window(locator)

    if args.maximizeWindowLocator:
        locator = args.maximizeWindowLocator

        actions.maximize_window(locator)

if __name__ == '__main__':
    action_handler()
