// ============================================================
// CONTROLLER DE MATERIALES
// ============================================================

import * as service from './materiales.service.js';
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
    return ok(res, data, 'Material creado correctamente', 201);
  } catch (e) {
    return fail(res, e.message);
  }
};

export const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    return ok(res, data, 'Material actualizado correctamente');
  } catch (e) {
    return fail(res, e.message);
  }
};

export const remove = async (req, res) => {
  try {
    const data = await service.remove(req.params.id);
    return ok(res, data, 'Material eliminado correctamente');
  } catch (e) {
    return fail(res, e.message);
  }
};