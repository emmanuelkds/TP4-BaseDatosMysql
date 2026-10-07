import { Router } from "express";
import * as ctrl from "../controllers/companias.controller.js";

const router = Router();
router.get("/envios-por-compania", ctrl.envios);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

export default router;
