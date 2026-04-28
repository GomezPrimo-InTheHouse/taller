// ============================================================
// CONTROLLER DE PRESUPUESTOS
// ============================================================

import { ok, fail } from '../common/response.helper.js'
import * as service from './presupuestos.service.js'

// GET /api/v1/presupuestos
export const getAll = async (req, res) => {
  try {
    const data = await service.findAll()
    return ok(res, data)
  } catch (e) {
    return fail(res, e.message)
  }
}

// GET /api/v1/presupuestos/:id
export const getOne = async (req, res) => {
  try {
    const data = await service.findOne(req.params.id)
    return ok(res, data)
  } catch (e) {
    return fail(res, e.message, 404)
  }
}

// POST /api/v1/presupuestos
export const create = async (req, res) => {
  try {
    const data = await service.create(req.body)
    return ok(res, data, 'Presupuesto creado correctamente', 201)
  } catch (e) {
    return fail(res, e.message)
  }
}

// PUT /api/v1/presupuestos/:id
export const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body)
    return ok(res, data, 'Presupuesto actualizado correctamente')
  } catch (e) {
    return fail(res, e.message)
  }
}

// DELETE /api/v1/presupuestos/:id
export const remove = async (req, res) => {
  try {
    const data = await service.remove(req.params.id)
    return ok(res, data)
  } catch (e) {
    return fail(res, e.message)
  }
}