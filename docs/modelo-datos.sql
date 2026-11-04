-- =====================================================================
-- Motorepuestos del Oriente S.A.S. — Modelo relacional (PostgreSQL 15+)
-- Ingeniería de Software III
--
-- Principios de integridad:
--   * Claves foráneas en todas las relaciones (integridad referencial).
--   * CHECK para reglas de dominio (cantidades > 0, estados válidos, NIT).
--   * Los documentos (facturas, remisiones) NUNCA se borran: cambian de estado.
--   * Bitácora de auditoría encadenada con SHA-256: cada fila guarda la
--     huella de la anterior; una alteración rompe la cadena.
--   * Triggers impiden UPDATE/DELETE sobre la bitácora y sobre facturas
--     ya autorizadas.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- Catálogos geográficos (caso de uso: Gestionar ciudades y municipios)
CREATE TABLE pais (
  id         CHAR(2)      PRIMARY KEY,           -- ISO 3166-1 (CO, PA)
  nombre     VARCHAR(80)  NOT NULL UNIQUE
);
CREATE TABLE departamento (
  id         VARCHAR(5)   PRIMARY KEY,
  pais_id    CHAR(2)      NOT NULL REFERENCES pais(id),
  nombre     VARCHAR(80)  NOT NULL,
  UNIQUE (pais_id, nombre)
);
CREATE TABLE ciudad (
  id               VARCHAR(8)  PRIMARY KEY,      -- Código DANE (05615 = Rionegro)
  departamento_id  VARCHAR(5)  NOT NULL REFERENCES departamento(id),
  nombre           VARCHAR(80) NOT NULL,
  UNIQUE (departamento_id, nombre)
);

-- ---------- Organización
CREATE TABLE sucursal (
  id         VARCHAR(4)   PRIMARY KEY,
  nombre     VARCHAR(80)  NOT NULL,
  ciudad_id  VARCHAR(8)   NOT NULL REFERENCES ciudad(id),
  direccion  VARCHAR(120) NOT NULL,
  activa     BOOLEAN      NOT NULL DEFAULT TRUE
);

-- ---------- Seguridad (caso de uso: Gestionar usuarios y permisos)
CREATE TABLE rol (
  id      SERIAL      PRIMARY KEY,
  nombre  VARCHAR(40) NOT NULL UNIQUE
);
CREATE TABLE permiso (
  codigo       VARCHAR(40)  PRIMARY KEY,         -- p. ej. 'facturas.autorizar'
  descripcion  VARCHAR(120) NOT NULL
);
CREATE TABLE rol_permiso (
  rol_id          INT         NOT NULL REFERENCES rol(id) ON DELETE CASCADE,
  permiso_codigo  VARCHAR(40) NOT NULL REFERENCES permiso(codigo),
  PRIMARY KEY (rol_id, permiso_codigo)
);
CREATE TABLE usuario (
  id              SERIAL       PRIMARY KEY,
  usuario         VARCHAR(20)  NOT NULL UNIQUE CHECK (usuario ~ '^[a-z0-9.]{3,20}$'),
  nombre          VARCHAR(100) NOT NULL,
  hash_clave      TEXT         NOT NULL,         -- crypt(clave, gen_salt('bf', 12))
  rol_id          INT          NOT NULL REFERENCES rol(id),
  sucursal_id     VARCHAR(4)   NOT NULL REFERENCES sucursal(id),
  activo          BOOLEAN      NOT NULL DEFAULT TRUE,  -- no se borran: se desactivan
  intentos_fallidos SMALLINT   NOT NULL DEFAULT 0,
  creado_en       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ---------- Clientes (Ley 1581 de 2012: autorización de datos obligatoria)
CREATE TABLE cliente (
  id               SERIAL        PRIMARY KEY,
  nit              VARCHAR(15)   NOT NULL UNIQUE CHECK (nit ~ '^[0-9.]{6,13}-[0-9]$'),
  razon_social     VARCHAR(120)  NOT NULL,
  ciudad_id        VARCHAR(8)    NOT NULL REFERENCES ciudad(id),
  direccion        VARCHAR(120)  NOT NULL,
  contacto         VARCHAR(100)  NOT NULL,
  telefono         VARCHAR(20)   NOT NULL,
  cupo             NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (cupo >= 0),
  autoriza_datos   BOOLEAN       NOT NULL CHECK (autoriza_datos),
  autoriza_datos_en TIMESTAMPTZ  NOT NULL DEFAULT now(),
  activo           BOOLEAN       NOT NULL DEFAULT TRUE
);

-- ---------- Productos e inventario
CREATE TABLE producto (
  id               SERIAL        PRIMARY KEY,
  sku              VARCHAR(20)   NOT NULL UNIQUE CHECK (sku ~ '^[A-Z0-9-]{4,20}$'),
  nombre           VARCHAR(120)  NOT NULL,
  compatible_con   VARCHAR(200),
  categoria        VARCHAR(40)   NOT NULL,
  origen           VARCHAR(10)   NOT NULL CHECK (origen IN ('Importado','Nacional')),
  costo_promedio   NUMERIC(14,2) NOT NULL CHECK (costo_promedio >= 0),
  precio_venta     NUMERIC(14,2) NOT NULL CHECK (precio_venta > 0),
  stock_minimo     INT           NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
  garantia_meses   SMALLINT      NOT NULL DEFAULT 0 CHECK (garantia_meses BETWEEN 0 AND 60),
  activo           BOOLEAN       NOT NULL DEFAULT TRUE,
  CHECK (precio_venta > costo_promedio)
);
CREATE TABLE existencia (
  producto_id  INT        NOT NULL REFERENCES producto(id),
  sucursal_id  VARCHAR(4) NOT NULL REFERENCES sucursal(id),
  cantidad     INT        NOT NULL DEFAULT 0 CHECK (cantidad >= 0),   -- nunca negativa
  PRIMARY KEY (producto_id, sucursal_id)
);
CREATE TABLE movimiento_inventario (                                   -- kárdex
  id           BIGSERIAL   PRIMARY KEY,
  fecha        TIMESTAMPTZ NOT NULL DEFAULT now(),
  producto_id  INT         NOT NULL REFERENCES producto(id),
  sucursal_id  VARCHAR(4)  NOT NULL REFERENCES sucursal(id),
  tipo         VARCHAR(30) NOT NULL CHECK (tipo IN ('Entrada importación','Salida por factura','Traslado salida','Traslado entrada','Ajuste')),
  cantidad     INT         NOT NULL CHECK (cantidad <> 0),
  documento    VARCHAR(30) NOT NULL,
  motivo       VARCHAR(200),
  usuario_id   INT         NOT NULL REFERENCES usuario(id)
);

-- ---------- Facturación (casos de uso: Registrar, Autorizar, Rechazar, Contabilizar)
CREATE TABLE resolucion_dian (
  id            SERIAL      PRIMARY KEY,
  numero        VARCHAR(20) NOT NULL,
  prefijo       VARCHAR(4)  NOT NULL,
  desde         INT         NOT NULL,
  hasta         INT         NOT NULL,
  vigente_hasta DATE        NOT NULL,
  CHECK (hasta > desde)
);
CREATE TABLE factura (
  id                 BIGSERIAL     PRIMARY KEY,
  resolucion_id      INT           NOT NULL REFERENCES resolucion_dian(id),
  consecutivo        INT           NOT NULL,
  numero             VARCHAR(12)   GENERATED ALWAYS AS ('MRO-' || lpad(consecutivo::text, 6, '0')) STORED,
  fecha              TIMESTAMPTZ   NOT NULL DEFAULT now(),
  cliente_id         INT           NOT NULL REFERENCES cliente(id),
  sucursal_id        VARCHAR(4)    NOT NULL REFERENCES sucursal(id),
  ciudad_destino_id  VARCHAR(8)    NOT NULL REFERENCES ciudad(id),
  subtotal           NUMERIC(14,2) NOT NULL CHECK (subtotal >= 0),
  iva                NUMERIC(14,2) NOT NULL CHECK (iva >= 0),
  total              NUMERIC(14,2) NOT NULL,
  estado             VARCHAR(12)   NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente','Autorizada','Rechazada')),
  creado_por         INT           NOT NULL REFERENCES usuario(id),
  revisado_por       INT           REFERENCES usuario(id),
  revisado_en        TIMESTAMPTZ,
  motivo_rechazo     VARCHAR(400),
  cufe               CHAR(96),                  -- SHA-384 en producción (DIAN)
  observaciones      VARCHAR(400),
  pagada             BOOLEAN       NOT NULL DEFAULT FALSE,
  UNIQUE (resolucion_id, consecutivo),
  CHECK (total = subtotal + iva),
  -- Segregación de funciones: quien registra no autoriza
  CHECK (revisado_por IS NULL OR revisado_por <> creado_por),
  -- Rechazo exige motivo
  CHECK (estado <> 'Rechazada' OR length(coalesce(motivo_rechazo,'')) >= 10),
  -- Autorizada exige CUFE y revisor
  CHECK (estado <> 'Autorizada' OR (cufe IS NOT NULL AND revisado_por IS NOT NULL))
);
CREATE TABLE factura_detalle (
  factura_id   BIGINT        NOT NULL REFERENCES factura(id),
  linea        SMALLINT      NOT NULL,
  producto_id  INT           NOT NULL REFERENCES producto(id),
  cantidad     INT           NOT NULL CHECK (cantidad > 0),
  precio       NUMERIC(14,2) NOT NULL CHECK (precio > 0),
  PRIMARY KEY (factura_id, linea),
  UNIQUE (factura_id, producto_id)
);
CREATE TABLE asiento_contable (
  id          BIGSERIAL   PRIMARY KEY,
  numero      VARCHAR(12) NOT NULL UNIQUE,
  fecha       TIMESTAMPTZ NOT NULL DEFAULT now(),
  factura_id  BIGINT      NOT NULL UNIQUE REFERENCES factura(id)
);
CREATE TABLE asiento_linea (
  asiento_id  BIGINT        NOT NULL REFERENCES asiento_contable(id),
  cuenta_puc  VARCHAR(10)   NOT NULL,           -- 130505, 413515, 240805, 613515, 143501
  debito      NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (debito >= 0),
  credito     NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (credito >= 0),
  CHECK ((debito = 0) <> (credito = 0))
);
CREATE TABLE certificado_garantia (
  codigo       CHAR(12)    PRIMARY KEY CHECK (codigo ~ '^CG-[0-9A-F]{4}-[0-9A-F]{4}$'),
  factura_id   BIGINT      NOT NULL REFERENCES factura(id),
  producto_id  INT         NOT NULL REFERENCES producto(id),
  cantidad     INT         NOT NULL CHECK (cantidad > 0),
  emitido      TIMESTAMPTZ NOT NULL DEFAULT now(),
  vence        TIMESTAMPTZ NOT NULL,
  CHECK (vence > emitido)
);

-- ---------- Despachos (casos de uso: Registrar despacho, Registrar instrucciones de envío)
CREATE TABLE transportadora ( id SERIAL PRIMARY KEY, nombre VARCHAR(60) NOT NULL UNIQUE, propia BOOLEAN NOT NULL DEFAULT FALSE );
CREATE TABLE remision (
  id                BIGSERIAL    PRIMARY KEY,
  numero            VARCHAR(10)  NOT NULL UNIQUE,
  factura_id        BIGINT       NOT NULL UNIQUE REFERENCES factura(id),   -- una remisión por factura
  fecha             TIMESTAMPTZ  NOT NULL DEFAULT now(),
  estado            VARCHAR(14)  NOT NULL DEFAULT 'Alistamiento' CHECK (estado IN ('Alistamiento','Verificada','En tránsito','Entregada','Con novedad')),
  -- Instrucciones de envío
  direccion         VARCHAR(160) NOT NULL,
  punto_referencia  VARCHAR(160),
  contacto          VARCHAR(100) NOT NULL,
  telefono          VARCHAR(20)  NOT NULL CHECK (telefono ~ '^[0-9 +()-]{7,}$'),
  transportadora_id INT          NOT NULL REFERENCES transportadora(id),
  guia              VARCHAR(30),
  franja            VARCHAR(40)  NOT NULL,
  instrucciones     VARCHAR(400),
  -- Control
  sello_alistamiento CHAR(10),
  verificada_en     TIMESTAMPTZ,
  salida_en         TIMESTAMPTZ,
  entregada_en      TIMESTAMPTZ,
  recibido_por      VARCHAR(100),
  CHECK (estado IN ('Alistamiento') OR sello_alistamiento IS NOT NULL)
);
CREATE TABLE remision_detalle (
  remision_id  BIGINT NOT NULL REFERENCES remision(id),
  producto_id  INT    NOT NULL REFERENCES producto(id),
  facturado    INT    NOT NULL CHECK (facturado > 0),
  contado      INT    CHECK (contado >= 0),
  recibido     INT    CHECK (recibido >= 0),
  PRIMARY KEY (remision_id, producto_id)
);
CREATE TABLE novedad (
  id           BIGSERIAL    PRIMARY KEY,
  tipo         VARCHAR(14)  NOT NULL CHECK (tipo IN ('Alistamiento','Entrega')),
  remision_id  BIGINT       NOT NULL REFERENCES remision(id),
  fecha        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  detalle      VARCHAR(600) NOT NULL,
  estado       VARCHAR(8)   NOT NULL DEFAULT 'Abierta' CHECK (estado IN ('Abierta','Cerrada')),
  resolucion   VARCHAR(400),
  usuario_id   INT          NOT NULL REFERENCES usuario(id),
  CHECK (estado = 'Abierta' OR length(coalesce(resolucion,'')) >= 10)
);

-- ---------- Importaciones
CREATE TABLE proveedor ( id SERIAL PRIMARY KEY, nombre VARCHAR(120) NOT NULL, pais_id CHAR(2) NOT NULL REFERENCES pais(id), convenio_desde DATE );
CREATE TABLE importacion (
  id                  BIGSERIAL     PRIMARY KEY,
  numero              VARCHAR(14)   NOT NULL UNIQUE,
  proveedor_id        INT           NOT NULL REFERENCES proveedor(id),
  fecha               TIMESTAMPTZ   NOT NULL DEFAULT now(),
  estado              VARCHAR(14)   NOT NULL CHECK (estado IN ('Orden emitida','En tránsito','En aduana','Nacionalizada','Recibida')),
  trm                 NUMERIC(10,2) NOT NULL CHECK (trm > 0),
  flete_usd           NUMERIC(12,2) NOT NULL CHECK (flete_usd >= 0),
  seguro_usd          NUMERIC(12,2) NOT NULL CHECK (seguro_usd >= 0),
  arancel_pct         NUMERIC(5,2)  NOT NULL CHECK (arancel_pct BETWEEN 0 AND 100),
  sucursal_destino_id VARCHAR(4)    NOT NULL REFERENCES sucursal(id),
  dim                 VARCHAR(20),               -- Declaración de importación
  certificado_origen  VARCHAR(30),
  CHECK (estado NOT IN ('Nacionalizada','Recibida') OR dim IS NOT NULL)
);
CREATE TABLE importacion_detalle (
  importacion_id BIGINT        NOT NULL REFERENCES importacion(id),
  producto_id    INT           NOT NULL REFERENCES producto(id),
  cantidad       INT           NOT NULL CHECK (cantidad > 0),
  fob_usd        NUMERIC(12,4) NOT NULL CHECK (fob_usd > 0),
  PRIMARY KEY (importacion_id, producto_id)
);

-- ---------- Auditoría encadenada (ISO 9001 8.5.2 — trazabilidad)
CREATE TABLE auditoria (
  seq        BIGSERIAL    PRIMARY KEY,
  ts         TIMESTAMPTZ  NOT NULL DEFAULT clock_timestamp(),
  usuario_id INT          REFERENCES usuario(id),
  rol        VARCHAR(40)  NOT NULL,
  accion     VARCHAR(80)  NOT NULL,
  entidad    VARCHAR(30)  NOT NULL,
  referencia VARCHAR(30),
  detalle    TEXT,
  hash_prev  CHAR(64)     NOT NULL,
  hash       CHAR(64)     NOT NULL UNIQUE
);

CREATE OR REPLACE FUNCTION auditoria_encadenar() RETURNS trigger AS $$
DECLARE prev CHAR(64);
BEGIN
  SELECT hash INTO prev FROM auditoria ORDER BY seq DESC LIMIT 1 FOR UPDATE;
  NEW.hash_prev := coalesce(prev, repeat('0', 64));
  NEW.hash := encode(digest(NEW.hash_prev || '|' || NEW.seq || '|' || NEW.ts || '|' || coalesce(NEW.usuario_id::text,'') || '|' ||
              NEW.rol || '|' || NEW.accion || '|' || NEW.entidad || '|' || coalesce(NEW.referencia,'') || '|' || coalesce(NEW.detalle,''), 'sha256'), 'hex');
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_auditoria_hash BEFORE INSERT ON auditoria FOR EACH ROW EXECUTE FUNCTION auditoria_encadenar();

CREATE OR REPLACE FUNCTION bloquear_modificacion() RETURNS trigger AS $$
BEGIN RAISE EXCEPTION 'La tabla % es de solo inserción: los registros no se modifican ni se borran', TG_TABLE_NAME; END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_auditoria_inmutable BEFORE UPDATE OR DELETE ON auditoria FOR EACH ROW EXECUTE FUNCTION bloquear_modificacion();
CREATE TRIGGER trg_factura_no_delete BEFORE DELETE ON factura FOR EACH ROW EXECUTE FUNCTION bloquear_modificacion();

-- Una factura autorizada no cambia sus valores (solo puede marcarse pagada)
CREATE OR REPLACE FUNCTION factura_autorizada_inmutable() RETURNS trigger AS $$
BEGIN
  IF OLD.estado = 'Autorizada' AND (NEW.total, NEW.subtotal, NEW.iva, NEW.cliente_id, NEW.cufe, NEW.estado)
     IS DISTINCT FROM (OLD.total, OLD.subtotal, OLD.iva, OLD.cliente_id, OLD.cufe, OLD.estado) THEN
    RAISE EXCEPTION 'La factura % está autorizada y no puede modificarse', OLD.numero;
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_factura_inmutable BEFORE UPDATE ON factura FOR EACH ROW EXECUTE FUNCTION factura_autorizada_inmutable();

-- Vista de cupo disponible (caso de uso: Validar cupo del cliente)
CREATE VIEW v_cupo_cliente AS
SELECT c.id, c.nit, c.razon_social, c.cupo,
       coalesce(sum(f.total) FILTER (WHERE f.estado IN ('Pendiente','Autorizada') AND NOT f.pagada), 0) AS comprometido,
       c.cupo - coalesce(sum(f.total) FILTER (WHERE f.estado IN ('Pendiente','Autorizada') AND NOT f.pagada), 0) AS disponible
FROM cliente c LEFT JOIN factura f ON f.cliente_id = c.id
GROUP BY c.id;

-- Índices para consultas frecuentes
CREATE INDEX ix_factura_estado ON factura (estado, fecha DESC);
CREATE INDEX ix_factura_cliente ON factura (cliente_id) WHERE NOT pagada;
CREATE INDEX ix_mov_producto ON movimiento_inventario (producto_id, fecha DESC);
CREATE INDEX ix_auditoria_ref ON auditoria (referencia);
