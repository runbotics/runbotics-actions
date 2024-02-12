import argparse
from rpaframework.actions import is_dialog_open
from RPA.Desktop.Windows import Windows

win = Windows()

def setup_args():
    parser = argparse.ArgumentParser(description="List of options for RPA Framework actions")

    group1 = parser.add_argument_group('Option 1')
    group2 = parser.add_argument_group('Option 2')

    group1.add_argument("--isDialogOpen", nargs=1, metavar=('title'), help="Title of the dialog to check if it is open")
    group2.add_argument("--testOption", nargs=1, metavar=('message'), help="Message to print")

    return parser.parse_args()

def action_handler():
    args = setup_args()

    if args.isDialogOpen:
        title = args.isDialogOpen[0]

        print("Handling --isDialogOpen...")
        is_dialog_open(title)

    if args.testOption:
        message = args.testOption[0]

        print("Handling --testOption...")
        print("This is test message: ", message)

if __name__ == "__main__":
    action_handler()
