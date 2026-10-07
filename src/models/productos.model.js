import { pool } from "../config/db.js";

// JOIN con categorias y proveedores + filtro opcional por categoria
export const findAll = async (filtros = {}) => {
  let sql = `
    SELECT p.id, p.nombre, p.precio, p.stock,
           c.nombre AS categoria,
           pr.nombre AS proveedor
    FROM productos p
    LEFT JOIN categorias c ON p.id_categoria = c.id
    LEFT JOIN proveedores pr ON p.id_proveedor = pr.id
    WHERE 1 = 1
  `;
  const params = [];
  if (filtros.categoria) {
    sql += " AND c.nombre = ?";
    params.push(filtros.categoria);
  }
  if (filtros.precio_max) {
    sql += " AND p.precio <= ?";
    params.push(filtros.precio_max);
  }
  const [rows] = await pool.query(sql, params);
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.nombre AS categoria, pr.nombre AS proveedor
     FROM productos p
     LEFT JOIN categorias c ON p.id_categoria = c.id
     LEFT JOIN proveedores pr ON p.id_proveedor = pr.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
};

export const create = async (data) => {
  const { nombre, precio, stock, id_categoria, id_proveedor } = data;
  const [r] = await pool.query(
    "INSERT INTO productos (nombre, precio, stock, id_categoria, id_proveedor) VALUES (?, ?, ?, ?, ?)",
    [nombre, precio, stock, id_categoria, id_proveedor]
  );
  return { id: r.insertId, ...data };
};

export const update = async (id, data) => {
  const { nombre, precio, stock, id_categoria, id_proveedor } = data;
  await pool.query(
    "UPDATE productos SET nombre=?, precio=?, stock=?, id_categoria=?, id_proveedor=? WHERE id=?",
    [nombre, precio, stock, id_categoria, id_proveedor, id]
  );
  return { id, ...data };
};

export const remove = async (id) => {
  await pool.query("DELETE FROM productos WHERE id=?", [id]);
};

// AGREGACIÓN: stock total por categoría
export const stockPorCategoria = async () => {
  const [rows] = await pool.query(
    `SELECT c.nombre AS categoria, SUM(p.stock) AS stock_total, COUNT(p.id) AS cantidad_productos
     FROM categorias c
     LEFT JOIN productos p ON p.id_categoria = c.id
     GROUP BY c.id, c.nombre
     ORDER BY stock_total DESC`
  );
  return rows;
};