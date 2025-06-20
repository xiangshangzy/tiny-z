import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { DATABASE_URL } from "$env/static/private";
if (typeof DATABASE_URL === 'undefined')
  throw new Error('DATABASE Environment variable is not set')
const sql = neon(DATABASE_URL)
export const db = drizzle(sql);
