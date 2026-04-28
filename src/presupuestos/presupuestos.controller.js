// ============================================================
// CONTROLLER DE PRESUPUESTOS
// ============================================================

import * as service from './presupuestos.service.js';
import { ok, fail } from '../common/response.helper.js';

export const getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const data = await service.findAll(search);
    return ok(res, data);
  } catch (e) {
    return fail(res, e.message);
  }
};

export const getOne = async (req, res) => {
  try {
    const data = await service.findOne(req.params.id);
    return ok(res, data);
  } catch (e) {
    return fail(res, e.message, 404);
  }
};

export const create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    return ok(res, data, 'Presupuesto creado correctamente', 201);
  } catch (e) {
    return fail(res, e.message);
  }
};

export const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    return ok(res, data, 'Presupuesto actualizado correctamente');
  } catch (e) {
    return fail(res, e.message);
  }
};

export const remove = async (req, res) => {
  try {
    const data = await service.remove(req.params.id);
    return ok(res, data, 'Presupuesto eliminado correctamente');
  } catch (e) {
    return fail(res, e.message);
  }
};