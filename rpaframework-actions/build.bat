pyinstaller ^
    --clean ^
    --noconfirm ^
    --log-level=WARN ^
    --onefile ^
    --nowindow ^
    --name=runner ^
    --hidden-import=pynput_robocorp.mouse._win32 ^
    --hidden-import=pynput_robocorp.keyboard._win32 ^
    --icon=./public/icons/runbotics-512x512.png ^
    main.py
