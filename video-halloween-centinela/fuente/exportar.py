# timeline + envolvente de voz por cuadro (30 fps) -> datos.js para la animación
import json, numpy as np, soundfile as sf
tl = json.load(open('timeline.json'))
v, sr = sf.read('voz44.wav')
fps = 30; n = int(tl['total'] * fps) + 1; hop = sr // fps
env = [float(np.sqrt(np.mean(v[i*hop:(i+1)*hop]**2))) if i*hop < len(v) else 0 for i in range(n)]
m = np.percentile([e for e in env if e > 1e-4], 95)
tl['env'] = [round(min(1, e / m), 3) for e in env]
open('datos.js', 'w').write('const TL = ' + json.dumps(tl, ensure_ascii=False) + ';')
print(len(tl['env']), 'cuadros')
