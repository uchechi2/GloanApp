import { parseStringify } from "../utils";

// const sqlite3 = require("sqlite3").verbose();
const db = require("better-sqlite3")("loan7.db");

// const db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     return console.error(err.message);
//   } else {
//     return console.info("success");
//   }
// });

export const createUserTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS customerDetail(
    id PRIMARY KEY ,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postalCode TEXT NOT NULL,
    dateOfBirth TEXT NOT NULL,
    bvn TEXT NOT NULL,
    email  TEXT,
    phoneNumber TEXT NOT NULL,
    password  NOT NULL,
    age INTEGER,
    timeStamp TEXT NOT NULL
)
`;
  const tableState = db.prepare(sql).run();
  if (tableState) {
    return "success";
  } else {
    return "failed";
  }
};

export const createSession = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS session(
    id INTEGER PRIMARY KEY,
    sessionId TEXT NOT NULL

)
  `;
  db.prepare(sql).run();
};

export const createStaffSession = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS staffSession(
    id INTEGER PRIMARY KEY,
    sessionId TEXT NOT NULL

)
  `;
  db.prepare(sql).run();
};

const createSavingsTable = () => {
  const sql = `
    CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    timeStamp TEXT NOT NULL
)
  `;
  db.prepare(sql).run();
};

const createTransactionTable = () => {
  const sql = `
    CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    timeStamp TEXT NOT NULL
)
  `;
  db.prepare(sql).run();
};

const createLoanTable = () => {
  const sql = `
    CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    timeStamp TEXT NOT NULL
)
  `;
  db.prepare(sql).run();
};

export const insertUser = (password, userData, genId) => {
  console.log(userData);
  // console.log(idTest);
  const {
    phoneNumber,
    firstName,
    lastName,
    address1,
    city,
    state,
    postalCode,
    dateOfBirth,
    bvn,
    // password,
  } = userData;

  const timestamp = Date.now();

  const sql = `
    INSERT INTO customerDetail(id, firstName, lastName, address, city, state, postalCode, dateOfBirth, bvn, phoneNumber, password, timeStamp)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
   `;
  // db.prepare(sql).run(...userData);
  db.prepare(sql).run(
    genId,
    firstName,
    lastName,
    address1,
    city,
    state,
    postalCode,
    dateOfBirth,
    bvn,
    phoneNumber,
    password,
    timestamp
  );

  // db.run(sql,[name,age], (err) => {
  //    if (err) return console.error(err.message);
  //  });
};
export const insertSession = (id, sessionId) => {
  //
  const sql = `
    INSERT INTO session(id, sessionId)
    VALUES (?,?)
   `;
  db.prepare(sql).run(id, sessionId);

  // db.run(sql,[name,age], (err) => {
  //    if (err) return console.error(err.message);
  //  });
};
export const insertStaffSession = (id, sessionId) => {
  //
  const sql = `
    INSERT INTO staffSession(id, sessionId)
    VALUES (?,?)
   `;
  db.prepare(sql).run(id, sessionId);

  // db.run(sql,[name,age], (err) => {
  //    if (err) return console.error(err.message);
  //  });
};
// createTable()

export const getSession = () => {
  const sql = `
        SELECT * FROM session
    `;
  const rows = db.prepare(sql).all();
  // console.log("This is it ", rows[0].sessionId);
  const session = rows;
  return parseStringify(session);
};

export const getStaffSession = () => {
  const sql = `
        SELECT * FROM staffSession
    `;
  const rows = db.prepare(sql).all();
  // console.log("This is it ", rows[0].sessionId);
  const session = rows;
  return parseStringify(session);
};

export const getUsers = () => {
  const sql = `
        SELECT * FROM customerDetail
    `;
  const rows = db.prepare(sql).all();
  //     db.all(sql, [], (err, rows) => {
  //   if (err) return console.error(err.message);
  //   rows.forEach((row) => {
  //     console.log(row);
  //   });
  // });
  console.log(rows);
};

export const getUser = (phoneNumber) => {
  const sql = `SELECT * FROM customerDetail
    WHERE phoneNumber = ?
    `;
  const user = db.prepare(sql).all(phoneNumber);

  // console.log(user);
  // console.log("this is coming from staatment: ", email);
  return parseStringify(user);
};

export const checkUser = (phoneNumber) => {
  const sql = `SELECT * FROM customerDetail
    WHERE phoneNumber = ?
    `;
  const user = db.prepare(sql).all(phoneNumber);

  // console.log(user.length);
  // console.log(user);

  if (user.length > 0) {
    return "exist";
  } else {
    return "doesnot exist";
  }
  // console.log("this is coming from sentsssss: ", email);
  // return parseStringify(user);
};
// getUser(1);
// getUsers();

export const checkUserExistence = (phoneNumber) => {
  const sql = `SELECT * FROM customerDetail
    WHERE phoneNumber = ?
    `;
  const result = db.prepare(sql).all(phoneNumber);
  const user = result;
  console.log(user);

  if (result.length === 1) {
    return true;
  } else {
    return false;
  }
};

export const checkStaffExistence = (username) => {
  const sql = `SELECT * FROM staffs
    WHERE username = ?
    `;
  const result = db.prepare(sql).all(username);
  const user = result;
  console.log(user);

  if (result.length === 1) {
    return true;
  } else {
    return false;
  }
};

export const checkAdminExistence = (username) => {
  const sql = `SELECT * FROM admin
    WHERE username = ?
    `;
  const result = db.prepare(sql).all(username);
  const user = result;
  console.log(user);

  if (result.length === 1) {
    return true;
  } else {
    return false;
  }
};

export const signInConfirmation = (phoneNumber, password) => {
  const sql = `SELECT * FROM customerDetail
    WHERE phoneNumber = ? AND password =?
    `;
  const result = db.prepare(sql).all(phoneNumber, password);

  // console.log(user);
  // console.log("this is coming from staatment: ", email);
  // user = parseStringify(user);
  const user = result[0]?.id;
  console.log(user);

  if (result.length > 0) {
    return user;
  } else {
    return "failed";
  }
};

export const signInStaffConfirmation = (username, password) => {
  const sql = `SELECT * FROM staffs
    WHERE username = ? AND password =?
    `;
  const result = db.prepare(sql).all(username, password);

  // console.log(user);
  // console.log("this is coming from staatment: ", email);
  // user = parseStringify(user);
  const user = result[0]?.id;
  console.log(user);

  if (result.length > 0) {
    return user;
  } else {
    return "failed";
  }
};

export const confirmAdmin = (username, password) => {
  const sql = `SELECT * FROM admin
    WHERE username = ? AND password =?
    `;
  const result = db.prepare(sql).all(username, password);

  // console.log(user);
  // console.log("this is coming from staatment: ", email);
  // user = parseStringify(user);
  const user = result[0]?.id;
  console.log(user);

  if (result.length > 0) {
    return user;
  } else {
    return "failed";
  }
};

export const setSession = (userId) => {
  const sql = `
    UPDATE session 
    SET sessionId =? WHERE id = 1;
  `;
  const result = db.prepare(sql).run(userId);
  if (result) {
    return "success";
  } else {
    return "failed";
  }
};

export const setStaffSession = (userId) => {
  const sql = `
    UPDATE staffSession 
    SET sessionId =? WHERE id = 1;
  `;
  const result = db.prepare(sql).run(userId);
  if (result) {
    console.log("success");
    return "success";
  } else {
    return "failed";
  }
};

export const startSession = (userId) => {
  const sql = `SELECT * FROM customerDetail
    WHERE id = ?
    `;
  const result = db.prepare(sql).all(userId);
  const user = result[0];

  // console.log(user);
  // console.log("this is coming from staatment: ", email);
  return parseStringify(user);
  // return user;
};

export const startStaffSession = (userId) => {
  const sql = `SELECT * FROM staffs
    WHERE id = ?
    `;
  const result = db.prepare(sql).all(userId);
  const user = result[0];

  // console.log(user);
  // console.log("this is coming from staatment: ", email);
  return parseStringify(user);
  // return user;
};

export const startAdminSession = (userId) => {
  const sql = `SELECT * FROM staffs
    WHERE id = ?
    `;
  const result = db.prepare(sql).all(userId);
  const user = result[0];

  // console.log(user);
  // console.log("this is coming from staatment: ", email);
  return parseStringify(user);
  // return user;
};

// module.exports = createUserTable;
