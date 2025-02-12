import { parseStringify } from "../utils";

const db = require("better-sqlite3")("loan7.db");

export const createExpensesTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS expense(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dateOfTransaction TEXT NOT NULL,
    typeOfTransaction TEXT NOT NULL,
    amount INTEGER NOT NULL,
    formOfTransaction TEXT NOT NULL,
    nameOfItem TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    timeStamp TEXT NOT NULL
 )
  `;
  db.prepare(sql).run();
};

export const recordExpenses = (transactionData) => {
  const {
    dateOfTransaction,
    typeOfTransaction,
    amount,
    formOfTransaction,
    name,
    item,
  } = transactionData;

  const timestamp = Date.now();

  // new Date().getTime();

  const sql = `
    INSERT INTO expense(dateOfTransaction, typeOfTransaction, amount, formOfTransaction, nameOfItem, name, status, timeStamp)
    VALUES (?,?,?,?,?,?,?,?)
   `;

  const result = db
    .prepare(sql)
    .run(
      dateOfTransaction,
      typeOfTransaction,
      amount,
      formOfTransaction,
      item,
      name,
      "success",
      timestamp
    );

  if (result) return "successful";
};

export const getExpense = () => {
  const sql = `SELECT * FROM expense`;
  const row = db.prepare(sql).all();

  return parseStringify(row);
};

// export const getIncomeExpenseTable = () => {

//   }
