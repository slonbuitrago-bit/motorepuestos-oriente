#!/usr/bin/env bash
# Genera index.html (página completa) a partir de app.html (fuente que se edita).
# Uso: ./build.sh
set -e
cd "$(dirname "$0")"
{
  printf '<!doctype html>\n<html lang="es-CO">\n<head>\n<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  printf '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%%}[hidden]{display:none!important}</style>\n'
  sed -n '1,/<\/style>/p' app.html
  printf '</head>\n<body>\n'
  sed -n '/<\/style>/,$p' app.html | sed '1d'
  printf '</body>\n</html>\n'
} > index.html
echo "index.html generado"
