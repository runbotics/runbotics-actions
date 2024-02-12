from RPA.Desktop.Windows import Windows

win = Windows()

def is_dialog_open(title: str):
    windows = win.get_window_list()

    is_dialog_open = False

    for window in windows:
        window_title = window.get('title')
        if (window_title == title):
            is_dialog_open = True

    print(is_dialog_open)
