# Saca los cuadros de cada toma del timeline (1920x1080, 30 fps) en frames/<id>/: clips con color parejo, animaciones, el 877 y fotos.
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
D = os.path.dirname(os.path.abspath(__file__))
B = '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/jurado_clips/'
mapa = dict(l.split() for l in open(B + 'mapa.txt'))
TL = json.load(open(os.path.join(D, 'timeline.json')))
solo = set(sys.argv[1].split(',')) if len(sys.argv) > 1 else None

def luz(clip, a, b):
    """Brillo medio (0–1) de tres cuadros del tramo, para emparejar la exposición entre tomas."""
    vals = []
    for k in (.2, .5, .8):
        r = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-ss', str(a + (b - a) * k), '-i', clip, '-frames:v', '1', '-vf', 'scale=160:90,format=gray', '-f', 'rawvideo', '-'], capture_output=True)
        if r.stdout: vals.append(sum(r.stdout) / len(r.stdout) / 255)
    return sum(vals) / len(vals) if vals else .45

def tamano(f):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f], capture_output=True, text=True)
    return tuple(map(int, r.stdout.strip().split(',')[:2]))

GENERADAS = ('vhs', 'fin', 'logo', 'titulo', 'resumen', 'obj1', 'obj2', 'obj3')
def carpeta(tm):
    """Carpeta de cuadros según lo que es la toma (no su lugar en la lista), para reutilizarla si no cambia."""
    k = f"{tm['src'].replace(':', '-')}_{tm['ini']}_{tm['fin']}_v{tm['vel']}_r{tm.get('rot', 0)}_{tm['grade']}"
    return os.path.join(D, 'frames', k.replace(',', '_'))

def sacar(tm):
    if tm['src'] in GENERADAS: return tm['id'], 'generada'
    out = carpeta(tm); os.makedirs(out, exist_ok=True)
    n = round(tm['dur'] * 30)
    if len([f for f in os.listdir(out) if f.startswith('f_')]) >= n: return tm['id'], 'ya'
    src, a, b = tm['src'], tm['ini'], tm['fin']
    jpg = ['-q:v', '2', '-frames:v', str(n), os.path.join(out, 'f_%05d.jpg')]
    if src.startswith('anim_'):
        cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(a), '-i', os.path.join(D, src + '.mp4'), '-vf', 'fps=30'] + jpg
    elif src == '877':
        cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(a), '-i', TL['tv877'], '-vf', 'fps=30,scale=1920:1080'] + jpg
    elif src.startswith('foto:'):
        f = os.path.join(B, 'fotos', src[5:] + '.jpg')
        w, h = tamano(f); rc = (tm.get('datos') or {}).get('recorte')
        rec = f'crop={rc[2]}:{rc[3]}:{rc[0]}:{rc[1]},' if rc else ''
        if rc: w, h = rc[2], rc[3]
        if 1.6 <= w / h <= 1.95:  # casi 16:9: llena la pantalla
            vf = f'{rec}scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,eq=contrast=1.04:saturation=1.06'
            cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', f, '-vf', vf]
        else:  # vertical o muy panorámica: completa, sobre la misma foto desenfocada
            vf = (f'[0:v]{rec}split[a][b];[a]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=30:3,eq=brightness=-.15[f];'
                  f'[b]scale=1920:1080:force_original_aspect_ratio=decrease:flags=lanczos,eq=contrast=1.04:saturation=1.06[c];[f][c]overlay=(W-w)/2:(H-h)/2')
            cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', f, '-filter_complex', vf]
        cmd += ['-q:v', '2', '-frames:v', '1', os.path.join(out, 'f_00001.jpg')]
    else:
        clip = os.path.join(os.path.dirname(B.rstrip('/')), 'jurado', 'material', src[4:] + '.mp4') if src.startswith('mat:') else B + 'raw/' + mapa[src]
        br, co, sa, te = map(float, tm['grade'].split(','))
        br += max(-.07, min(.07, (.47 - luz(clip, a, b)) * .55))  # acerca cada toma a la misma exposición
        pre = ('transpose=2,' if tm.get('rot') == -90 else '') + (f"setpts=PTS/{tm['vel']}," if tm['vel'] != 1 else '')
        grade = (f'hqdn3d=1.5:1.5:4:4,eq=brightness={br:.3f}:contrast={co}:saturation={sa},'
                 f'colorbalance=rs={.05 * te:.3f}:bs={-.05 * te:.3f}:rm={.03 * te:.3f}:bm={-.03 * te:.3f}')
        w, h = tamano(clip)
        if tm.get('rot') or h > w:  # vertical: al centro, con el mismo cuadro desenfocado de fondo
            vf = (f'[0:v]{pre}fps=30,{grade},split[a][b];[a]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=30:3,eq=brightness=-.12[f];'
                  f'[b]scale=-2:1080:flags=lanczos,cas=.4[c];[f][c]overlay=(W-w)/2:0')
            cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(a), '-i', clip, '-filter_complex', vf] + jpg
        else:
            vf = f'{pre}fps=30,{grade},scale=1920:1080:flags=lanczos,cas=0.5'
            cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(a), '-i', clip, '-vf', vf] + jpg
    subprocess.run(cmd, check=True)
    return tm['id'], len([f for f in os.listdir(out) if f.startswith('f_')])

tareas = [tm for tm in TL['tomas'] if not solo or tm['id'] in solo]
with ThreadPoolExecutor(4) as ex:
    for r in ex.map(sacar, tareas): print(*r, flush=True)
