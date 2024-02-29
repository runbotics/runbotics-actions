#!/bin/sh
mkdir -p ../common/deploy/windows-actions;
rm -rf dist;

echo "[INFO] windows actions - Build started";
rushx build;
echo "[INFO] windows actions - Build completed";

echo "[INFO] windows actions - Rush deploy started";
rush deploy --overwrite \
    --target-folder ../common/deploy/windows-actions \
    --scenario windows-actions;
echo "[INFO] windows actions - Rush deploy completed";
