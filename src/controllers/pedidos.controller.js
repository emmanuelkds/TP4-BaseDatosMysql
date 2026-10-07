import * as model from "../models/pedidos.model.js";

export const getAll = async (req, res, next) => {
  try { res.json(await model.findAll(req.query)); } catch (e) { next(e); }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await model.findById(req.params.id);
    if (!data) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(data);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try { res.status(201).json(await model.create(req.body)); } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const ex = await model.findById(req.params.id);
    if (!ex) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(await model.update(req.params.id, req.body));
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const ex = await model.findById(req.params.id);
    if (!ex) return res.status(404).json({ error: "Pedido no encontrado" });
    await model.remove(req.params.id);
    res.json({ mensaje: "Pedido eliminado" });
  } catch (e) { next(e); }
};

export const addDetalle = async (req, res, next) => {
  try {
    const ex = await model.findById(req.params.id);
    if (!ex) return res.status(404).json({ error: "Pedido no encontrado" });
    res.status(201).json(await model.addDetalle(req.params.id, req.body));
  } catch (e) { next(e); }
};

export const totalMes = async (req, res, next) => {
  try { res.json(await model.totalPorMes()); } catch (e) { next(e); }
};