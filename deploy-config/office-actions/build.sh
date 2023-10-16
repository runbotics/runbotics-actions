#!/bin/sh
cd ../winax &&
pnpm install &&
cd ../office-actions &&
pnpm add winax@file:../winax \
    --ignore-scripts && \
pnpm install --ignore-scripts && cd ..
