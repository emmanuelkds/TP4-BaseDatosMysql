import { pool } from "../config/db.js";

export const findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM companias_envios");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM companias_envios WHERE id = ?", [id]);
  return rows[0];
};

export const create = async (data) => {
  const { nombre, telefono, costo_base } = data;
  const [r] = await pool.query(
    "INSERT INTO companias_envios (nombre, telefono, costo_base) VALUES (?, ?, ?)",
    [nombre, telefono, costo_base]
  );
  return { id: r.insertId, ...data };
};

export const update = async (id, data) => {
  const { nombre, telefono, costo_base } = data;
  await pool.query(
    "UPDATE companias_envios SET nombre=?, telefono=?, costo_base=? WHERE id=?",
    [nombre, telefono, costo_base, id]
  );
  return { id, ...data };
};

export const remove = async (id) => {
  await pool.query("DELETE FROM companias_envios WHERE id=?", [id]);
};

// AGREGACIÓN: cantidad de envíos por compañía
export const enviosPorCompania = async () => {
  const [rows] = await pool.query(
    `SELECT ce.id, ce.nombre, ce.costo_base,
            COUNT(e.id) AS cantidad_envios
     FROM companias_envios ce
     LEFT JOIN envios e ON e.id_compania = ce.id
     GROUP BY ce.id, ce.nombre, ce.costo_base
     ORDER BY cantidad_envios DESC`
  );
  return rows;
};