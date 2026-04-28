// ============================================================
// RUTAS DE ÓRDENES DE TRABAJO
// ============================================================

import { Router } from 'express';
import * as controller from './ordenes.controller.js';

const router = Router();

router.get('/',       controller.getAll);    // GET    /api/v1/ordenes
router.get('/:id',    controller.getOne);    // GET    /api/v1/ordenes/:id
router.post('/',      controller.create);    // POST   /api/v1/ordenes
router.put('/:id',    controller.update);    // PUT    /api/v1/ordenes/:id
router.delete('/:id', controller.remove);   // DELETE /api/v1/ordenes/:id

export default router;