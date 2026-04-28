// ============================================================
// RUTAS DE VEHÍCULOS
// ============================================================

import { Router } from 'express';
import * as controller from './vehiculos.controller.js';

const router = Router();

router.get('/',       controller.getAll);    // GET    /api/v1/vehiculos
router.get('/:id',    controller.getOne);    // GET    /api/v1/vehiculos/:id
router.post('/',      controller.create);    // POST   /api/v1/vehiculos
router.put('/:id',    controller.update);    // PUT    /api/v1/vehiculos/:id
router.delete('/:id', controller.remove);   // DELETE /api/v1/vehiculos/:id

export default router;