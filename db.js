import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, {
  prepare: false,
  idle_timeout: 0, // Prevents idle connections from being closed
  max: 10, // Set max connections if needed
});

export default sql;
