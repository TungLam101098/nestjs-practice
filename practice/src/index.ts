import 'dotenv/config';
import express from 'express';

import DatabaseManager from './config/db';

const PORT = process.env.PORT || 3000;
const app = express();

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
