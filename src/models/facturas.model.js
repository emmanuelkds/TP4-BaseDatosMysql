import { pool } from "../config/db.js";

export const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT f.*, c.nombre AS cliente
     FROM facturas f
     LEFT JOIN pedidos p ON f.id_pedido = p.id
     LEFT JOIN clientes c ON p.id_cliente = c.id
     ORDER BY f.fecha DESC`
  );
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT f.*, c.nombre AS cliente
     FROM facturas f
     LEFT JOIN pedidos p ON f.id_pedido = p.id
     LEFT JOIN clientes c ON p.id_cliente = c.id
     WHERE f.id = ?`,
    [id]
  );
  return rows[0];
};

export const create = async (data) => {
  const { numero, fecha, subtotal, iva, total, id_pedido } = data;
  const [r] = await pool.query(
    "INSERT INTO facturas (numero, fecha, subtotal, iva, total, id_pedido) VALUES (?, ?, ?, ?, ?, ?)",
    [numero, fecha, subtotal, iva, total, id_pedido]
  );
  return { id: r.insertId, ...data };
};

export const update = async (id, data) => {
  const { numero, fecha, subtotal, iva, total, id_pedido } = data;
  await pool.query(
    "UPDATE facturas SET numero=?, fecha=?, subtotal=?, iva=?, total=?, id_pedido=? WHERE id=?",
    [numero, fecha, subtotal, iva, total, id_pedido, id]
  );
  return { id, ...data };
};

export const remove = async (id) => {
  await pool.query("DELETE FROM facturas WHERE id=?", [id]);
};

// AGREGACIÓN: IVA total recaudado por mes
export const ivaPorMes = async () => {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes,
            SUM(subtotal) AS total_subtotal,
            SUM(iva) AS total_iva,
            SUM(total) AS total_facturado
     FROM facturas
     GROUP BY DATE_FORMAT(fecha, '%Y-%m')
     ORDER BY mes DESC`
  );
  return rows;
};