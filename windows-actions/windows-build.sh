#!/bin/sh
rm -rf windows-dist;

pyinstaller \
    --clean \
    --noconfirm \
    --log-level=WARN \
    --onefile \
    --nowindow \
    --name=windows-actions \
    --hidden-import=pynput_robocorp.mouse._win32 \
    --hidden-import=pynput_robocorp.keyboard._win32 \
    --icon=./public/icons/runbotics-512x512.png \
    --distpath=./windows-dist \
    ./app/main.py;

rm -rf build;
rm -rf windows-actions.spec;
