"use strict";
/* Motorepuestos del Oriente
   Capa de datos · Generación de datos de ejemplo (productos, clientes, municipios DANE, historial de 6 meses). */

function seed(){
  const now = new Date();
  const R = rng(20261103);
  const pick = a => a[Math.floor(R() * a.length)];
  const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
  const db = {
    version: 2, creado: now.toISOString(), seq:{}, audit:[], pedidos:[], correos:[], kardex:[], novedades:[], certificados:[], remisiones:[], facturas:[], importaciones:[],
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
    estados:[ { id:"ANT", paisId:"CO", nombre:"Antioquia" }, { id:"CUN", paisId:"CO", nombre:"Cundinamarca" }, { id:"CAL", paisId:"CO", nombre:"Caldas" }, { id:"COL", paisId:"PA", nombre:"Colón" }, { id:"PAN", paisId:"PA", nombre:"Panamá" } ],
    ciudades:[
      { id:"05615", estadoId:"ANT", nombre:"Rionegro" }, { id:"05440", estadoId:"ANT", nombre:"Marinilla" }, { id:"05376", estadoId:"ANT", nombre:"La Ceja" },
      { id:"05148", estadoId:"ANT", nombre:"El Carmen de Viboral" }, { id:"05318", estadoId:"ANT", nombre:"Guarne" }, { id:"05697", estadoId:"ANT", nombre:"El Santuario" },
      { id:"05756", estadoId:"ANT", nombre:"Sonsón" }, { id:"05001", estadoId:"ANT", nombre:"Medellín" }, { id:"05607", estadoId:"ANT", nombre:"El Retiro" }, { id:"05674", estadoId:"ANT", nombre:"San Vicente Ferrer" },
      { id:"11001", estadoId:"CUN", nombre:"Bogotá D.C." }, { id:"25754", estadoId:"CUN", nombre:"Soacha" }, { id:"17001", estadoId:"CAL", nombre:"Manizales" },
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
    ["ESP-RET-M10","Espejos retrovisores par M10","Universal","Accesorios",14500,28000,15,[44,9,12],"Nacional",3]
  ];
  db.productos = prods.map((p, i) => ({ id:"PR" + (i+1), sku:p[0], nombre:p[1], compat:p[2], categoria:p[3], costo:p[4], precio:p[5], minimo:p[6], stock:{ S1:p[7][0], S2:p[7][1], S3:p[7][2] }, origen:p[8], garantiaMeses:p[9], activo:true }));
  const clis = [
    ["Motorepuestos El Santuario S.A.S.","901.234.567-1","05697","Calle 50 # 48-31","Óscar Giraldo","604 546 1120",12000000,"compras@mrsantuario.example"],
    ["Taller y Repuestos Guarne","900.456.123-8","05318","Cra. 51 # 49-08","Luz Mery Arango","604 551 2087",8000000,"pedidos@tallerguarne.example"],
    ["Moto Partes La Ceja","901.555.010-3","05376","Calle 20 # 22-40","Hernán Cardona","604 553 9012",15000000,"hcardona@motopartesceja.example"],
    ["Motocentro Marinilla S.A.S.","900.889.432-5","05440","Cra. 30 # 31-15","Paula Duque","604 548 3376",20000000,"compras@motocentromarinilla.example"],
    ["Repuestos El Carmen","901.300.777-0","05148","Calle 31 # 30-22","Wilson Ocampo","604 543 0091",6000000,"repuestoselcarmen@correo.example"],
    ["Distrimotos Sonsón","900.121.900-2","05756","Cra. 8 # 7-41","Gloria Valencia","604 869 2240",10000000,"gvalencia@distrimotos.example"],
    ["Moto Servicio Medellín Centro","901.678.234-9","05001","Calle 44 # 52-17, Barrio Triste","Felipe Correa","604 512 7788",25000000,"facturacion@motoserviciomed.example"]
  ];
  db.clientes = clis.map((c, i) => ({ id:"C" + (i+1), nombre:c[0], nit:c[1], ciudadId:c[2], direccion:c[3], contacto:c[4], telefono:c[5], cupo:c[6], email:c[7], activo:true, autorizaDatos:true }));

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
      if (+d > +now - 4 * 36e5) d.setTime(+now - ri(5, 40) * 36e5);
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
  // Facturas pendientes de autorización para la demostración
  const mk = (cid, sucId, its, hoursAgo, creador) => {
    const d = new Date(+now - hoursAgo * 36e5); const c = db.clientes.find(x => x.id === cid);
    const f = buildFactura(db, cid, sucId, c.ciudadId, its.map(([pid, q]) => ({ productoId:pid, cantidad:q, precio:db.productos.find(p => p.id === pid).precio })), d.toISOString(), creador);
    ev(d, "Registrar factura manual", "Factura", f.numero, c.nombre + " · " + money(f.total), creador);
    ev(new Date(+d + 2000), "Validar cupo del cliente", "Factura", f.numero, "Cupo suficiente", creador);
  };
  mk("C4", "S1", [["PR4",4],["PR3",10],["PR1",24]], 3, "U3");
  mk("C3", "S3", [["PR6",12],["PR12",20]], 1.5, "U7");
  // Pedidos de venta registrados, listos para facturar
  const mkPed = (cid, its, hoursAgo) => {
    const d = new Date(+now - hoursAgo * 36e5); const c = db.clientes.find(x => x.id === cid);
    const pd = buildPedido(db, cid, "S1", c.ciudadId, its.map(([pid, q]) => ({ productoId:pid, cantidad:q, precio:db.productos.find(p => p.id === pid).precio })), d.toISOString(), "U3");
    ev(d, "Registrar pedido de venta", "Pedido", pd.numero, c.nombre + " · " + money(pd.total), "U3");
    correo(db, "Pedido de venta", pd, d.toISOString());
  };
  mkPed("C1", [["PR2",10],["PR11",20]], 5);
  mkPed("C6", [["PR5",6],["PR8",15]], 2);
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
