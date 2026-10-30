# Pasa timeline.json a timeline.js para la página, con cuántos cuadros tiene de verdad cada toma.
import json, os
TL = json.load(open('timeline.json'))
for t in TL['tomas']:
    d = os.path.join('frames', t['id'])
    t['nf'] = len([f for f in os.listdir(d) if f.startswith('f_')]) if os.path.isdir(d) else 0
open('timeline.js', 'w').write('const TL = ' + json.dumps(TL, ensure_ascii=False) + ';\n')
print('ok', len(TL['tomas']))
