import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { globalErrorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Placeholder for routes
app.get('/api/status', (req, res) => {
  res.json({ message: 'Monitoring status will be here' });
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
