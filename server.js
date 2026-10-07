import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./src/middlewares/errorHandler.js";

import proveedoresRoutes from "./src/routes/proveedores.routes.js";
import categoriasRoutes from "./src/routes/categorias.routes.js";
import productosRoutes from "./src/routes/productos.routes.js";
import clientesRoutes from "./src/routes/clientes.routes.js";
import empleadosRoutes from "./src/routes/empleados.routes.js";
import pedidosRoutes from "./src/routes/pedidos.routes.js";
import facturasRoutes from "./src/routes/facturas.routes.js";
import companiasRoutes from "./src/routes/companias.routes.js";
import enviosRoutes from "./src/routes/envios.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/proveedores", proveedoresRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/productos", productosRoutes);
app.use("/clientes", clientesRoutes);
app.use("/empleados", empleadosRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/facturas", facturasRoutes);
app.use("/companias", companiasRoutes);
app.use("/envios", enviosRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});