# Arma el archivo completo para imprimir todo en tabloide (11 × 17 in = dos cartas), al 100 %:
# - el tracto y los letreros de Destinos y Parador, que ya vienen hechos en tabloide, entran completos;
# - las hojas carta (lápidas, letreros, monitores, carretera del mantel y lotería) van de dos en dos, sin cambiar de tamaño,
#   con la línea de corte entre las dos.
import io, sys
from pypdf import PdfReader, PdfWriter, Transformation, PageObject
from reportlab.pdfgen import canvas

IMP = sys.argv[1]            # carpeta imprimir/ del repositorio
LOT = sys.argv[2]            # la lotería, en la carpeta del video
CW, CH = 612, 792            # carta vertical, en puntos
tra = PdfReader(IMP + 'Tracto_Tabloide.pdf')
lap = PdfReader(IMP + 'Lapidas_Prevencion.pdf')
sen = PdfReader(IMP + 'Letreros_Carretera.pdf')
gra = PdfReader('Letreros_Destinos_Parador_Grandes.pdf')
mon = PdfReader(IMP + 'Letreros_Monitores.pdf')
car = PdfReader(IMP + 'Carretera_Mantel.pdf')
lot = PdfReader(LOT)
MON = ['A · ZONA DE RESTRICCIÓN', 'B · ZONA SIN COBERTURA', 'C · ESTATUS AL CLIENTE', 'D · PARADA NO AUTORIZADA']

# cada tabloide: (horizontal, [(pdf, página, x, y)], letrero de arriba, letrero de la línea de corte, ¿número a la derecha?)
H2 = lambda a, b: [(a[0], a[1], 0, 0), (b[0], b[1], CW, 0)]      # dos cartas verticales lado a lado
V2 = lambda a, b: [(a[0], a[1], 0, CW), (b[0], b[1], 0, 0)]      # dos cartas horizontales, una arriba de la otra
hojas = []
for i in range(6): hojas.append((i >= 4, [(tra, i, 0, 0)], None, None, False))                  # el tracto, tal cual
for k in range(4): hojas.append((True, H2((lap, 2 * k), (lap, 2 * k + 1)), f'LÁPIDAS · TABLOIDE {k + 1} DE 4', 'CORTA AQUÍ PARA SEPARAR LAS DOS LÁPIDAS', True))
hojas.append((True, H2((sen, 0), (sen, 5)), 'LETREROS DE CARRETERA · KM 57 Y CRUCE DE ÁNIMAS', 'CORTA AQUÍ PARA SEPARAR LOS DOS LETREROS', True))
hojas.append((False, V2((sen, 1), (sen, 2)), 'LETREROS DE CARRETERA · PLACAS DE AGUASCALIENTES Y SALTILLO', 'CORTA AQUÍ PARA SEPARAR LAS DOS PLACAS', True))
hojas.append((True, [(gra, 0, 0, 0)], 'LETREROS DE CARRETERA · DESTINOS (VERDE), EN GRANDE', None, True))
hojas.append((True, [(gra, 1, 0, 0)], 'LETREROS DE CARRETERA · PARADOR CENTINELA (AZUL), EN GRANDE', None, True))
for k in range(4): hojas.append((False, V2((mon, 2 * k), (mon, 2 * k + 1)), f'LETRERO DE MONITOR {MON[k]}', 'CORTA AQUÍ: ARRIBA LA HOJA 1 Y ABAJO LA HOJA 2 DEL MISMO LETRERO; LUEGO EMPÁLMALAS', True))
for k in range(3): hojas.append((False, V2((car, 2 * k), (car, 2 * k + 1)), f'CARRETERA DEL MANTEL · HOJAS {2 * k + 1} Y {2 * k + 2} DE 6',
                                 'CORTA AQUÍ Y PON LAS 6 HOJAS UNA JUNTO A LA OTRA, EN ORDEN', False))
for k in range(2): hojas.append((True, H2((lot, 2 * k), (lot, 2 * k + 1)), f'LOTERÍA CENTINELA · TABLOIDE {k + 1} DE 2', 'CORTA AQUÍ PARA SEPARAR LAS DOS HOJAS', True))

def marcas(horiz, arriba, corte, derecha, total, n):
    W, H = (2 * CW, CH) if horiz else (CH, 2 * CW)
    b = io.BytesIO(); c = canvas.Canvas(b, pagesize=(W, H))
    c.setStrokeColorRGB(.45, .45, .45); c.setFillColorRGB(.45, .45, .45); c.setLineWidth(.8); c.setDash(5, 4)
    if corte and horiz:
        c.line(W / 2, 0, W / 2, H)
        c.saveState(); c.translate(W / 2 - 3, H / 2); c.rotate(90); c.setFont('Helvetica-Bold', 6.5); c.drawCentredString(0, 0, corte); c.restoreState()
    elif corte:
        c.line(0, H / 2, W, H / 2); c.setFont('Helvetica-Bold', 6.5); c.drawCentredString(W / 2, H / 2 + 4, corte)
    c.setFont('Helvetica-Bold', 7); c.drawString(16, H - 11, f'{n}/{total} · {arriba}')
    if derecha: c.drawRightString(W - 16, H - 11, 'IMPRIMIR EN TABLOIDE AL 100 % (TAMAÑO REAL)')
    c.save(); b.seek(0)
    return PdfReader(b).pages[0]

out = PdfWriter()
for n, (horiz, piezas, arriba, corte, derecha) in enumerate(hojas, 1):
    W, H = (2 * CW, CH) if horiz else (CH, 2 * CW)
    hoja = PageObject.create_blank_page(width=W, height=H)
    for pdf, i, x, y in piezas:
        src = pdf.pages[i]; w, h = float(src.mediabox.width), float(src.mediabox.height)
        assert (w, h) == ((W, H) if len(piezas) == 1 else (CW, CH) if horiz else (CH, CW)), (arriba, i, w, h)
        hoja.merge_transformed_page(src, Transformation().translate(x, y))
    if arriba: hoja.merge_page(marcas(horiz, arriba, corte, derecha, len(hojas), n))
    out.add_page(hoja)
out.compress_identical_objects()
with open('Impresion_Tabloide_Completa.pdf', 'wb') as f: out.write(f)
print(len(hojas), 'tabloides')
