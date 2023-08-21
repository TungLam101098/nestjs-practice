import mongoose from 'mongoose';

import { DATABASE } from '../../constants';

let databaseManager: DatabaseManager | null = null;

const MONGO_URL = process.env.MONGO_URL || DATABASE.MONGO_URL_DEFAULT;

class DatabaseManager {
  /**
   * Connect to Mongoose via URL
   *
   */
  async connect() {
    try {
      await mongoose.connect(MONGO_URL);

      console.log('Connect to mongo database successfully');
    } catch (error) {
      console.error('Cannot connect to mongo database', error);

      // Exit app when cannot connect to mongo database
      process.exit();
    }
  }

  /**
   * Get singleton database manager
   *
   */
  static getDatabaseManager() {
    if (!databaseManager) {
      databaseManager = new DatabaseManager();
    }

    return databaseManager;
  }
}

export default DatabaseManager;
