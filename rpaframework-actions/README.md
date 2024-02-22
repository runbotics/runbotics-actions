## Description

The `rpa-framework-actions` is mini lib to be able to run `rpaframework` using nodejs

- using python to use the `rpaframework` package
- run `.exe` to run specific action
- using `argparse` to be able to pass options and arguments

[RPA Framework - Docs](https://rpaframework.org/)

## Project setup

```bash
# setup virtual environment (Windows)
# create .venv
python -m venv .venv
# activate virtual environment (cmd)
activate.bat


# install dependencies (from activated environment)
pip install -r requirements.txt


# in another cmd run to build executables
# before you run, you need to install pyinstaller with custom bootloader
build.bat


# run
py <main_file_name> <options>
```
