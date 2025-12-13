import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sweetsRoutes from './routes/sweetsRoutes';

const app: Application = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://tdd-kata-sweet-shop-management-syst.vercel.app',
  'https://sweet-tdd-incubyte.iampruthvi.tech'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

export default app;

