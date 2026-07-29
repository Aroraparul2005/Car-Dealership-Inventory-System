import Vehicle from '../models/Vehicle.js';
import ApiError from '../utils/apiHandeller.js';
import fs from 'fs';

export const createVehicleService=async(data) => {
  const vehicle=await Vehicle.create(data);
  return vehicle;
};


const LIMIT = 10;// for pagination

export const getVehiclesService=async({ page = 1 }) => {
  const pageNumber = Math.max(1, Number(page));
  const skip = (pageNumber - 1) * LIMIT;

  const [vehicles, total] =await Promise.all([
    Vehicle.find().skip(skip).limit(LIMIT).sort({ createdAt: -1 }),
    Vehicle.countDocuments(),
  ]);

  return {
    vehicles,
    pagination: {
      page: pageNumber,
      limit: LIMIT,
      total,
      totalPages: Math.ceil(total / LIMIT),
    },
  };
};

export const searchVehiclesService=async({
  make,
  model,
  category,
  minPrice,
  maxPrice,
  page = 1,
}) => {
  const filter = {};

  if (make) filter.make = { $regex: make, $options: 'i' };
  if (model) filter.model = { $regex: model, $options: 'i' };
  if (category) filter.category = category.toLowerCase();

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const pageNumber = Math.max(1, Number(page));
  const skip = (pageNumber - 1) * LIMIT;

  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter).skip(skip).limit(LIMIT).sort({ createdAt: -1 }),
    Vehicle.countDocuments(filter),
  ]);

  return {
    vehicles,
    pagination: {
      page: pageNumber,
      limit: LIMIT,
      total,
      totalPages: Math.ceil(total / LIMIT),
    },
  };
};

export const deleteVehicleService=async(id) => {
  const vehicle=await Vehicle.findByIdAndDelete(id);

  if(!vehicle){
    throw new ApiError(404,'Vehicle not found');
  }

  return vehicle;
};

export const purchaseVehicleService=async(id, quantity = 1) => {
  if (quantity<=0) {
    throw new ApiError(400, 'quantity must be a positive number');
  }

  const vehicle=await Vehicle.findById(id);
  if(!vehicle){
    throw new ApiError(404,'Vehicle not found');
  }

  if (vehicle.quantity<quantity) {
    throw new ApiError(400,'Not available');
  }

  vehicle.quantity-=quantity;
  await vehicle.save();

  return vehicle;
};

export const restockVehicleService=async(id, quantity = 1) => {
  if(quantity<=0){
    throw new ApiError(400,'quantity shuld be a positive number');
  }

  const vehicle=await Vehicle.findById(id);
  if (!vehicle) {
    throw new ApiError(404,'Vehicle not found');
  }

  vehicle.quantity += quantity;
  await vehicle.save();

  return vehicle;
};

export const updateVehicleService = async (id, updates, newImagePath) => {
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  if (newImagePath) {
    const oldImagePath = vehicle.image;
    updates.image = newImagePath;

    if (oldImagePath) {
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Failed to delete old image:', err.message);
      });
    }
  }

  Object.assign(vehicle, updates);
  await vehicle.save(); // .save() instead of findByIdAndUpdate so runValidators + old-image cleanup both work cleanly

  return vehicle;
};