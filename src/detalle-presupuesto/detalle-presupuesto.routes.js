// ============================================================
// RUTAS DE DETALLE DE MATERIALES POR PRESUPUESTO
// ============================================================

import { Router } from 'express'
import * as controller from './detalle-presupuesto.controller.js'

const router = Router()

// GET    /api/v1/detalle-presupuesto/:orden_trabajo_id
router.get('/:orden_trabajo_id', controller.getByPresupuesto)

// POST   /api/v1/detalle-presupuesto
router.post('/', controller.add)

// PUT    /api/v1/detalle-presupuesto/:id
router.put('/:id', controller.update)

// DELETE /api/v1/detalle-presupuesto/:id
router.delete('/:id', controller.remove)

export default router