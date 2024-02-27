#!/bin/sh
mkdir -p ../common/deploy/rpaframework-actions;
rm -rf dist;

echo "[INFO] rpaframework actions - Build started";
rushx build;
echo "[INFO] rpaframework actions - Build completed";

echo "[INFO] rpaframework actions - Rush deploy started";
rush deploy --overwrite \
    --target-folder ../common/deploy/rpaframework-actions \
    --scenario rpaframework-actions;
echo "[INFO] rpaframework actions - Rush deploy completed";
