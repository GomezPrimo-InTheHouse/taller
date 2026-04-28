import { Router } from 'express'
import * as controller from './pagos.controller.js'

const router = Router()

router.get('/orden/:orden_trabajo_id', controller.getByOrden) // ← nueva — antes de /:id
router.get('/',       controller.getAll)
router.get('/:id',    controller.getOne)
router.post('/',      controller.create)
router.put('/:id',    controller.update)
router.delete('/:id', controller.remove)

export default router