// ============================================================
// RUTAS DE PRESUPUESTOS
// ============================================================

import { Router } from 'express';
import * as controller from './presupuestos.controller.js';

const router = Router();

router.get('/',       controller.getAll);    // GET    /api/v1/presupuestos
router.get('/:id',    controller.getOne);    // GET    /api/v1/presupuestos/:id
router.post('/',      controller.create);    // POST   /api/v1/presupuestos
router.put('/:id',    controller.update);    // PUT    /api/v1/presupuestos/:id
router.delete('/:id', controller.remove);   // DELETE /api/v1/presupuestos/:id

export default router;