import { pool } from "../config/db.js";

export const findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM clientes");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM clientes WHERE id = ?", [id]);
  return rows[0];
};

export const create = async (data) => {
  const { nombre, cuit, telefono, email, direccion } = data;
  const [r] = await pool.query(
    "INSERT INTO clientes (nombre, cuit, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)",
    [nombre, cuit, telefono, email, direccion]
  );
  return { id: r.insertId, ...data };
};

export const update = async (id, data) => {
  const { nombre, cuit, telefono, email, direccion } = data;
  await pool.query(
    "UPDATE clientes SET nombre=?, cuit=?, telefono=?, email=?, direccion=? WHERE id=?",
    [nombre, cuit, telefono, email, direccion, id]
  );
  return { id, ...data };
};

export const remove = async (id) => {
  await pool.query("DELETE FROM clientes WHERE id=?", [id]);
};

// AGREGACIÓN: total facturado por cliente
export const totalPorCliente = async () => {
  const [rows] = await pool.query(
    `SELECT c.id, c.nombre,
            COUNT(p.id) AS cantidad_pedidos,
            IFNULL(SUM(f.total), 0) AS total_facturado
     FROM clientes c
     LEFT JOIN pedidos p ON p.id_cliente = c.id
     LEFT JOIN facturas f ON f.id_pedido = p.id
     GROUP BY c.id, c.nombre
     ORDER BY total_facturado DESC`
  );
  return rows;
};