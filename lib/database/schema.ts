import{integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users",{
    id: integer("id"),
    name: text("name"),
    age: integer("age")
})