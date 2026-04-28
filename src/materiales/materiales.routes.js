// ============================================================
// RUTAS DE MATERIALES
// ============================================================

import { Router } from 'express';
import * as controller from './materiales.controller.js';

const router = Router();

router.get('/',       controller.getAll);    // GET    /api/v1/materiales
router.get('/:id',    controller.getOne);    // GET    /api/v1/materiales/:id
router.post('/',      controller.create);    // POST   /api/v1/materiales
router.put('/:id',    controller.update);    // PUT    /api/v1/materiales/:id
router.delete('/:id', controller.remove);   // DELETE /api/v1/materiales/:id

export default router;