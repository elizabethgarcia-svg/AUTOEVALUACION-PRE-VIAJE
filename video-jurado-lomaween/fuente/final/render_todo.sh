#!/bin/bash
# Graba el video final en 4 partes en paralelo y las une.
cd "$(dirname "$0")"
T=$(python3 -c "import json; print(json.load(open('timeline.json'))['total'])")
P=$(python3 -c "t=$T; print(' '.join(f'{t*k/4:.4f}' for k in range(5)))")
set -- $P
node render_comp.js parte1.mp4 $1 $2 > log_p1.txt 2>&1 &
node render_comp.js parte2.mp4 $2 $3 > log_p2.txt 2>&1 &
node render_comp.js parte3.mp4 $3 $4 > log_p3.txt 2>&1 &
node render_comp.js parte4.mp4 $4 $5 > log_p4.txt 2>&1 &
wait
printf "file 'parte1.mp4'\nfile 'parte2.mp4'\nfile 'parte3.mp4'\nfile 'parte4.mp4'\n" > partes.txt
ffmpeg -nostdin -v error -y -f concat -safe 0 -i partes.txt -c copy video_mudo.mp4
echo VIDEO_LISTO $(ffprobe -v error -show_entries format=duration -of csv=p=0 video_mudo.mp4)
