# Video demostrativo

`../Video-Demostrativo-Motorepuestos-del-Oriente.mp4` (3 min 32 s) recorre la app siguiendo el guion de la demo, con subtítulos.

Para regenerarlo (necesita Playwright y ffmpeg):

```bash
node docs/final/video/grabar-video.js "$PWD" /ruta/salida
python3 docs/final/video/subtitulos.py /ruta/salida/subtitulos.json /ruta/salida/subs.ass
ffmpeg -i /ruta/salida/page@*.webm -vf "ass=/ruta/salida/subs.ass" -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 -movflags +faststart -an video.mp4
```
