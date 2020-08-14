#!/bin/bash

mkdir -p zip
rm zip/*

echo Creating new zip...
zip -j -9 zip/game app/*
echo Finished.
echo Zip size: `stat --format="%s bytes" zip/game.zip`
echo 13Kb = 13,312 bytes
