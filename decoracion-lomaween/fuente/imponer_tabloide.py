# Acomoda las hojas carta de los letreros de carretera, los letreros de monitor y las lápidas de dos en dos
# en tabloides (11 × 17 in = dos cartas), al 100 %: nada cambia de tamaño. Agrega la línea de corte entre las dos.
import io, sys
from pypdf import PdfReader, PdfWriter, Transformation, PageObject
from reportlab.pdfgen import canvas

IMP = sys.argv[1] if len(sys.argv) > 1 else '../../../home/user/AUTOEVALUACION-PRE-VIAJE/decoracion-lomaween/imprimir/'
CW, CH = 612, 792          # carta vertical, en puntos
lap = PdfReader(IMP + 'Lapidas_Prevencion.pdf')
sen = PdfReader(IMP + 'Letreros_Carretera.pdf')
mon = PdfReader(IMP + 'Letreros_Monitores.pdf')
MON = ['A · ZONA DE RESTRICCIÓN', 'B · ZONA SIN COBERTURA', 'C · ESTATUS AL CLIENTE', 'D · PARADA NO AUTORIZADA']

# cada tabloide: (horizontal, [(pdf, página, x, y)], letrero de arriba, letrero de la línea de corte)
hojas = []
for k in range(4):   # lápidas: dos cartas verticales lado a lado → tabloide horizontal
    hojas.append((True, [(lap, 2 * k, 0, 0), (lap, 2 * k + 1, CW, 0)], f'LÁPIDAS · TABLOIDE {k + 1} DE 4', 'CORTA AQUÍ PARA SEPARAR LAS DOS LÁPIDAS'))
hojas.append((True, [(sen, 0, 0, 0), (sen, 5, CW, 0)], 'LETREROS DE CARRETERA · TABLOIDE 1 DE 3 · KM 57 Y CRUCE DE ÁNIMAS', 'CORTA AQUÍ PARA SEPARAR LOS DOS LETREROS'))
hojas.append((False, [(sen, 1, 0, CW), (sen, 2, 0, 0)], 'LETREROS DE CARRETERA · TABLOIDE 2 DE 3 · PLACAS DE AGUASCALIENTES Y SALTILLO', 'CORTA AQUÍ PARA SEPARAR LAS DOS PLACAS'))
hojas.append((False, [(sen, 3, 0, CW), (sen, 4, 0, 0)], 'LETREROS DE CARRETERA · TABLOIDE 3 DE 3 · PARADOR Y DESTINOS', 'CORTA AQUÍ PARA SEPARAR LOS DOS LETREROS'))
for k in range(4):   # letreros de monitor: las dos mitades de cada uno, una arriba de la otra → tabloide vertical
    hojas.append((False, [(mon, 2 * k, 0, CW), (mon, 2 * k + 1, 0, 0)], f'LETRERO DE MONITOR {MON[k]} · TABLOIDE {k + 1} DE 4',
                  'CORTA AQUÍ: ARRIBA LA HOJA 1 Y ABAJO LA HOJA 2 DEL MISMO LETRERO; LUEGO EMPÁLMALAS'))

def marcas(horiz, arriba, corte, total, n):
    W, H = (2 * CW, CH) if horiz else (CH, 2 * CW)
    b = io.BytesIO(); c = canvas.Canvas(b, pagesize=(W, H))
    c.setStrokeColorRGB(.45, .45, .45); c.setFillColorRGB(.45, .45, .45); c.setLineWidth(.8); c.setDash(5, 4)
    if horiz:
        c.line(W / 2, 0, W / 2, H)
        c.saveState(); c.translate(W / 2 - 3, H / 2); c.rotate(90); c.setFont('Helvetica-Bold', 6.5); c.drawCentredString(0, 0, corte); c.restoreState()
    else:
        c.line(0, H / 2, W, H / 2); c.setFont('Helvetica-Bold', 6.5); c.drawCentredString(W / 2, H / 2 + 4, corte)
    c.setFont('Helvetica-Bold', 7); c.drawString(16, H - 11, arriba)
    c.drawRightString(W - 16, H - 11, f'HOJA {n} DE {total} · IMPRIMIR EN TABLOIDE AL 100 % (TAMAÑO REAL)')
    c.save(); b.seek(0)
    return PdfReader(b).pages[0]

out = PdfWriter()
for n, (horiz, piezas, arriba, corte) in enumerate(hojas, 1):
    W, H = (2 * CW, CH) if horiz else (CH, 2 * CW)
    hoja = PageObject.create_blank_page(width=W, height=H)
    for pdf, i, x, y in piezas:
        src = pdf.pages[i]
        assert (float(src.mediabox.width), float(src.mediabox.height)) == ((CW, CH) if horiz else (CH, CW)), (arriba, i, src.mediabox)
        hoja.merge_transformed_page(src, Transformation().translate(x, y))
    hoja.merge_page(marcas(horiz, arriba, corte, len(hojas), n))
    out.add_page(hoja)
out.compress_identical_objects()
with open('Letreros_y_Lapidas_Tabloide.pdf', 'wb') as f: out.write(f)
print(len(hojas), 'tabloides')
