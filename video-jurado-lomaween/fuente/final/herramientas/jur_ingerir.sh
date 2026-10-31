#!/bin/bash
# Copia los videos nuevos del jurado, los numera por hora y saca audio + tira de 4 cuadros.
S=/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/jurado_clips; U=/root/.claude/uploads/b599cfc6-b7b2-58da-82fa-6d7dac97df15
cp --update=none $U/*Video_2026-10-3* $S/raw/
cd $S/raw; i=$(wc -l < $S/mapa.txt)
for f in $(ls | python3 -c "
import sys,re
fs=sys.stdin.read().split()
done=set(l.split()[1] for l in open('$S/mapa.txt'))
def k(f):
    m=re.search(r'(\d{4}-\d\d-\d\d)_at_(\d+)\.(\d+)\.(\d+)_(AM|PM)(?:_(\d))?',f); return (m[1],int(m[2])%12+(12 if m[5]=='PM' else 0),int(m[3]),int(m[4]),int(m[6]) if m[6] else -1)
print('\n'.join(sorted([f for f in fs if f not in done],key=k)))"); do
  i=$((i+1)); n=$(printf "c%02d" $i); echo "$n $f" >> $S/mapa.txt
  ffmpeg -nostdin -v error -y -i "$f" -ac 1 -ar 16000 $S/wav2/$n.wav
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" </dev/null)
  for k in 1 2 3 4; do t=$(python3 -c "print($d*($k-0.5)/4)"); ffmpeg -nostdin -v error -y -ss $t -i "$f" -frames:v 1 -vf "scale=240:-1" $S/tri/${n}_$k.jpg; done
  ffmpeg -nostdin -v error -y -i $S/tri/${n}_1.jpg -i $S/tri/${n}_2.jpg -i $S/tri/${n}_3.jpg -i $S/tri/${n}_4.jpg -filter_complex "hstack=4,drawtext=text='$n ($(printf %.0f $d)s)':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.7" $S/tri/${n}.jpg
  echo "$n $d $f"
done
