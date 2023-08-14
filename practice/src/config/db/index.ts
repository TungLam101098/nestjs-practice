import mongoose from 'mongoose';

let databaseManager: DatabaseManager | null = null;

const MONGO_URL_DEFAULT = 'mongodb://127.0.0.1/my-database';
const MONGO_URL = process.env.MONGO_URL || MONGO_URL_DEFAULT;

/**
 * Class of database manager using singleton pattern
 */
class DatabaseManager {
  /**
   * Connect to Mongoose via URL
   *
   */
  async connect() {
    try {
      await mongoose.connect(MONGO_URL);

      console.log('connect to database successfully');
    } catch (error) {
      console.error('cannot connect to mongo database', error);

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
