// ============================================================
// RUTAS DE CLIENTES
// ============================================================

import { Router } from 'express';
import * as controller from './clientes.controller.js';

const router = Router();

router.get('/',       controller.getAll);    // GET    /api/v1/clientes
router.get('/:id',    controller.getOne);    // GET    /api/v1/clientes/:id
router.post('/',      controller.create);    // POST   /api/v1/clientes
router.put('/:id',    controller.update);    // PUT    /api/v1/clientes/:id
router.delete('/:id', controller.remove);   // DELETE /api/v1/clientes/:id

export default router;