# Pasa timeline.json a timeline.js para la página, con cuántos cuadros tiene de verdad cada toma.
import json, os
TL = json.load(open('timeline.json'))
def carpeta(tm):
    k = f"{tm['src'].replace(':', '-')}_{tm['ini']}_{tm['fin']}_v{tm['vel']}_r{tm.get('rot', 0)}_{tm['grade']}"
    return os.path.join('frames', k.replace(',', '_'))
for t in TL['tomas']:
    d = carpeta(t); t['dir'] = d
    t['nf'] = len([f for f in os.listdir(d) if f.startswith('f_')]) if os.path.isdir(d) else 0
open('timeline.js', 'w').write('const TL = ' + json.dumps(TL, ensure_ascii=False) + ';\n')
print('ok', len(TL['tomas']))
