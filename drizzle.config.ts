import {defineConfig} from 'drizzle-kit';

export default defineConfig({
    schema: './lib/database/schema.ts',
    out: './lib/database/drizzle',
    dialect: 'sqlite',
dbCredentials:{
    url:'./lib/database/sqlite.db',
}
    
}) 