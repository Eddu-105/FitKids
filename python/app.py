from flask import Flask, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# ===============================
# BASE DE DATOS (SQLITE)
# ===============================
BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "fitkids.db")

def init_db():
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    # PEDIDOS
    cur.execute("""
    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        correo TEXT NOT NULL,
        telefono TEXT,
        total REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS pedido_detalle (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER NOT NULL,
        producto TEXT NOT NULL,
        detalle TEXT,
        precio REAL NOT NULL,
        img TEXT,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
    )
    """)

    # INSCRIPCIONES
    cur.execute("""
    CREATE TABLE IF NOT EXISTS inscripciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_padre TEXT NOT NULL,
        nombre_nino TEXT NOT NULL,
        edad INTEGER NOT NULL,
        sede TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    con.commit()
    con.close()

init_db()

# ===============================
# CORS (para fetch desde tu web)
# ===============================
def cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return resp

# ===============================
# HOME (TEST)
# ===============================
@app.get("/")
def home():
    return cors(jsonify({"ok": True, "msg": "API FitKids funcionando"}))

# ==========================================================
# PEDIDOS
# ==========================================================

@app.route("/api/pedidos_create", methods=["POST", "OPTIONS"])
def crear_pedido():
    if request.method == "OPTIONS":
        return cors(jsonify({})), 204

    data = request.get_json(silent=True) or {}

    nombre = (data.get("nombre") or "").strip()
    correo = (data.get("correo") or "").strip()
    telefono = (data.get("telefono") or "").strip()
    total = data.get("total")
    items = data.get("items") or []

    if not nombre or not correo or not isinstance(items, list) or len(items) == 0:
        return cors(jsonify({"ok": False, "error": "Datos incompletos"})), 400

    try:
        total_num = float(total)
    except Exception:
        total_num = 0.0
        for it in items:
            try:
                total_num += float(it.get("precio") or 0)
            except Exception:
                pass

    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    cur.execute(
        "INSERT INTO pedidos(nombre, correo, telefono, total) VALUES (?,?,?,?)",
        (nombre, correo, telefono, total_num)
    )
    pedido_id = cur.lastrowid

    for it in items:
        producto = (it.get("producto") or "Producto").strip()
        detalle = (it.get("detalle") or "").strip()
        img = (it.get("img") or "").strip()
        try:
            precio = float(it.get("precio") or 0)
        except Exception:
            precio = 0.0

        cur.execute(
            """INSERT INTO pedido_detalle(pedido_id, producto, detalle, precio, img)
               VALUES (?,?,?,?,?)""",
            (pedido_id, producto, detalle, precio, img)
        )

    con.commit()
    con.close()

    return cors(jsonify({"ok": True, "pedido_id": pedido_id}))

@app.get("/api/pedidos")
def listar_pedidos():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    cur.execute("SELECT * FROM pedidos ORDER BY id DESC")
    pedidos = [dict(r) for r in cur.fetchall()]

    con.close()
    return cors(jsonify({"ok": True, "pedidos": pedidos}))

@app.get("/api/pedidos_detalle")
def listar_pedidos_detalle():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    cur.execute("""
      SELECT d.*, p.nombre AS cliente, p.correo, p.created_at
      FROM pedido_detalle d
      JOIN pedidos p ON p.id = d.pedido_id
      ORDER BY d.id DESC
    """)
    rows = [dict(r) for r in cur.fetchall()]

    con.close()
    return cors(jsonify({"ok": True, "detalle": rows}))

# ==========================================================
# INSCRIPCIONES
# ==========================================================

@app.route("/api/inscripciones_create", methods=["POST", "OPTIONS"])
def crear_inscripcion():
    if request.method == "OPTIONS":
        return cors(jsonify({})), 204

    data = request.get_json(silent=True) or {}

    nombre_padre = (data.get("nombre_padre") or "").strip()
    nombre_nino = (data.get("nombre_nino") or "").strip()
    sede = (data.get("sede") or "").strip()
    email = (data.get("email") or "").strip()
    telefono = (data.get("telefono") or "").strip()

    try:
        edad = int(data.get("edad"))
    except Exception:
        edad = -1

    if not nombre_padre or not nombre_nino or edad < 1 or not sede or not email:
        return cors(jsonify({"ok": False, "error": "Datos incompletos"})), 400

    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    cur.execute(
        """INSERT INTO inscripciones(nombre_padre, nombre_nino, edad, sede, email, telefono)
           VALUES (?,?,?,?,?,?)""",
        (nombre_padre, nombre_nino, edad, sede, email, telefono)
    )
    inscripcion_id = cur.lastrowid

    con.commit()
    con.close()

    return cors(jsonify({"ok": True, "inscripcion_id": inscripcion_id}))

@app.get("/api/inscripciones")
def listar_inscripciones():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    cur.execute("SELECT * FROM inscripciones ORDER BY id DESC")
    rows = [dict(r) for r in cur.fetchall()]

    con.close()
    return cors(jsonify({"ok": True, "inscripciones": rows}))
