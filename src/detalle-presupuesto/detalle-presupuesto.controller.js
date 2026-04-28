// ============================================================
// CONTROLLER DE DETALLE DE MATERIALES
// ============================================================

import { ok, fail } from '../common/response.helper.js'
import {
  findByPresupuesto,
  addMaterial,
  updateDetalle,
  removeMaterial,
} from './detalle-presupuesto.service.js'

// GET /api/v1/detalle-presupuesto/:presupuesto_id
export const getByPresupuesto = async (req, res) => {
  try {
    const data = await findByPresupuesto(req.params.presupuesto_id)
    return ok(res, data)
  } catch (e) {
    console.error('ERROR getByPresupuesto:', e.message)
    return fail(res, e.message)
  }
}

// POST /api/v1/detalle-presupuesto
export const add = async (req, res) => {
  try {
    const data = await addMaterial(req.body)
    return ok(res, data, 'Material agregado', 201)
  } catch (e) {
    console.error('ERROR add material:', e.message)
    return fail(res, e.message)
  }
}

// PUT /api/v1/detalle-presupuesto/:id
// Espera presupuesto_id en el body para verificar el estado
export const update = async (req, res) => {
  try {
    const { cantidad, precio_unitario, presupuesto_id } = req.body
    const data = await updateDetalle(
      req.params.id,
      cantidad,
      precio_unitario,
      presupuesto_id
    )
    return ok(res, data, 'Material actualizado')
  } catch (e) {
    console.error('ERROR update material:', e.message)
    return fail(res, e.message)
  }
}

// DELETE /api/v1/detalle-presupuesto/:id
// Espera presupuesto_id en query param para verificar el estado
export const remove = async (req, res) => {
  try {
    const { presupuesto_id } = req.query
    const data = await removeMaterial(req.params.id, presupuesto_id)
    return ok(res, data)
  } catch (e) {
    console.error('ERROR remove material:', e.message)
    return fail(res, e.message)
  }
}