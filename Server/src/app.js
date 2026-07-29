import express from 'express';
import errorHandler from './middleware/errorHandler.js';
import ApiError from './utils/apiHandeller.js';
import userRoute from './routes/userRoute.js';
import vehicleRouteRoute from './routes/vehiclesRoute.js';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());

// routes
app.use('api/auth',userRoute);
app.use('api/vehicle',vehicleRoute);

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(errorHandler);

export default app;