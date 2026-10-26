# Acercamiento desde el espacio hasta TROB Loretito (21.99 N, 102.25 O) con la Blue Marble de la NASA.
import numpy as np, cv2, math, sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
D = 'jurado/npm/tg/package/example/'
W, H, FPS, DUR = 1280, 720, 30, 8.6
tierra = cv2.cvtColor(cv2.imread(D + 'img/earth-blue-marble.jpg'), cv2.COLOR_BGR2RGB).astype(np.float32)
nubes = np.array(Image.open(D + 'clouds/clouds.png').convert('RGBA'))[..., 3].astype(np.float32) / 255.0
nubes_suaves = cv2.GaussianBlur(nubes, (0, 0), 5)
cielo = cv2.cvtColor(cv2.imread(D + 'img/night-sky.png'), cv2.COLOR_BGR2RGB)
cielo = cv2.resize(cielo[400:1400, 1000:2800], (W, H), interpolation=cv2.INTER_AREA).astype(np.float32) * 0.55
TH, TW = tierra.shape[:2]
LAT1, LON1 = math.radians(21.99), math.radians(-102.25)
LAT0, LON0 = math.radians(8.0), math.radians(-62.0)
ease = lambda u: u * u * (3 - 2 * u)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
def cuadro(t):
    u = min(1.0, t / 3.4); e = ease(u)
    lat0 = LAT0 + (LAT1 - LAT0) * e; lon0 = LON0 + (LON1 - LON0) * e
    if t < 3.0: R = 210 + 40 * t
    else: R = 330 * math.exp(min(t, 7.0) - 3.0)
    cx, cy = W / 2, H / 2
    nx = (xx - cx) / R; ny = (cy - yy) / R; rho2 = nx * nx + ny * ny; dentro = rho2 < 1
    z = np.sqrt(np.clip(1 - rho2, 0, 1))
    p0 = np.array([math.cos(lat0) * math.cos(lon0), math.cos(lat0) * math.sin(lon0), math.sin(lat0)])
    e_ = np.array([-math.sin(lon0), math.cos(lon0), 0.0]); n_ = np.array([-math.sin(lat0) * math.cos(lon0), -math.sin(lat0) * math.sin(lon0), math.cos(lat0)])
    wx = z * p0[0] + nx * e_[0] + ny * n_[0]; wy = z * p0[1] + nx * e_[1] + ny * n_[1]; wz = z * p0[2] + nx * e_[2] + ny * n_[2]
    lat = np.arcsin(np.clip(wz, -1, 1)); lon = np.arctan2(wy, wx)
    mu = ((lon + math.pi) / (2 * math.pi) * TW).astype(np.float32); mv = ((math.pi / 2 - lat) / math.pi * TH).astype(np.float32)
    img = cv2.remap(tierra, mu, mv, cv2.INTER_CUBIC, borderMode=cv2.BORDER_WRAP)
    # nubes con un poco de desfase (se mueven más lento que el suelo)
    mu2 = ((mu + t * 6) % TW).astype(np.float32)
    nb = cv2.remap(nubes, mu2, mv, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
    nb_g = 0.8 if t < 4.5 else max(0.0, 0.8 - (t - 4.5) * 0.7)
    img = img * (1 - nb[..., None] * nb_g) + 255 * nb[..., None] * nb_g
    # luz: borde más oscuro y un toque de atmósfera
    luz = 0.55 + 0.45 * z
    img = img * luz[..., None]
    out = cielo.copy()
    out[dentro] = img[dentro]
    r = np.sqrt(rho2); glow = np.exp(-np.clip(r - 1, 0, None) * R / 22.0) * (r > 0.985)
    out += glow[..., None] * np.array([90, 150, 255], np.float32) * 0.9
    borde = np.clip((r - 0.93) / 0.07, 0, 1) * dentro
    out = out * (1 - borde[..., None] * 0.35) + borde[..., None] * np.array([120, 170, 255], np.float32) * 0.35
    # ráfaga de nubes hacia la cámara al final
    if t > 5.9:
        k = (t - 5.9) / (DUR - 5.9)
        for capa, (s0, a) in enumerate([(1.0, 0.9), (1.6, 0.8), (2.4, 0.7)]):
            s = s0 * (1 + k * 3.5)
            mapx = ((xx - cx) / (s * 900) + 0.31 + capa * 0.17) * nubes.shape[1]
            mapy = ((yy - cy) / (s * 900) + 0.42 + capa * 0.11) * nubes.shape[0]
            c = cv2.remap(nubes_suaves, mapx.astype(np.float32), mapy.astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
            alpha = np.clip((c - 0.15) * 2.2, 0, 1) * min(1.0, k * 2.0) * a
            tono = 215 + 40 * c
            out = out * (1 - alpha[..., None]) + tono[..., None] * alpha[..., None]
        blanco = max(0.0, (k - 0.6) / 0.4) ** 1.5
        out = out * (1 - blanco) + 255 * blanco
    # nitidez suave y viñeta
    out = np.clip(out, 0, 255)
    bl = cv2.GaussianBlur(out, (0, 0), 1.2); out = np.clip(out * 1.35 - bl * 0.35, 0, 255)
    vig = 1 - 0.35 * (((xx - cx) / cx) ** 2 + ((yy - cy) / cy) ** 2) / 2
    out = out * vig[..., None]
    return np.clip(out, 0, 255).astype(np.uint8)
n = int(DUR * FPS)
for i in range(n):
    f = cuadro(i / FPS)
    cv2.imwrite(f'jurado/muestra/globo/g_{i:04d}.jpg', cv2.cvtColor(f, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 90])
print('listo', n)
