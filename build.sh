#!/usr/bin/env bash
# Construye las dos salidas del proyecto a partir de app.html + css/ + js/:
#   index.html                        versión modular (GitHub Pages, desarrollo)
#   dist/motorepuestos-oriente.html   un solo archivo autocontenido (WhatsApp, sin internet)
# Uso: ./build.sh
set -e
cd "$(dirname "$0")"
HEAD='<!doctype html>
<html lang="es-CO">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>'

# 1) index.html: el contenido de app.html dentro de un documento completo
{ echo "$HEAD"; sed -n '1,/css\/estilos.css/p' app.html; echo '</head>'; echo '<body>'; sed -n '/css\/estilos.css/,$p' app.html | sed '1d'; echo '</body>'; echo '</html>'; } > index.html

# 2) dist: se reemplaza cada <link>/<script src> local por su contenido
mkdir -p dist
python3 - "$HEAD" <<'PY'
import re, sys
head = sys.argv[1]
src = open('index.html', encoding='utf-8').read()
src = src.replace('<link rel="stylesheet" href="css/estilos.css">', '<style>\n' + open('css/estilos.css', encoding='utf-8').read() + '</style>')
src = re.sub(r'<script src="(js/[^"]+)"></script>', lambda m: '<script>\n' + open(m.group(1), encoding='utf-8').read() + '</script>', src)
import base64, mimetypes
src = re.sub(r'(src|href)="(img/[^"]+)"', lambda m: m.group(1) + '="data:' + (mimetypes.guess_type(m.group(2))[0] or 'image/png') + ';base64,' + base64.b64encode(open(m.group(2), 'rb').read()).decode() + '"', src)
open('dist/motorepuestos-oriente.html', 'w', encoding='utf-8').write(src)
PY
echo "Generados: index.html y dist/motorepuestos-oriente.html"
