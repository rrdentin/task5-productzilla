import express, { Express } from 'express';
import mongoose from 'mongoose';
import swaggerDocs from "./config/swagger.config";
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bookRoutes from './routes/bookRoutes';
import auth from './routes/auth';

// Load environment variables
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined');
}

const app: Express = express();
const port = process.env.PORT || 3000;
swaggerDocs(app);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/', auth);
app.use('/api/books', bookRoutes);

// Default route
app.get('/', (_, res) => {
  res.send('Library API is running!');
});

// Error handling middleware
app.use((err: Error, _: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
