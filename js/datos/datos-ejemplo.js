"use strict";
/* Motorepuestos del Oriente
   Capa de datos · Generación de datos de ejemplo (productos, clientes, municipios DANE, historial de 6 meses). */

function seed(){
  const now = new Date();
  const R = rng(20261103);
  const pick = a => a[Math.floor(R() * a.length)];
  const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
  const db = {
    version: 6, creado: now.toISOString(), seq:{}, audit:[], pedidos:[], correos:[], bloqueos:{}, kardex:[], novedades:[], certificados:[], remisiones:[], facturas:[], importaciones:[],
    empresa:{ nombre:"Motorepuestos del Oriente S.A.S.", nit:"901.482.315-7", ciudad:"Rionegro, Antioquia", resolucion:"Resolución DIAN 18764000001234 (simulada) · Prefijo MRO · Rango 1 a 50.000 · Vigencia 2026-2027" },
    roles: JSON.parse(JSON.stringify(ROLES_BASE)),
    usuarios:[
      { id:"U1", nombre:"Laura Gómez",     usuario:"lgomez",    rol:"Administrador", sucursalId:"S1", activo:true },
      { id:"U2", nombre:"Andrés Restrepo", usuario:"arestrepo", rol:"Gerente",       sucursalId:"S1", activo:true },
      { id:"U3", nombre:"Camila Ospina",   usuario:"cospina",   rol:"Logística",     sucursalId:"S1", activo:true },
      { id:"U4", nombre:"Julián Zuluaga",  usuario:"jzuluaga",  rol:"Despachos",     sucursalId:"S1", activo:true },
      { id:"U5", nombre:"Diana Marín",     usuario:"dmarin",    rol:"Bodega",        sucursalId:"S1", activo:true },
      { id:"U6", nombre:"Mateo Ríos",      usuario:"mrios",     rol:"Auditor",       sucursalId:"S1", activo:true },
      { id:"U7", nombre:"Sara Henao",      usuario:"shenao",    rol:"Logística",     sucursalId:"S3", activo:true }
    ],
    paises:[ { id:"CO", nombre:"Colombia" }, { id:"PA", nombre:"Panamá" } ],
    estados:[ { id:"05", paisId:"CO", nombre:"Antioquia" }, { id:"11", paisId:"CO", nombre:"Bogotá D.C." }, { id:"17", paisId:"CO", nombre:"Caldas" }, { id:"25", paisId:"CO", nombre:"Cundinamarca" }, { id:"COL", paisId:"PA", nombre:"Colón" }, { id:"PAN", paisId:"PA", nombre:"Panamá" } ],
    ciudades:[
      { id:"05615", estadoId:"05", nombre:"Rionegro" }, { id:"05440", estadoId:"05", nombre:"Marinilla" }, { id:"05376", estadoId:"05", nombre:"La Ceja" },
      { id:"05148", estadoId:"05", nombre:"El Carmen de Viboral" }, { id:"05318", estadoId:"05", nombre:"Guarne" }, { id:"05697", estadoId:"05", nombre:"El Santuario" },
      { id:"05756", estadoId:"05", nombre:"Sonsón" }, { id:"05001", estadoId:"05", nombre:"Medellín" }, { id:"05607", estadoId:"05", nombre:"El Retiro" }, { id:"05674", estadoId:"05", nombre:"San Vicente Ferrer" },
      { id:"11001", estadoId:"11", nombre:"Bogotá D.C." }, { id:"25754", estadoId:"25", nombre:"Soacha" }, { id:"17001", estadoId:"17", nombre:"Manizales" },
      { id:"PA-301", estadoId:"COL", nombre:"Colón (Zona Libre)" }, { id:"PA-801", estadoId:"PAN", nombre:"Ciudad de Panamá" }
    ],
    sucursales:[
      { id:"S1", nombre:"Rionegro · Bodega principal", ciudadId:"05615", direccion:"Cra. 50 # 49-20, Centro" },
      { id:"S2", nombre:"Marinilla",                   ciudadId:"05440", direccion:"Calle 30 # 29-14" },
      { id:"S3", nombre:"La Ceja",                     ciudadId:"05376", direccion:"Cra. 20 # 19-55" }
    ],
    transportadoras:["Flota propia","Coordinadora","Servientrega","Envía","Interrapidísimo"],
    proveedores:[ { id:"P1", nombre:"Istmo Moto Parts S.A.", pais:"Panamá", ciudad:"Colón (Zona Libre)", convenioDesde:"2014-03-01", contacto:"compras@istmomotoparts.example" } ],
    productos:[], clientes:[]
  };
  const prods = [
    ["BUJ-CR7HSA","Bujía NGK CR7HSA","Honda CB110, Yamaha Crypton","Eléctrico",8500,14000,40,[120,35,30],"Importado",6],
    ["PAS-FA196","Pastillas de freno delanteras FA196","Pulsar NS200, Discover 125","Frenos",22000,38000,25,[80,20,18],"Importado",6],
    ["CAD-428H-118","Cadena 428H 118 eslabones","Motos 125–150 cc","Transmisión",39000,62000,20,[60,14,9],"Importado",6],
    ["KIT-ARR-1443","Kit de arrastre 14T/43T","AKT NKD 125","Transmisión",92000,145000,10,[9,2,1],"Importado",6],
    ["LLA-275-18","Llanta 2.75-18 uso mixto","Boxer CT100, AKT 125","Llantas",88000,135000,12,[40,10,4],"Nacional",12],
    ["FIL-HF113","Filtro de aceite HF113","Honda CB190R, XR150L","Lubricación",9800,18000,30,[95,22,25],"Importado",3],
    ["BAT-12N5","Batería 12N5-3B 12 V 5 Ah","Yamaha YBR125","Eléctrico",76000,118000,8,[18,5,3],"Importado",12],
    ["GUA-CLU-NKD","Guaya de clutch","AKT NKD 125","Mandos",8200,16000,20,[55,12,15],"Nacional",3],
    ["AMO-TRA-280","Amortiguador trasero 280 mm","Yamaha BWS 125","Suspensión",121000,189000,6,[5,2,1],"Importado",12],
    ["BOM-H4-12V","Bombillo H4 12 V 35/35 W","Universal","Eléctrico",4800,9500,40,[150,30,40],"Importado",3],
    ["ROD-6301","Rodamiento 6301-2RS","Rueda delantera, varias","Rodamientos",6100,12000,40,[130,30,26],"Importado",6],
    ["ACE-20W50","Aceite 4T 20W-50 x 1 L","Universal","Lubricación",21000,32000,48,[210,50,44],"Nacional",0],
    ["CIL-KIT-150","Kit de cilindro 150 cc (pistón y anillos)","Bajaj Pulsar 150","Motor",248000,385000,4,[3,1,0],"Importado",12],
    ["ESP-RET-M10","Espejos retrovisores par M10","Universal","Accesorios",14500,28000,15,[44,9,12],"Nacional",3],
    ["DIS-FRE-240","Disco de freno delantero 240 mm","Pulsar NS200, Apache 200","Frenos",96000,149000,8,[22,4,3],"Importado",12],
    ["CDI-AKT-125","CDI de encendido 6 pines","AKT NKD 125, Flex 125","Eléctrico",58000,92000,10,[27,6,5],"Importado",6],
    ["BOB-ENC-UNI","Bobina de alta (encendido)","Motos 100–150 cc","Eléctrico",31000,52000,12,[35,8,6],"Importado",6],
    ["EMP-KIT-150","Kit de empaques de motor 150 cc","Bajaj Pulsar 150","Motor",34000,56000,10,[24,5,4],"Importado",3],
    ["LLA-90-90-18","Llanta trasera 90/90-18","Honda CB110, Yamaha YBR","Llantas",112000,168000,10,[28,6,4],"Nacional",12],
    ["MAN-FRE-DER","Manigueta de freno derecha","Universal","Mandos",13500,24000,20,[48,10,12],"Nacional",3]
  ];
  db.productos = prods.map((p, i) => ({ id:"PR" + (i+1), sku:p[0], nombre:p[1], compat:p[2], categoria:p[3], costo:p[4], precio:p[5], minimo:p[6], stock:{ S1:p[7][0], S2:p[7][1], S3:p[7][2] }, origen:p[8], garantiaMeses:p[9], activo:true }));
  const clis = [
    ["Motorepuestos El Santuario S.A.S.","901.234.567-1","05697","Calle 50 # 48-31","Óscar Giraldo","604 546 1120",12000000,"compras@mrsantuario.example"],
    ["Taller y Repuestos Guarne","900.456.123-8","05318","Cra. 51 # 49-08","Luz Mery Arango","604 551 2087",8000000,"pedidos@tallerguarne.example"],
    ["Moto Partes La Ceja","901.555.010-3","05376","Calle 20 # 22-40","Hernán Cardona","604 553 9012",15000000,"hcardona@motopartesceja.example"],
    ["Motocentro Marinilla S.A.S.","900.889.432-5","05440","Cra. 30 # 31-15","Paula Duque","604 548 3376",20000000,"compras@motocentromarinilla.example"],
    ["Repuestos El Carmen","901.300.777-0","05148","Calle 31 # 30-22","Wilson Ocampo","604 543 0091",6000000,"repuestoselcarmen@correo.example"],
    ["Distrimotos Sonsón","900.121.900-2","05756","Cra. 8 # 7-41","Gloria Valencia","604 869 2240",10000000,"gvalencia@distrimotos.example"],
    ["Moto Servicio Medellín Centro","901.678.234-9","05001","Calle 44 # 52-17, Barrio Triste","Felipe Correa","604 512 7788",25000000,"facturacion@motoserviciomed.example"],
    ["Repuestos San Vicente","900.334.871-6","05674","Calle 30 # 29-60","Natalia Gil","604 854 1302",8000000,"natalia.gil@repuestossanvicente.example"],
    ["Motos y Partes El Retiro","901.402.115-4","05607","Cra. 20 # 21-18","Camilo Ruiz","604 541 0745",9000000,"compras@motoselretiro.example"],
    ["Distrimotos Bogotá S.A.S.","900.977.640-1","11001","Av. Caracas # 13-41","Andrea Salazar","601 342 8890",30000000,"asalazar@distrimotosbog.example"]
  ];
  db.clientes = clis.map((c, i) => ({ id:"C" + (i+1), nombre:c[0], nit:c[1], ciudadId:c[2], direccion:c[3], contacto:c[4], telefono:c[5], cupo:c[6], email:c[7], activo:true, autorizaDatos:true }));

  db.usuarios.forEach(u => { u.claveHash = hashClave(u.usuario, CONFIG.claveDemo); });
  const U = id => db.usuarios.find(u => u.id === id);
  const events = []; // [ts, accion, entidad, ref, detalle, user]
  const ev = (ts, a, en, ref, d, u) => events.push([ts.toISOString(), a, en, ref, d, U(u)]);
  const DAY = 864e5;

  // Importaciones
  const imps = [
    { dias:75, estado:"Recibida", items:[["PR1",400,2.1],["PR2",200,5.4],["PR6",300,2.3],["PR10",500,1.05],["PR11",400,1.4]], dim:"482026000123451", co:"CO-ZLC-2026-0871" },
    { dias:18, estado:"En aduana", items:[["PR3",150,9.2],["PR4",60,21.5],["PR7",50,18.4],["PR9",30,28.9]], dim:"", co:"CO-ZLC-2026-1140" },
    { dias:4,  estado:"Orden emitida", items:[["PR13",20,58],["PR1",300,2.05],["PR2",120,5.3]], dim:"", co:"" }
  ];
  imps.forEach(im => {
    const n = nextNumDb(db, "IMP"); const f = new Date(now - im.dias * DAY);
    const o = { id:"I" + n, numero:"IMP-2026-" + String(n).padStart(3,"0"), proveedorId:"P1", fecha:f.toISOString(), estado:im.estado, trm:3925, fleteUSD:1450, seguroUSD:180, arancelPct:10, sucursalId:"S1", dim:im.dim, certificadoOrigen:im.co, items:im.items.map(x => ({ productoId:x[0], cantidad:x[1], fobUSD:x[2] })), historial:[] };
    db.importaciones.push(o);
    ev(f, "Crear orden de importación", "Importación", o.numero, "Proveedor Istmo Moto Parts S.A. · " + o.items.length + " referencias", "U5");
    if (im.estado !== "Orden emitida"){ ev(new Date(+f + 6*DAY), "Cambiar estado importación", "Importación", o.numero, "Orden emitida → En tránsito", "U5"); ev(new Date(+f + 14*DAY), "Cambiar estado importación", "Importación", o.numero, "En tránsito → En aduana", "U5"); }
    if (im.estado === "Recibida"){
      ev(new Date(+f + 19*DAY), "Cambiar estado importación", "Importación", o.numero, "En aduana → Nacionalizada · DIM " + o.dim, "U5");
      const rd = new Date(+f + 21*DAY);
      o.recibida = rd.toISOString();
      ev(rd, "Recibir importación en bodega", "Importación", o.numero, "Conteo conforme · entrada a Rionegro", "U5");
      o.items.forEach(it => db.kardex.push({ fecha:rd.toISOString(), productoId:it.productoId, sucursalId:"S1", tipo:"Entrada importación", cantidad:it.cantidad, ref:o.numero, usuario:"Diana Marín" }));
    }
  });

  // Facturas históricas (6 meses)
  const firm = db.usuarios;
  for (let m = 5; m >= 0; m--){
    const base = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const daysInMonth = m === 0 ? now.getDate() : new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    const count = m === 0 ? 7 : ri(7, 11);
    const fechas = [];
    for (let k = 0; k < count; k++){
      const d = new Date(base.getFullYear(), base.getMonth(), ri(1, daysInMonth), ri(7, 16), ri(0, 59));
      if (+d > +now - 6 * 36e5) d.setTime(+now - ri(6, 40) * 36e5);
      fechas.push(d);
    }
    fechas.sort((x, y) => x - y); // consecutivos en orden cronológico
    for (const d of fechas){
      const cli = pick(db.clientes);
      const suc = R() < .65 ? "S1" : pick(["S2","S3"]);
      const nItems = ri(1, 4); const used = new Set(); const items = [];
      for (let j = 0; j < nItems; j++){ const p = pick(db.productos); if (used.has(p.id)) continue; used.add(p.id); items.push({ productoId:p.id, cantidad: p.precio > 100000 ? ri(1, 4) : ri(4, 24), precio:p.precio }); }
      const creador = suc === "S3" ? "U7" : "U3";
      const ageDays = (now - d) / DAY;
      const desdePedido = ageDays >= 1.2 && R() < .6;
      let ped = null;
      if (desdePedido){
        const dp = new Date(+d - ri(1, 3) * 36e5);
        ped = buildPedido(db, cli.id, suc, cli.ciudadId, items.map(x => ({ ...x })), dp.toISOString(), creador);
        ev(dp, "Registrar pedido de venta", "Pedido", ped.numero, cli.nombre + " · " + money(ped.total), creador);
        correo(db, "Pedido de venta", ped, dp.toISOString());
      }
      const f = buildFactura(db, cli.id, suc, cli.ciudadId, items, d.toISOString(), creador, ped);
      ev(d, desdePedido ? "Facturar pedido de venta" : "Registrar factura manual", "Factura", f.numero, (ped ? "Pedido " + ped.numero + " · " : cli.nombre + " · ") + money(f.total), creador);
      ev(new Date(+d + 2000), "Validar cupo del cliente", "Factura", f.numero, "Cupo suficiente", creador);
      let fate;
      if (ageDays < 1.2) fate = "Pendiente";
      else if (ageDays < 3) fate = R() < .5 ? "Autorizada" : "Alistamiento";
      else if (ageDays < 6) fate = R() < .6 ? "En tránsito" : "Entregada";
      else fate = R() < .04 && !desdePedido ? "Rechazada" : (R() < .08 ? "Con novedad" : "Entregada");
      if (fate === "Pendiente") continue;
      const ta = desdePedido ? new Date(+d + 60000) : new Date(+d + ri(1, 6) * 36e5);
      if (fate === "Rechazada"){
        f.estado = "Rechazada"; f.motivoRechazo = "Cantidades no coinciden con lo que el cliente pidió por teléfono."; f.revisadoPor = "U2"; f.revisadoEn = ta.toISOString();
        ev(ta, "Rechazar factura manual", "Factura", f.numero, f.motivoRechazo, "U2"); continue;
      }
      if (desdePedido){
        autorizarFactura(db, f, "SYS", ta.toISOString());
        ev(ta, "Contabilizar factura (automática, origen pedido)", "Factura", f.numero, "Asiento " + f.asiento.numero + " · CUFE " + f.cufe.slice(0,16) + "…", null);
      } else {
        autorizarFactura(db, f, "U2", ta.toISOString());
        ev(ta, "Autorizar factura manual", "Factura", f.numero, "CUFE " + f.cufe.slice(0,16) + "…", "U2");
        ev(new Date(+ta + 1000), "Contabilizar factura autorizada", "Factura", f.numero, "Asiento " + f.asiento.numero, "U2");
      }
      correo(db, "Factura emitida", f, new Date(+ta + 2000).toISOString());
      if (ageDays > 40){ f.pagada = true; f.pagoEn = new Date(+d + ri(15, 35) * DAY).toISOString(); ev(new Date(f.pagoEn), "Registrar pago de factura", "Factura", f.numero, money(f.total), "U2"); correo(db, "Pago registrado", f, f.pagoEn); }
      if (fate === "Autorizada") continue;
      const tr = new Date(+ta + ri(2, 8) * 36e5);
      const rem = buildRemision(db, f, tr.toISOString(), {
        direccion: cli.direccion, referencia:"Local comercial, frente a la vía principal", contacto: cli.contacto, telefono: cli.telefono,
        transportadora: suc === "S1" && R() < .5 ? "Flota propia" : pick(db.transportadoras), guia: "GU" + ri(100000, 999999), franja:"8:00 a. m. – 12:00 m.", observaciones:"Entregar únicamente a la persona de contacto. Exigir firma y cédula."
      });
      ev(tr, "Registrar despacho", "Remisión", rem.numero, "Factura " + f.numero, "U4");
      ev(new Date(+tr + 500), "Registrar instrucciones de envío", "Remisión", rem.numero, rem.instrucciones.transportadora + " · guía " + rem.instrucciones.guia, "U4");
      if (fate === "Alistamiento") continue;
      const tv = new Date(+tr + ri(1, 3) * 36e5);
      rem.items.forEach(it => it.contado = it.cantidad);
      rem.estado = "Verificada"; rem.verificadaEn = tv.toISOString(); rem.sello = sha(rem.numero + tv.toISOString()).slice(0, 10).toUpperCase();
      ev(tv, "Verificar alistamiento (conteo ciego)", "Remisión", rem.numero, "Conteo conforme · sello " + rem.sello, "U4");
      const tt = new Date(+tv + 36e5);
      rem.estado = "En tránsito"; rem.salidaEn = tt.toISOString();
      ev(tt, "Despachar remisión", "Remisión", rem.numero, "Salida de bodega", "U4");
      correo(db, "Despacho", rem, tt.toISOString());
      if (fate === "En tránsito") continue;
      const te = new Date(+tt + ri(5, 30) * 36e5);
      rem.entregadaEn = te.toISOString(); rem.recibidoPor = cli.contacto;
      if (fate === "Con novedad"){
        rem.items.forEach((it, idx) => it.recibido = idx === 0 ? Math.max(0, it.cantidad - ri(1, 2)) : it.cantidad);
        rem.estado = "Con novedad";
        const nov = { id:"N" + nextNumDb(db, "NOV"), tipo:"Entrega", remisionId:rem.id, facturaId:f.id, fecha:te.toISOString(), usuario:"Julián Zuluaga", detalle: difDetalle(db, rem.items, "recibido"), estado: ageDays > 25 ? "Cerrada" : "Abierta", resolucion: ageDays > 25 ? "Transportadora reconoce faltante; se envió reposición sin costo." : "" };
        db.novedades.push(nov);
        ev(te, "Registrar entrega con novedad", "Remisión", rem.numero, nov.detalle, "U4");
      } else {
        rem.items.forEach(it => it.recibido = it.cantidad);
        rem.estado = "Entregada";
        ev(te, "Registrar entrega conforme", "Remisión", rem.numero, "Recibe " + cli.contacto, "U4");
      }
    }
  }
  /* ---------- Escenario de demostración ----------
     Garantiza que cada estado del flujo tenga ejemplos el día de la demo.
     Se crea en orden cronológico para que los consecutivos sigan en orden. */
  const H = h => new Date(+now - h * 36e5);
  const lineas = its => its.map(([pid, q]) => ({ productoId:pid, cantidad:q, precio:db.productos.find(p => p.id === pid).precio }));
  const C = id => db.clientes.find(x => x.id === id);
  const mkPed = (cid, its, h, creador = "U3") => {
    const c = C(cid), d = H(h);
    const pd = buildPedido(db, cid, "S1", c.ciudadId, lineas(its), d.toISOString(), creador);
    ev(d, "Registrar pedido de venta", "Pedido", pd.numero, c.nombre + " · " + money(pd.total), creador);
    correo(db, "Pedido de venta", pd, d.toISOString());
    return pd;
  };
  const mkFac = (cid, sucId, its, h, creador, ped) => {
    const c = C(cid), d = H(h);
    const f = buildFactura(db, cid, sucId, c.ciudadId, ped ? ped.items.map(x => ({ ...x })) : lineas(its), d.toISOString(), creador, ped);
    ev(d, ped ? "Facturar pedido de venta" : "Registrar factura manual", "Factura", f.numero, (ped ? "Pedido " + ped.numero + " · " : c.nombre + " · ") + money(f.total), creador);
    ev(new Date(+d + 2000), "Validar cupo del cliente", "Factura", f.numero, "Cupo suficiente", creador);
    return f;
  };
  const autorizar = (f, h) => {
    const t = H(h).toISOString();
    if (f.origen === "Pedido"){ autorizarFactura(db, f, "SYS", t); ev(new Date(t), "Contabilizar factura (automática, origen pedido)", "Factura", f.numero, "Asiento " + f.asiento.numero + " · CUFE " + f.cufe.slice(0,16) + "…", null); }
    else { autorizarFactura(db, f, "U2", t); ev(new Date(t), "Autorizar factura manual", "Factura", f.numero, "CUFE " + f.cufe.slice(0,16) + "…", "U2"); ev(new Date(+new Date(t) + 1000), "Contabilizar factura autorizada", "Factura", f.numero, "Asiento " + f.asiento.numero, "U2"); }
    correo(db, "Factura emitida", f, new Date(+new Date(t) + 2000).toISOString());
  };
  const remision = (f, h, transp, guia) => {
    const c = C(f.clienteId), t = H(h);
    const r = buildRemision(db, f, t.toISOString(), { direccion:c.direccion, referencia:"Local comercial, frente a la vía principal", contacto:c.contacto, telefono:c.telefono, transportadora:transp, guia, franja:"8:00 a. m. – 12:00 m.", observaciones:"Entregar únicamente a la persona de contacto. Exigir firma y cédula." });
    ev(t, "Registrar despacho", "Remisión", r.numero, "Factura " + f.numero, "U4");
    ev(new Date(+t + 500), "Registrar instrucciones de envío", "Remisión", r.numero, transp + (guia ? " · guía " + guia : ""), "U4");
    return r;
  };
  const verificar = (r, h) => { const t = H(h); r.items.forEach(it => it.contado = it.cantidad); r.estado = "Verificada"; r.verificadaEn = t.toISOString(); r.sello = sha(r.numero + r.verificadaEn).slice(0, 10).toUpperCase(); ev(t, "Verificar alistamiento (conteo ciego)", "Remisión", r.numero, "Conteo conforme · sello " + r.sello, "U4"); };
  const transito = (r, h) => { const t = H(h); r.estado = "En tránsito"; r.salidaEn = t.toISOString(); ev(t, "Despachar remisión", "Remisión", r.numero, "Salida de bodega", "U4"); correo(db, "Despacho", r, t.toISOString()); };

  // 1. Pedido registrado temprano (queda por facturar)
  mkPed("C1", [["PR2",10],["PR11",20]], 4.95);
  // 2. Facturas autorizadas que esperan remisión
  const fA = mkFac("C2", "S1", [["PR15",2],["PR6",10]], 4.9, "U3"); autorizar(fA, 4.85);
  const pB = mkPed("C5", [["PR10",30],["PR18",4]], 4.88); const fB = mkFac("C5", "S1", null, 4.8, "U3", pB); autorizar(fB, 4.8);
  // 3. Remisión verificada (sellada), con un primer conteo errado que abrió una novedad
  const fC = mkFac("C7", "S1", [["PR3",10],["PR17",6]], 4.75, "U3"); autorizar(fC, 4.7);
  const rC = remision(fC, 4.6, "Coordinadora", "CO458812");
  const tNov = H(4.5);
  rC.items[0].contado = 11;
  const novC = { id:"N" + nextNumDb(db, "NOV"), tipo:"Alistamiento", remisionId:rC.id, facturaId:fC.id, fecha:tNov.toISOString(), usuario:"Julián Zuluaga", detalle:difDetalle(db, rC.items, "contado"), estado:"Abierta", resolucion:"" };
  db.novedades.push(novC); ev(tNov, "Discrepancia en conteo de alistamiento", "Remisión", rC.numero, novC.detalle, "U4");
  verificar(rC, 4.4);
  // 4. Dos remisiones en tránsito
  const pD = mkPed("C9", [["PR16",5],["PR1",30]], 4.68); const fD = mkFac("C9", "S1", null, 4.6, "U3", pD); autorizar(fD, 4.6);
  const rD = remision(fD, 4.5, "Servientrega", "SV7712045"); verificar(rD, 4.3); transito(rD, 4.1);
  const fE = mkFac("C6", "S1", [["PR19",3],["PR8",12]], 4.45, "U3"); autorizar(fE, 4.35);
  const rE = remision(fE, 4.25, "Flota propia", ""); verificar(rE, 4.15); transito(rE, 4.0);
  // 5. Facturas manuales pendientes de autorización
  mkFac("C4", "S1", [["PR4",4],["PR3",10],["PR1",24]], 3, "U3");
  mkFac("C10", "S1", [["PR20",6],["PR11",20]], 2.2, "U3");
  mkPed("C6", [["PR5",6],["PR8",15]], 2);
  mkFac("C3", "S3", [["PR6",12],["PR12",20]], 1.5, "U7");
  // 6. Pedido recién llegado
  mkPed("C10", [["PR14",8],["PR7",3]], 0.7);
  // 7. Cliente de la demo de cupo (Repuestos San Vicente): el histórico depende de la fecha en que se
  //    cargan los datos, así que su cupo se ajusta para que siempre le queden unos 1,78 millones
  //    disponibles. Así, en la demo, 12 llantas superan el cupo y 2 sí caben, cualquier día.
  const c8 = C("C8");
  const comprometidoC8 = sum(db.facturas.filter(f => f.clienteId === "C8" && !f.pagada && (f.estado === "Pendiente" || f.estado === "Autorizada")), f => f.total)
                       + sum(db.pedidos.filter(x => x.clienteId === "C8" && x.estado === "Registrado"), x => x.total);
  c8.cupo = Math.round((comprometidoC8 + 1780000) / 1e4) * 1e4;
  // Las existencias de la tabla representan el saldo actual después del histórico
  prods.forEach((p, i) => { db.productos[i].stock = { S1:p[7][0], S2:p[7][1], S3:p[7][2] }; });
  events.sort((a, b) => a[0] < b[0] ? -1 : 1);
  const saveDB = DB; DB = db;
  ev(now, "Inicializar datos de demostración", "Sistema", "", "Base de datos de ejemplo creada", "U1");
  events.forEach(e => audit(e[1], e[2], e[3], e[4], { at:e[0], user:e[5] || { nombre:"Sistema", rol:"Sistema" } }));
  db.correos.sort((a, b) => a.ts.localeCompare(b.ts));
  DB = saveDB;
  return db;
}
