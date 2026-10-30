#!/bin/bash
# Une imagen y sonido: versión para la tele (1080p, menos de 100 MB para que quepa en el repositorio) y versión para WhatsApp.
cd "$(dirname "$0")"
TV=La57_de_las_Animas_Video_Jurado_1080p.mp4; WA=La57_de_las_Animas_Video_Jurado_WhatsApp.mp4
ffmpeg -nostdin -v error -y -i video_mudo.mp4 -c:v libx264 -preset slow -b:v 2500k -maxrate 4500k -bufsize 9000k -pass 1 -passlogfile pase -an -f null /dev/null
ffmpeg -nostdin -v error -y -i video_mudo.mp4 -i mezcla_master.wav -map 0:v -map 1:a -c:v libx264 -preset slow -b:v 2500k -maxrate 4500k -bufsize 9000k -pass 2 -passlogfile pase \
  -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart $TV
ffmpeg -nostdin -v error -y -i video_mudo.mp4 -i mezcla_master.wav -map 0:v -map 1:a -vf scale=960:540:flags=lanczos -c:v libx264 -preset slow -b:v 360k -pix_fmt yuv420p \
  -c:a aac -b:a 96k -shortest -movflags +faststart $WA
ls -la $TV $WA
