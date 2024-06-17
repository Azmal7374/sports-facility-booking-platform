import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';

const app: Application = express();

app.use(express.json());
app.use(cors());

// application routes
app.use('/api', router);


app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found!',
  });
  next();
});

export default app;
