import express from 'express';
import {
  createService,
  deleteService,
  getService,
  getServices,
  updateService,
  validateService
} from '../controllers/serviceController.js';
import { validate } from '../middlewares/validation.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(getServices)
  .post(requireAdmin, validateService, validate, createService);

router
  .route('/:id')
  .get(getService)
  .put(requireAdmin, validateService, validate, updateService)
  .delete(requireAdmin, deleteService);

export default router;
