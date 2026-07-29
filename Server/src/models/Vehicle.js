import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['car', 'bike', 'truck', 'suv', 'van'], // adjust as needed
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    image:{
        type:String,
        required:[true, 'Image is required'],
    }
  },
  {
    timestamps: true, 
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;