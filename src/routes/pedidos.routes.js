import { Router } from "express";
import * as ctrl from "../controllers/pedidos.controller.js";

const router = Router();
router.get("/total-por-mes", ctrl.totalMes);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);
router.post("/:id/detalle", ctrl.addDetalle);

export default router;