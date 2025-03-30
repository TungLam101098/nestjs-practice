/** 
 * Enable UUID extension for generating UUIDs in PostgreSQL
 * Required for uuid_generate_v4() function used in table migrations
 * This extension is not enabled by default in PostgreSQL
 */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
