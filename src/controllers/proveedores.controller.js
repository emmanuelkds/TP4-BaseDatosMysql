import * as model from "../models/proveedores.model.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await model.findAll();
    res.json(data);
  } catch (err) { next(err); }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await model.findById(req.params.id);
    if (!data) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.json(data);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const data = await model.create(req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const existe = await model.findById(req.params.id);
    if (!existe) return res.status(404).json({ error: "Proveedor no encontrado" });
    const data = await model.update(req.params.id, req.body);
    res.json(data);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const existe = await model.findById(req.params.id);
    if (!existe) return res.status(404).json({ error: "Proveedor no encontrado" });
    await model.remove(req.params.id);
    res.json({ mensaje: "Proveedor eliminado" });
  } catch (err) { next(err); }
};