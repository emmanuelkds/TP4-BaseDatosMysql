import { pool } from "../config/db.js";

export const findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM empleados");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM empleados WHERE id = ?", [id]);
  return rows[0];
};

export const create = async (data) => {
  const { nombre, apellido, puesto, salario, fecha_ingreso } = data;
  const [r] = await pool.query(
    "INSERT INTO empleados (nombre, apellido, puesto, salario, fecha_ingreso) VALUES (?, ?, ?, ?, ?)",
    [nombre, apellido, puesto, salario, fecha_ingreso]
  );
  return { id: r.insertId, ...data };
};

export const update = async (id, data) => {
  const { nombre, apellido, puesto, salario, fecha_ingreso } = data;
  await pool.query(
    "UPDATE empleados SET nombre=?, apellido=?, puesto=?, salario=?, fecha_ingreso=? WHERE id=?",
    [nombre, apellido, puesto, salario, fecha_ingreso, id]
  );
  return { id, ...data };
};

export const remove = async (id) => {
  await pool.query("DELETE FROM empleados WHERE id=?", [id]);
};

// AGREGACIÓN: salario promedio por puesto
export const salarioPorPuesto = async () => {
  const [rows] = await pool.query(
    `SELECT puesto,
            COUNT(*) AS cantidad,
            AVG(salario) AS salario_promedio,
            MAX(salario) AS salario_maximo
     FROM empleados
     GROUP BY puesto`
  );
  return rows;
};