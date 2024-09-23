import "dotenv/config";

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || "testingkey";
export const DATABASE_URL = process.env.DATABASE_URL || "sqlite::memory:";
