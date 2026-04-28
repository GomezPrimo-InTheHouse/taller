// ============================================================
// RUTAS DE PAGOS
// ============================================================

import { Router } from 'express';
import * as controller from './pagos.controller.js';

const router = Router();

router.get('/',       controller.getAll);    // GET    /api/v1/pagos
router.get('/:id',    controller.getOne);    // GET    /api/v1/pagos/:id
router.post('/',      controller.create);    // POST   /api/v1/pagos
router.put('/:id',    controller.update);    // PUT    /api/v1/pagos/:id
router.delete('/:id', controller.remove);   // DELETE /api/v1/pagos/:id

export default router;