import * as model from "../models/companias.model.js";

export const getAll = async (req, res, next) => {
  try { res.json(await model.findAll()); } catch (e) { next(e); }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await model.findById(req.params.id);
    if (!data) return res.status(404).json({ error: "Compañía no encontrada" });
    res.json(data);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try { res.status(201).json(await model.create(req.body)); } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const ex = await model.findById(req.params.id);
    if (!ex) return res.status(404).json({ error: "Compañía no encontrada" });
    res.json(await model.update(req.params.id, req.body));
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const ex = await model.findById(req.params.id);
    if (!ex) return res.status(404).json({ error: "Compañía no encontrada" });
    await model.remove(req.params.id);
    res.json({ mensaje: "Compañía eliminada" });
  } catch (e) { next(e); }
};

export const envios = async (req, res, next) => {
  try { res.json(await model.enviosPorCompania()); } catch (e) { next(e); }
};