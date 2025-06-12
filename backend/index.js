import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jobRoutes from './routes/jobs.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import morgan from 'morgan';


dotenv.config();

console.log(" 🚀 DATABASE_URL:", process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  console.log('✅ Ping received');
  res.send('pong');
});
app.post('/test', (req, res) => {
  console.log('Received POST request:', req.body);
  res.send('POST request received');
});

app.use(morgan('dev')); // Logging middleware

app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  }
); 
