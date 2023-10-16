#!/bin/sh
mkdir -p ../common/deploy/office-actions;
rm -rf dist;

echo "[INFO] office actions - Build started";
rushx build;
echo "[INFO] office actions - Build completed";

echo "[INFO] office actions - Rush deploy started";
rush deploy --overwrite \
    --target-folder ../common/deploy/office-actions \
    --scenario office-actions;
echo "[INFO] office actions - Rush deploy completed";
