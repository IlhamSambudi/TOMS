import { Router } from 'express';
import GroupController from '../controllers/groupController.js';
import groupFlightRoutes from './groupFlightRoutes.js';
import transportRoutes from './transportRoutes.js';
import assignmentRoutes from './assignmentRoutes.js';

const router = Router();

// Group CRUD
router.get('/operations-summary', GroupController.getOperationsSummary);
router.get('/', GroupController.getAll);
router.get('/:id', GroupController.getById);
router.get('/:id/full-itinerary', GroupController.getFullItinerary);
router.post('/', GroupController.create);
router.put('/:id', GroupController.update);
router.delete('/:id', GroupController.delete);

// Sub-resource routes
router.use('/:id/flights', groupFlightRoutes);
router.use('/:id/transport', transportRoutes);
router.use('/:id/assignments', assignmentRoutes);

export default router;
