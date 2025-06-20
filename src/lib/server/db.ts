import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "$env/static/private";
if (typeof DATABASE_URL === 'undefined')
  throw new Error('DATABASE Environment variable is not set')
export const db = drizzle(DATABASE_URL);
