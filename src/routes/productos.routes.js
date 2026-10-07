import { Router } from "express";
import * as ctrl from "../controllers/productos.controller.js";

const router = Router();

router.get("/stock-por-categoria", ctrl.stockCategoria); // ANTES de /:id
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

export default router;