import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import {
  createVehicleService,
  getVehiclesService,
  searchVehiclesService,
  updateVehicleService,
  deleteVehicleService,
  purchaseVehicleService,
  restockVehicleService,
} from '../service/vehicleService.js';

// @route POST /api/vehicles
export const createVehicle = asyncHandler(async (req, res) => {
  const { make, model, category, price, quantity } = req.body;

  if (!make || !model || !category || price === undefined) {
    throw new ApiError(400, 'make, model, category, and price are required');
  }

  // multer gives req.file for .single(), req.files for .array()
  let image;
  if (req.files && req.files.length > 0) {
    image = req.files.map((f) => f.path)[0]; // schema only stores one path — see note below
  } else if (req.file) {
    image = req.file.path;
  }

  if (!image) {
    throw new ApiError(400,'Image is required');
  }

  const vehicle = await createVehicleService({
    make,
    model,
    category,
    price,
    quantity: quantity || 0,
    image,
  });

  res.status(201).json(vehicle);
});

// @route GET /api/vehicles
export const getVehicles=asyncHandler(async(req,res) => {
  const vehicles=await getVehiclesService();
  res.status(200).json(vehicles);
});

// @route GET /api/vehicles/search
export const searchVehicles=asyncHandler(async (req, res) => {
  const vehicles=await searchVehiclesService(req.query);
  res.status(200).json(vehicles);
});

// @route PUT /api/vehicles/:id
export const updateVehicle=asyncHandler(async (req, res) => {
  const vehicle=await updateVehicleService(req.params.id, req.body);
  res.status(200).json(vehicle);
});

// @route DELETE /api/vehicles/:id
export const deleteVehicle=asyncHandler(async (req, res) => {
  await deleteVehicleService(req.params.id);
  res.status(200).json({ message: 'Vehicle deleted successfully' });
});

// @route POST /api/vehicles/:id/purchase
export const purchaseVehicle=asyncHandler(async (req, res) => {
  const {quantity=1}=req.body;
  const vehicle = await purchaseVehicleService(req.params.id, quantity);
  res.status(200).json({ message: 'Purchase successful', vehicle });
});

// @route POST /api/vehicles/:id/restock
export const restockVehicle=asyncHandler(async (req, res) => {
  const {quantity=1}=req.body;
  const vehicle = await restockVehicleService(req.params.id, quantity);
  res.status(200).json({ message: 'Restock successful', vehicle });
});
