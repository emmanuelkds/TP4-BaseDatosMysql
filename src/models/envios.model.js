import { pool } from "../config/db.js";

export const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT e.*, ce.nombre AS compania,
            CONCAT('Pedido #', e.id_pedido) AS pedido
     FROM envios e
     LEFT JOIN companias_envios ce ON e.id_compania = ce.id
     ORDER BY e.fecha_envio DESC`
  );
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT e.*, ce.nombre AS compania, ce.costo_base
     FROM envios e
     LEFT JOIN companias_envios ce ON e.id_compania = ce.id
     WHERE e.id = ?`,
    [id]
  );
  return rows[0];
};

export const create = async (data) => {
  const { id_pedido, id_compania, direccion, fecha_envio, estado } = data;
  const [r] = await pool.query(
    "INSERT INTO envios (id_pedido, id_compania, direccion, fecha_envio, estado) VALUES (?, ?, ?, ?, ?)",
    [id_pedido, id_compania, direccion, fecha_envio, estado || "preparando"]
  );
  return { id: r.insertId, ...data };
};

export const update = async (id, data) => {
  const { id_pedido, id_compania, direccion, fecha_envio, estado } = data;
  await pool.query(
    "UPDATE envios SET id_pedido=?, id_compania=?, direccion=?, fecha_envio=?, estado=? WHERE id=?",
    [id_pedido, id_compania, direccion, fecha_envio, estado, id]
  );
  return { id, ...data };
};

export const remove = async (id) => {
  await pool.query("DELETE FROM envios WHERE id=?", [id]);
};