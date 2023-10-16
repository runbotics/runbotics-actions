#!/bin/sh
cd ../winax &&
pnpm install &&
cd ../sap-actions &&
pnpm add winax@file:../winax \
    --ignore-scripts && \
pnpm install --ignore-scripts && cd ..
