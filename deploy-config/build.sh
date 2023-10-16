#!/bin/sh

pnpm add winax@file:../winax \
    --ignore-scripts && \
pnpm install --ignore-scripts && cd ..
