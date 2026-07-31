import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandeller.js';
import ApiError from './utils/apiHandeller.js';
import userRouter from './routes/authRoute.js';
import vehicleRouter from './routes/vehiclesRoute.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://car-dealership-inventory-system-two-theta.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

// routes
app.use('/api/auth',userRouter);
app.use('/api/vehicles',vehicleRouter);

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(errorHandler);

export default app;