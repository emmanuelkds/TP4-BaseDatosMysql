export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({ error: "Registro duplicado" });
  }
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ error: "Referencia inexistente" });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  res.status(500).json({ error: "Error interno del servidor" });
};