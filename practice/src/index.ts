import 'dotenv/config';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

import route from './routes';
import DatabaseManager from './config/db';
import { handleRouteNotFound, handleGeneralError } from '@middlewares/error-handler';
import { LOGGER } from './constants';

const PORT = process.env.PORT || 3000;
const PRODUCTION_ENVIRONMENT = 'production';
const SETTING = process.env.SETTING;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (SETTING === PRODUCTION_ENVIRONMENT) {
  // Log only 5xx responses to console
  app.use(
    morgan(LOGGER.FORMAT, {
      skip: (_: Request, res: Response) => res.statusCode < 500,
    })
  );
} else {
  // Log all responses to console
  app.use(morgan(LOGGER.FORMAT));
}

// Handle routes
route(app);

/**
 * Handle middleware with Top-down priority
 * - General error
 * - Route not found errors
 */
app.use(handleGeneralError);
app.use(handleRouteNotFound);

const startApp = async () => {
  try {
    // Connect to database before run app
    const database = DatabaseManager.getDatabaseManager();
    await database.connect();

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(error);
  }
};

startApp();
