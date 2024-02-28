import RPA.Desktop.Windows as desktop_windows
import RPA.Windows as windows
import RPA.Desktop as desktop

desk_win = desktop_windows.Windows()
win = windows.Windows()
desk = desktop.Desktop()

def is_window_open(title: str):
    windows = win.list_windows()
    is_open = False

    for window in windows:
        window_title = window.get('title')
        if (window_title == title):
            is_open = True

    return is_open

def get_pid_by_window_title(title: str):
    windows = win.list_windows()

    for window in windows:
        window_title = window.get('title')
        if (window_title == title):
            return int(window.get('pid'))

    return None

def connect_by_pid(app_pid: str, window_title: str = None):
    return desk_win.connect_by_pid(app_pid, window_title)

def get_element(locator: str):
    return win.get_element(locator)

def list_windows():
    return win.list_windows()

def mouse_click(
    locator: str,
):
    desk_win.mouse_click(locator)

def wait_for_element(
    locator: str,
):
    return desk_win.wait_for_element(
        locator,
        timeout=10.0
    )

def press_keys(keys: list[str]):
    keys_to_press = [key for key in keys if key is not None]
    desk.press_keys(*keys_to_press)

def send_keys(
    locator: str | None,
    keys: str | None,
    send_enter: bool | None
):
    if send_enter is None: send_enter = False

    win.send_keys(
        locator,
        keys,
        send_enter=send_enter
    )

def minimize_window(locator: str):
    return win.minimize_window(locator)

def maximize_window(locator: str):
    return win.maximize_window(locator)
