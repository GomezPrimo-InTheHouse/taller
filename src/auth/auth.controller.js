// ============================================================
// CONTROLLER DE AUTH
// ============================================================

import * as service from './auth.service.js';
import { ok, fail } from '../common/response.helper.js';

export const login = async (req, res) => {
  try {
    const data = await service.login(req.body);
    return ok(res, data, 'Sesión iniciada correctamente');
  } catch (e) {
    return fail(res, e.message, 401);
  }
};

export const logout = async (req, res) => {
  try {
    await service.logout();
    return ok(res, null, 'Sesión cerrada correctamente');
  } catch (e) {
    return fail(res, e.message);
  }
};

export const me = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const data = await service.me(token);
    return ok(res, data);
  } catch (e) {
    return fail(res, e.message, 401);
  }
};