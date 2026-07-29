import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
} from '../controller/vehicleController.js'; 


const vehicleRouter=express.Router();



vehicleRouter.get('/search', searchVehicles);
router.post('/', authMiddleware, upload.single('image'), createVehicle);
vehicleRouter.get('/', getVehicles);
vehicleRouter.put('/:id', authMiddleware, updateVehicle);
vehicleRouter.delete('/:id', authMiddleware, adminMiddleware, deleteVehicle);
vehicleRouter.post('/:id/purchase', authMiddleware, purchaseVehicle);
vehicleRouter.post('/:id/restock', authMiddleware, adminMiddleware, restockVehicle);

export default vehicleRouter;