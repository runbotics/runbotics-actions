import argparse
import json
import rpaframework.actions as actions
import sys

APP_VERSION = "1.0.0"

sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

def setup_args():
    parser = argparse.ArgumentParser(description='List of options for RPA Framework actions')

    parser.add_argument('-windowTitle', '--windowTitle', required=True, help='Title of the app dialog')

    group1 = parser.add_argument_group('Get Element')
    group1.add_argument('-getElement', '--getElementLocator', help='Get Element locator')
    group2 = parser.add_argument_group('Get Window Elements')
    group2.add_argument('-getWindowElements', '--getWindowElements', nargs='?', const=True, help='Get Window Elements parameters in JSON format')
    group3 = parser.add_argument_group('Is Window Open')
    group3.add_argument('-isWindowOpen', '--isWindowOpen', nargs='?', const=True, help='Check if window is open')
    group4 = parser.add_argument_group('Mouse Click')
    group4.add_argument('-mouseClick', '--mouseClickJsonBody', help='Mouse Click parameters in JSON format')
    group5 = parser.add_argument_group('Wait For Element')
    group5.add_argument('-waitForElement', '--waitForElementJsonBody', help='Wait For Element parameters in JSON format')
    group6 = parser.add_argument_group('Press Keys')
    group6.add_argument('-pressKeys', '--pressKeysJsonArray', help='Press keys in JSON Array format')
    group7 = parser.add_argument_group('Send Keys')
    group7.add_argument('-sendKeys', '--sendKeysJsonBody', help='Send keys parameters in JSON format')
    group8 = parser.add_argument_group('Minimize Window')
    group8.add_argument('-minimizeWindow', '--minimizeWindowLocator', help='Minimize window locator')
    group9 = parser.add_argument_group('Maximize Window')
    group9.add_argument('-maximizeWindow', '--maximizeWindowLocator', help='Maximize window locator')
    group10 = parser.add_argument_group('Close Window')
    group10.add_argument('-closeWindow', '--closeWindowLocator', help='Close window locator')

    return parser.parse_args()

def action_handler():
    args = setup_args()

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

    if args.getWindowElements:
        elements = actions.get_window_elements()
        if not elements: raise ValueError(f"Cannot find window elements")

        for element in elements:
            element.pop('object')

        print(json.dumps(elements))

    if args.mouseClickJsonBody:
        mouse_click_json = json.loads(args.mouseClickJsonBody)

        locator = mouse_click_json.get('locator')
        x = mouse_click_json.get('x')
        y = mouse_click_json.get('y')

        actions.mouse_click(locator, x, y)

    if args.waitForElementJsonBody:
        wait_for_element_json = json.loads(args.waitForElementJsonBody)

        locator = wait_for_element_json.get('locator')
        use_refreshing = wait_for_element_json.get('use_refreshing')
        search_criteria= wait_for_element_json.get('search_criteria')
        timeout= wait_for_element_json.get('timeout')
        interval= wait_for_element_json.get('interval')

        elements = actions.wait_for_element(
            locator,
            use_refreshing,
            search_criteria,
            timeout,
            interval,
        )
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
        interval = send_keys_json.get('interval')
        wait_time = send_keys_json.get('wait_time')
        send_enter = send_keys_json.get('send_enter')

        actions.send_keys(
            locator,
            keys,
            interval,
            wait_time,
            send_enter
        )

    if args.minimizeWindowLocator:
        locator = args.minimizeWindowLocator

        actions.minimize_window(locator)

    if args.maximizeWindowLocator:
        locator = args.maximizeWindowLocator

        actions.maximize_window(locator)

    if args.closeWindowLocator:
        locator = args.closeWindowLocator

        actions.close_window(locator)

if __name__ == '__main__':
    action_handler()
