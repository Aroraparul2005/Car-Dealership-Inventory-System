import express from 'express';
import errorHandler from './middlewares/errorHandeller.js';
import ApiError from './utils/apiHandeller.js';
import userRouter from './routes/authRoute.js';
import vehicleRouter from './routes/vehiclesRoute.js';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());

// routes
app.use('api/auth',userRouter);
app.use('api/vehicle',vehicleRouter);

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(errorHandler);

export default app;