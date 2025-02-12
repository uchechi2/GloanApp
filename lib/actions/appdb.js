// const sqlite3 = require("sqlite3").verbose();
import sqlite3 from "sqlite3";
const db = new sqlite3.Database(
  "./testloan.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.error(err.message);
    } else {
      return console.info("success");
    }
  }
);
//create table

export const insertUser = (name, email) => {
  let sql = `CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY Key, first_name, email)`;
  db.run(sql);
  //insert data into table
  sql = `INSERT INTO users(first_name,email) VALUES (?,?)`;
  db.run(sql, [name, email], (err) => {
    if (err) return console.error(err.message);
  });
};
