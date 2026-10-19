export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  if (process.env.NODE_ENV !== "production") console.error(err.stack);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({ error: "Registro duplicado" });
  }
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ error: "Referencia inexistente" });
  }
  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(400).json({ error: "No se puede eliminar: tiene registros asociados" });
  }
  if (err.code === "ER_CHECK_CONSTRAINT_VIOLATED") {
    return res.status(400).json({ error: "Dato inválido: viola una restricción de la base" });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  res.status(500).json({ error: "Error interno del servidor" });
};