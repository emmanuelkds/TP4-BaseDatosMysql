import { pool } from "../config/db.js";

export const findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM proveedores");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM proveedores WHERE id = ?", [id]);
  return rows[0];
};

export const create = async (data) => {
  const { nombre, cuit, telefono, email, direccion } = data;
  const [result] = await pool.query(
    "INSERT INTO proveedores (nombre, cuit, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)",
    [nombre, cuit, telefono, email, direccion]
  );
  return { id: result.insertId, ...data };
};

export const update = async (id, data) => {
  const { nombre, cuit, telefono, email, direccion } = data;
  await pool.query(
    "UPDATE proveedores SET nombre = ?, cuit = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?",
    [nombre, cuit, telefono, email, direccion, id]
  );
  return { id, ...data };
};

export const remove = async (id) => {
  await pool.query("DELETE FROM proveedores WHERE id = ?", [id]);
};