import { pool } from "../config/db.js";

// JOIN con cliente y empleado
export const findAll = async (filtros = {}) => {
  let sql = `
    SELECT p.id, p.fecha, p.estado,
           c.nombre AS cliente,
           CONCAT(e.nombre, ' ', e.apellido) AS empleado
    FROM pedidos p
    LEFT JOIN clientes c ON p.id_cliente = c.id
    LEFT JOIN empleados e ON p.id_empleado = e.id
    WHERE 1 = 1
  `;
  const params = [];
  if (filtros.estado) { sql += " AND p.estado = ?"; params.push(filtros.estado); }
  if (filtros.id_cliente) { sql += " AND p.id_cliente = ?"; params.push(filtros.id_cliente); }
  sql += " ORDER BY p.fecha DESC";
  const [rows] = await pool.query(sql, params);
  return rows;
};

// JOIN completo + detalle del pedido
export const findById = async (id) => {
  const [pedidoRows] = await pool.query(
    `SELECT p.id, p.fecha, p.estado,
            c.nombre AS cliente, c.direccion AS direccion_cliente,
            CONCAT(e.nombre, ' ', e.apellido) AS empleado
     FROM pedidos p
     LEFT JOIN clientes c ON p.id_cliente = c.id
     LEFT JOIN empleados e ON p.id_empleado = e.id
     WHERE p.id = ?`,
    [id]
  );
  if (!pedidoRows[0]) return null;

  const [detalle] = await pool.query(
    `SELECT dp.id, pr.nombre AS producto, dp.cantidad,
            dp.precio_unitario,
            (dp.cantidad * dp.precio_unitario) AS subtotal
     FROM detalle_pedido dp
     LEFT JOIN productos pr ON dp.id_producto = pr.id
     WHERE dp.id_pedido = ?`,
    [id]
  );

  return { ...pedidoRows[0], detalle };
};

export const create = async (data) => {
  const { fecha, id_cliente, id_empleado, estado } = data;
  const [r] = await pool.query(
    "INSERT INTO pedidos (fecha, id_cliente, id_empleado, estado) VALUES (?, ?, ?, ?)",
    [fecha, id_cliente, id_empleado, estado || "pendiente"]
  );
  return { id: r.insertId, ...data };
};

export const update = async (id, data) => {
  const { fecha, id_cliente, id_empleado, estado } = data;
  await pool.query(
    "UPDATE pedidos SET fecha=?, id_cliente=?, id_empleado=?, estado=? WHERE id=?",
    [fecha, id_cliente, id_empleado, estado, id]
  );
  return { id, ...data };
};

export const remove = async (id) => {
  await pool.query("DELETE FROM pedidos WHERE id=?", [id]);
};

// Detalle: agregar producto a un pedido
export const addDetalle = async (id_pedido, data) => {
  const { id_producto, cantidad, precio_unitario } = data;
  const [r] = await pool.query(
    "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
    [id_pedido, id_producto, cantidad, precio_unitario]
  );
  return { id: r.insertId, id_pedido, ...data };
};

// AGREGACIÓN: total facturado por mes
export const totalPorMes = async () => {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes,
            COUNT(*) AS cantidad_pedidos
     FROM pedidos
     GROUP BY mes
     ORDER BY mes DESC`
  );
  return rows;
};