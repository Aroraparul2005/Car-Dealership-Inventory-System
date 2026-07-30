import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
} from '../controllers/vehiclesController.js'; 
import asyncHandler from '../utils/asyncHandeller.js';
import upload from '../middlewares/uploadMiddleware.js';


const vehicleRouter=express.Router();



vehicleRouter.get('/search', searchVehicles);
vehicleRouter.post('/', authMiddleware, upload.single('image'), createVehicle);
vehicleRouter.get('/', getVehicles);
vehicleRouter.put('/:id', authMiddleware, upload.single('image'), updateVehicle);
vehicleRouter.delete('/:id', authMiddleware, adminMiddleware, deleteVehicle);
vehicleRouter.post('/:id/purchase', authMiddleware, purchaseVehicle);
vehicleRouter.post('/:id/restock', authMiddleware, adminMiddleware, restockVehicle);

export default vehicleRouter;