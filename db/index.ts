import {BetterSQLite3Database, drizzle} from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('database.db');
export const db:BetterSQLite3Database = drizzle(sqlite);


// const result = await db.select().from(users);