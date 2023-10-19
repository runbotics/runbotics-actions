#!/bin/sh
mkdir -p ../common/deploy/sap-actions;
rm -rf dist;

echo "[INFO] sap actions - Build started";
rushx build;
echo "[INFO] sap actions - Build completed";

echo "[INFO] sap actions - Rush deploy started";
rush deploy --overwrite \
    --target-folder ../common/deploy/sap-actions \
    --scenario sap-actions;
echo "[INFO] sap actions - Rush deploy completed";
