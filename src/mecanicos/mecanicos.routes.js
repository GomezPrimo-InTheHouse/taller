// ============================================================
// RUTAS DE MECÁNICOS
// ============================================================

import { Router } from 'express';
import * as controller from './mecanicos.controller.js';

const router = Router();

router.get('/',       controller.getAll);    // GET    /api/v1/mecanicos
router.get('/:id',    controller.getOne);    // GET    /api/v1/mecanicos/:id
router.post('/',      controller.create);    // POST   /api/v1/mecanicos
router.put('/:id',    controller.update);    // PUT    /api/v1/mecanicos/:id
router.delete('/:id', controller.remove);   // DELETE /api/v1/mecanicos/:id

export default router;