import 'dotenv/config';
import express from 'express';

import route from './routes';
import DatabaseManager from './config/db';
import { handleRouteNotFound } from './middlewares/error-handler';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle routes
route(app);

// Handle middleware
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
