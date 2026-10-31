#!/bin/bash
# Versión 3: la parte de antes de la toma de Ricardo no cambió (cuadros 0–4686); se recodifica de la versión 2
# y se renderiza de nuevo solo de ahí al final, en 4 partes, para unir todo sin perder un cuadro.
cd "$(dirname "$0")"
read a b c d e <<< $(python3 -c "
import json
t=json.load(open('timeline.json'))['total']; s=4687; n=round(t*30)
print(' '.join(f'{(s+round((n-s)*k/4))/30:.6f}' for k in range(5)))")
node render_comp.js parte1.mp4 $a $b > log_p1.txt 2>&1 &
node render_comp.js parte2.mp4 $b $c > log_p2.txt 2>&1 &
node render_comp.js parte3.mp4 $c $d > log_p3.txt 2>&1 &
node render_comp.js parte4.mp4 $d $e > log_p4.txt 2>&1 &
ffmpeg -nostdin -v error -y -i video_mudo_v2.mp4 -vf "trim=end_frame=4687,setpts=PTS-STARTPTS" -c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p cabeza.mp4
wait
printf "file 'cabeza.mp4'\nfile 'parte1.mp4'\nfile 'parte2.mp4'\nfile 'parte3.mp4'\nfile 'parte4.mp4'\n" > partes.txt
ffmpeg -nostdin -v error -y -f concat -safe 0 -i partes.txt -c copy video_mudo.mp4
echo VIDEO_LISTO $(ffprobe -v error -count_packets -show_entries stream=nb_read_packets -of csv=p=0 video_mudo.mp4)
