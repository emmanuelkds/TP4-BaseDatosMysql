import { Router } from "express";
import * as ctrl from "../controllers/clientes.controller.js";

const router = Router();
router.get("/total-por-cliente", ctrl.totalCliente);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

export default router;