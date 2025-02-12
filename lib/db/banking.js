import { timeStamp } from "console";
import { parseStringify } from "../utils";

const db = require("better-sqlite3")("loan7.db");

export const createBank = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS savings(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id TEXT NOT NULL,
    name TEXT NOT NULL,
    availableBalance INTEGER,
    currentBalance INTEGER,
    dateOfCreation TEXT NOT NULL,
    typeOfSavings TEXT,
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

export const createTransactionTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS transactions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dateOfTransaction TEXT NOT NULL,
    typeOfTransaction TEXT NOT NULL,
    amount INTEGER NOT NULL,
    formOfTransaction TEXT NOT NULL,
    account_id TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
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

export const createAccount = (userData, genId) => {
  // console.log(userData);
  // console.log(idTest);
  const { firstName, lastName } = userData;

  const name = lastName + " " + firstName;

  const todays_date = new Date();
  let day, date, month, year;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // day = todays_date.getDay();
  date = todays_date.getDate();
  month = months[todays_date.getMonth()];
  year = todays_date.getFullYear();
  console.log(year);
  // const creationDate = `${date} ${month} ${year}`;
  const creationDate = todays_date.toString();

  console.log("Account entered");

  const timestamp = Date.now();

  const sql = `
    INSERT INTO savings(account_id, name, dateOfCreation, availableBalance,
    currentBalance, timeStamp)
    VALUES (?,?,?,?,?,?)
   `;
  // db.prepare(sql).run(...userData);
  const check = db.prepare(sql).run(genId, name, creationDate, 0, 0, timestamp);

  // db.run(sql,[name,age], (err) => {
  //    if (err) return console.error(err.message);
  //  });
  if (check) {
    console.log("it worked");
  }
};

export const updateAccount = (userId, typeOfTransaction, Amount) => {
  let total;
  const amount = parseInt(Amount);
  // console.log(userId, typeOfTransaction, amount);
  if (
    typeOfTransaction === "debit" ||
    typeOfTransaction === "credit" ||
    typeOfTransaction === "loanPayment"
  ) {
    const selectTable = `SELECT * FROM savings WHERE account_id = ?`;
    const selected = db.prepare(selectTable).all(userId);
    // console.log(selected);
    const currentBalance = parseInt(selected[0].currentBalance);

    if (typeOfTransaction === "credit" || typeOfTransaction === "loanPayment") {
      total = amount + currentBalance;
    } else if (typeOfTransaction === "debit") {
      total = currentBalance - amount;
      console.log(
        "debit working",
        "this is the amount ",
        amount,
        "this is the currentBalance ",
        currentBalance,
        "and total is",
        total
      );

      if (currentBalance < amount) {
        total = currentBalance;
        console.log("insufficient balance");
      }
    }

    const timestamp = Date.now();

    const sql = `
    UPDATE savings 
    SET currentBalance =?, timeStamp=? WHERE account_id = ?;
  `;
    const result = db.prepare(sql).run(total, timestamp, userId);
    if (result && currentBalance > amount) {
      return "success";
    } else {
      console.log("merry christmas");
      return "In sufficient Balance";
    }
  }
};

export const update_available_balance = (userId, amount) => {
  const timestamp = Date.now();

  const sql = `
    UPDATE savings 
    SET availableBalance =?, timeStamp = ? WHERE account_id = ?
  `;
  const result = db.prepare(sql).run(amount, timestamp, userId);
  if (result) {
    return "success";
  } else {
    return "failed";
  }
};

export const get_account = (userId) => {
  const sql = `
        SELECT * FROM savings WHERE account_id = ?
    `;
  const rows = db.prepare(sql).all(userId);
  // console.log("This is it ", rows[0].sessionId);
  const account = rows;
  return parseStringify(account);
};

export const get_transactions = (userId) => {
  const sql = `SELECT * FROM transactions WHERE account_id = ?`;
  const rows = db.prepare(sql).all(userId);
  // console.log("This is it ", rows[0].sessionId);
  const transactions = rows;
  console.log(transactions);
  return parseStringify(transactions);
};

export const recordTransaction = (transactionData) => {
  const {
    dateOfTransaction,
    typeOfTransaction,
    amount,
    formOfTransaction,
    account_id,
  } = transactionData;

  const collect = get_account(account_id);
  const name = collect[0].name;

  const timestamp = Date.now();
  const status = "successful";
  // console.log(collect[0].name);

  const sql = `
    INSERT INTO transactions(dateOfTransaction, typeOfTransaction, amount, formOfTransaction, account_id, name, status, timeStamp)
    VALUES (?,?,?,?,?,?,?,?)
   `;

  const result = db
    .prepare(sql)
    .run(
      dateOfTransaction,
      typeOfTransaction,
      amount,
      formOfTransaction,
      account_id,
      name,
      status,
      timestamp
    );

  if (result) return "successful";
};

export const getTotalAccounts = () => {
  const sql = `SELECT * FROM savings`;
  const row = db.prepare(sql).all();

  return parseStringify(row);
};

export const getSession = () => {
  const sql = `
        SELECT * FROM session
    `;
  const rows = db.prepare(sql).all();
  // console.log("This is it ", rows[0].sessionId);
  const sessionId = rows[0].sessionId;
  return sessionId;
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

export const getUser = (email) => {
  const sql = `SELECT * FROM customerDetail
    WHERE email = ?
    `;
  const user = db.prepare(sql).all(email);

  // console.log(user);
  // console.log("this is coming from staatment: ", email);
  return parseStringify(user);
};

export const checkUser = (email) => {
  const sql = `SELECT * FROM customerDetail
    WHERE email = ?
    `;
  const user = db.prepare(sql).all(email);

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

export const signInConfirmation = (email, password) => {
  const sql = `SELECT * FROM customerDetail
    WHERE email = ? AND password =?
    `;
  const result = db.prepare(sql).all(email, password);

  // console.log(user);
  // console.log("this is coming from staatment: ", email);
  // user = parseStringify(user);
  const user = result[0].id;
  // console.log(user.firstName);
  return user;

  // if (user.length === 1) {
  //   return user;
  // } else {
  //   return "Wrong username or password";
  // }
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

// module.exports = createUserTable;
