#!/usr/bin/env bash
mkdir tmp

# create 1000 total files in local tmp directory
# 500 will be named 000.txt     .. 499.txt
# 500 will be named file000.txt .. file499.txt
for i in {0..499}
do
		echo hello > "tmp/$(printf "%03d" "$i").txt"
		echo something > "tmp/file$(printf "%03d" "$i").txt"
done
