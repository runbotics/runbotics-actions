#!/bin/sh
mkdir -p ../common/deploy/runbotics-office-actions;
rm -rf dist;

echo "[INFO] runbotics-scheduler - Build started";
rushx build;
echo "[INFO] runbotics-scheduler - Build completed";

echo "[INFO] runbotics-scheduler - Rush deploy started";
rush deploy --scenario runbotics-office-actions --overwrite  --target-folder ../common/deploy/runbotics-office-actions;
echo "[INFO] runbotics-scheduler - Rush deploy completed";
