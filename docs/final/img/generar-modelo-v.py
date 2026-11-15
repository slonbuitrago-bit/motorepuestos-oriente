import sys
izq=[("Requisitos del cliente","Tarjetas A y B · entrevista"),("Diseño funcional","Casos de uso · 26 historias"),("Diseño técnico","Arquitectura en capas · modelo de datos"),("Diseño de componentes","27 módulos JavaScript")]
der=[("Pruebas de aceptación (UAT)","Criterios de HU-01 a HU-10"),("Pruebas de sistema","23 casos · extremo a extremo"),("Pruebas de integración","10 casos · bottom-up"),("Pruebas unitarias","17 casos · caja blanca")]
W,H,BW,BH,DY,DX,TOP=1000,600,290,76,104,48,64
o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Arial">',
 '<defs><marker id="f" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#333333"/></marker></defs>',
 f'<rect x="0" y="0" width="{W}" height="{H}" fill="#FFFFFF"/>',
 f'<text x="{20+BW/2}" y="34" text-anchor="middle" font-size="18" font-weight="bold" fill="#3B5B92">Desarrollo · verificación</text>',
 f'<text x="{W-20-BW/2}" y="34" text-anchor="middle" font-size="18" font-weight="bold" fill="#2E7D4F">Pruebas · validación</text>']
def caja(x,y,t,s,fill,st):
    o.append(f'<rect x="{x}" y="{y}" width="{BW}" height="{BH}" rx="8" fill="{fill}" stroke="{st}" stroke-width="2"/>')
    o.append(f'<text x="{x+BW/2}" y="{y+32}" text-anchor="middle" font-size="18" font-weight="bold" fill="#1F2937">{t}</text>')
    o.append(f'<text x="{x+BW/2}" y="{y+56}" text-anchor="middle" font-size="15" fill="#374151">{s}</text>')
def flecha(x1,y1,x2,y2,dash=False):
    d=' stroke-dasharray="7 6"' if dash else ''
    o.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#333333" stroke-width="2"{d} marker-end="url(#f)"/>')
L=[(20+i*DX,TOP+i*DY) for i in range(4)]; R=[(W-20-BW-i*DX,TOP+i*DY) for i in range(4)]
vx,vy=(W-BW)/2,TOP+4*DY
for i in range(3):
    flecha(L[i][0]+BW/2,L[i][1]+BH,L[i+1][0]+BW/2,L[i+1][1]-2)
    flecha(R[i+1][0]+BW/2,R[i+1][1],R[i][0]+BW/2,R[i][1]+BH+2)
flecha(L[3][0]+BW/2,L[3][1]+BH,vx+60,vy-2); flecha(vx+BW-60,vy,R[3][0]+BW/2,R[3][1]+BH+2)
for i in range(4):
    x1,x2,y=L[i][0]+BW,R[i][0],L[i][1]+BH/2
    flecha(x1+4,y,x2-4,y,True)
    o.append(f'<text x="{(x1+x2)/2}" y="{y-8}" text-anchor="middle" font-size="14" font-style="italic" fill="#555555">valida</text>')
for i,(t,s) in enumerate(izq): caja(*L[i],t,s,"#E8EEF9","#3B5B92")
for i,(t,s) in enumerate(der): caja(*R[i],t,s,"#E7F4EC","#2E7D4F")
caja(vx,vy,"Codificación","Prototipo evolutivo incremental","#FFF4DC","#B7791F")
o.append('</svg>'); open(sys.argv[1],'w').write('\n'.join(o))
