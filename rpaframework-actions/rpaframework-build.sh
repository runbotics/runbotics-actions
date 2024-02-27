#!/bin/sh
rm -rf rpaframework-dist;

pyinstaller \
    --clean \
    --noconfirm \
    --log-level=WARN \
    --onefile \
    --nowindow \
    --name=rpaframework-actions \
    --hidden-import=pynput_robocorp.mouse._win32 \
    --hidden-import=pynput_robocorp.keyboard._win32 \
    --icon=./public/icons/runbotics-512x512.png \
    --distpath=./rpaframework-dist \
    ./app/main.py;

rm -rf build;
rm -rf rpaframework-actions.spec;
