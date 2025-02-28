import { timeStamp } from "console";
import { parseStringify } from "../utils";
import 

const db = require("better-sqlite3")("loan7.db");

export const createAdminTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS admin(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    timeStamp TEXT NOT NULL
    )
  `;
  db.prepare(sql).run();
};

export const createStaffsTable = () => {
  // console.log("we here staffs");
  const sql = `
    CREATE TABLE IF NOT EXISTS staffs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    timeStamp TEXT NOT NULL
    )
  `;
  // console.log("we here staffs");
  const tableState = db.prepare(sql).run();
  if (tableState) {
    return "success";
  } else {
    return "failed";
  }
};

export const createAdminAccount = (username, password) => {
  const timestamp = Date.now();

  const sql = `
    INSERT INTO admin(username,password, timeStamp)
    VALUES (?,?,?)
   `;
  db.prepare(sql).run(username, password, timestamp);
};

export const createStaffAccount = (username, password) => {
  const timestamp = Date.now();

  console.log(username, password);
  const sql = `
    INSERT INTO staffs(username,password,timeStamp)
    VALUES (?,?,?)
   `;
  db.prepare(sql).run(username, password, timestamp);
};

export const registerOwner = (username, password) => {
  const timestamp = Date.now();

  console.log(username, password);
  const sql = `
    INSERT INTO admin(username,password,timeStamp)
    VALUES (?,?,?)
   `;
  db.prepare(sql).run(username, password, timestamp);
};

export const updateAdminAccount = (username, password) => {
  const timestamp = Date.now();

  const sql = `
    UPDATE staffs
    SET password =?, timeStamp =? WHERE username = ?
  `;
  const result = db.prepare(sql).run(password, timestamp, username);
  if (result) {
    return "success";
  } else {
    return "failed";
  }
};

export const updateStaffAccount = (username, password) => {
  const sql = `
    UPDATE staffs
    SET password =?, timeStamp=? WHERE username = ?
  `;
  const result = db.prepare(sql).run(password, timestamp, username);
  if (result) {
    return "success";
  } else {
    return "failed";
  }
};

export const checkStaff = (username) => {
  const sql = `SELECT * FROM staffs
    WHERE username = ?
    `;
  const user = db.prepare(sql).all(username);

  if (user.length > 0) {
    return "exist";
  } else {
    return "doesnot exist";
  }
};

export const getAdmin = () => {
  createAdminTable();
  const sql = `
        SELECT * FROM admin
    `;
  const rows = db.prepare(sql).all();
  // console.log("This is it ", rows[0].sessionId);
  const session = rows;
  return parseStringify(session);
};
