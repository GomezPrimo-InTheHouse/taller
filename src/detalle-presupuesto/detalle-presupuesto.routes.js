// ============================================================
// RUTAS DE DETALLE DE MATERIALES
// ============================================================

import { Router } from 'express'
import {
  getByPresupuesto,
  add,
  update,
  remove,
} from './detalle-presupuesto.controller.js'

const router = Router()

router.get('/:presupuesto_id', getByPresupuesto)
router.post('/',               add)
router.put('/:id',             update)
router.delete('/:id',          remove)

export default router