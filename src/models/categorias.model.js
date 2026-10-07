import { pool } from "../config/db.js";

export const findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM categorias");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
  return rows[0];
};

export const create = async (data) => {
  const { nombre, descripcion } = data;
  const [r] = await pool.query(
    "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
    [nombre, descripcion]
  );
  return { id: r.insertId, ...data };
};

export const update = async (id, data) => {
  const { nombre, descripcion } = data;
  await pool.query(
    "UPDATE categorias SET nombre=?, descripcion=? WHERE id=?",
    [nombre, descripcion, id]
  );
  return { id, ...data };
};

export const remove = async (id) => {
  await pool.query("DELETE FROM categorias WHERE id=?", [id]);
};