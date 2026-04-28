// ============================================================
// RUTAS DE AUTH
// ============================================================

import { Router } from 'express';
import * as controller from './auth.controller.js';

const router = Router();

router.post('/login',    controller.login);    // POST /api/v1/auth/login
router.post('/logout',   controller.logout);   // POST /api/v1/auth/logout
router.get('/me',        controller.me);       // GET  /api/v1/auth/me

export default router;