import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

app.use(express.json());
app.use(cors());
 
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found!',
  });
  next();
});

export default app;
