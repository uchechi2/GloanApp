import { parseStringify } from "../utils";

const db = require("better-sqlite3")("loan7.db");

export const createLoanBank = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS loans(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id TEXT NOT NULL,
    name TEXT NOT NULL,
    mobileNo TEXT NOT NULL,
    occupation TEXT NOT NULL,
    bvn TEXT NOT NULL,
    business_company_name TEXT NOT NULL,
    officePhoneNo TEXT NOT NULL,
    business_company_address TEXT NOT NULL,
    loanAmountRequested INTEGER DEFAULT 0,
    loanAmountReceived INTEGER DEFAULT 0,
    currentLoanBalance INTEGER DEFAULT 0,
    purposeOfLoan TEXT NOT NULL,
    sourceOfIncome TEXT NOT NULL,
    dateOfCreation TEXT NOT NULL,
    tenure TEXT NOT NULL,
    formOfTransaction TEXT,
    status TEXT NOT NULL,
    guarantorName TEXT NOT NULL,
    guarantorContact TEXT NOT NULL,
    guarantorOccupation TEXT NOT NULL,
    guarantorAddress TEXT NOT NULL,
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

export const createLoanTransactionTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS loanTransactions(
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

export const dropTable = () => {
  const sql = `DROP TABLE IF EXISTS loans`;
  db.prepare(sql).run();
};

export const loanRecords = (userId, bvn, userData) => {
  const {
    date,
    status,
    name,
    mobileNo,
    occupation,
    business_company_name,
    office_phone_no,
    business_address,
    amount,
    proposedTenure,
    purposeOfLoan,
    sourceOfIncome,
    guarantorName,
    guarantorContact,
    guarantorOccupation,
    guarantorAddress,
  } = userData;

  const timestamp = Date.now();

  const sql = `
    INSERT INTO loans(
    account_id,
    name,
    mobileNo,
    occupation,
    bvn,
    business_company_name,
    officePhoneNo,
    business_company_address,
    loanAmountRequested,
    purposeOfLoan,
    sourceOfIncome,
    dateOfCreation,
    tenure,
    status,
    guarantorName,
    guarantorContact,
    guarantorOccupation,
    guarantorAddress,
    timeStamp)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
   `;
  // db.prepare(sql).run(...userData);
  const row = db
    .prepare(sql)
    .run(
      userId,
      name,
      mobileNo,
      occupation,
      bvn,
      business_company_name,
      office_phone_no,
      business_address,
      amount,
      purposeOfLoan,
      sourceOfIncome,
      date,
      proposedTenure,
      status,
      guarantorName,
      guarantorContact,
      guarantorOccupation,
      guarantorAddress,
      timestamp
    );

  if (row) {
    return "success";
  }
};

export const deleteLoanAccount = (id) => {
  const sql = `DELETE FROM loans WHERE id=?`;
  db.prepare(sql).run(id);
};

export const updateLoanStatus = (id, status, amount, amountWithInterest) => {
  const timestamp = Date.now();

  const sql = `
    UPDATE loans 
    SET status =?, loanAmountReceived=?, currentLoanBalance=?, timeStamp=? WHERE id = ?;
  `;
  const result = db
    .prepare(sql)
    .run(status, amount, amountWithInterest, timestamp, id);
  if (result) {
    return "success";
  } else {
    return "failed";
  }
};

export const releaseLoanStatus = (id, status) => {
  const timestamp = Date.now();
  const date = new Date().toString();
  const sql = `
    UPDATE loans 
    SET status =?, timeStamp=?, dateOfCreation=? WHERE id = ?;
  `;
  const result = db.prepare(sql).run(status, timestamp, date, id);
  if (result) {
    return "success";
  } else {
    return "failed";
  }
};

export const getLoanUserid = (id) => {
  const sql = `SELECT *FROM loans WHERE id = ?`;
  const result = db.prepare(sql).all(id);
  if (result) {
    const userid = result[0].account_id;
    return userid;
  } else {
    return "failed";
  }
};

export const getLoanUserdetails = (id) => {
  const sql = `SELECT *FROM loans WHERE id = ?`;
  const result = db.prepare(sql).all(id);
  if (result) {
    const user = result[0];
    return user;
  } else {
    return "failed";
  }
};

export const updateLoanTransaction = (id, status, amount, typeOfPayment) => {
  const timestamp = Date.now();

  const sql = `
    UPDATE loanTransactions 
    SET status =?, formOfTransaction=?, timeStamp=? WHERE account_id = ? AND amount = ?;
  `;
  const result = db
    .prepare(sql)
    .run(status, typeOfPayment, timestamp, id, amount);
  if (result) {
    return "success";
  } else {
    return "failed";
  }
};

export const updateLoanRecords = (userId, typeOfTransaction, Amount) => {
  let total;
  const amount = parseInt(Amount);
  console.log(userId, typeOfTransaction, amount);
  if (typeOfTransaction === "debit" || "credit") {
    const selectTable = `SELECT * FROM savings WHERE account_id = ?`;
    const selected = db.prepare(selectTable).all(userId);
    // console.log(selected);
    const currentBalance = parseInt(selected[0].currentBalance);

    if (typeOfTransaction === "credit") {
      total = amount + currentBalance;
    } else if (typeOfTransaction === "debit") {
      total = currentBalance - amount;
    }

    const timestamp = Date.now();

    const sql = `
    UPDATE savings 
    SET currentBalance =?, timeStamp=? WHERE account_id = ?;
  `;
    const result = db.prepare(sql).run(total, timestamp, userId);
    if (result) {
      return "success";
    } else {
      return "failed";
    }
  }
};

export const update_available_balance = (userId, amount) => {
  const timestamp = Date.now();

  const sql = `
    UPDATE savings 
    SET availableBalance =?, timeStamp=? WHERE account_id = ?
  `;
  const result = db.prepare(sql).run(amount, timestamp, userId);
  if (result) {
    return "success";
  } else {
    return "failed";
  }
};

export const get_loan_account = (userId) => {
  const sql = `
        SELECT * FROM loans WHERE account_id = ? ORDER BY id ASC
    `;
  const rows = db.prepare(sql).all(userId);
  // console.log("This is it ", rows[0].sessionId);
  const account = rows;
  return parseStringify(account);
};

export const get_current_loanBalance = (loanId) => {
  console.log(loanId);

  const sql = `
        SELECT * FROM loans WHERE id = ?
    `;
  const rows = db.prepare(sql).all(loanId);
  // console.log("This is it ", rows[0].sessionId);
  const loanBalance = rows[0].currentLoanBalance;
  // return parseStringify(account);
  // console.log("hello world, Just think about it");
  // console.log("this is the value ", loanBalance);
  return loanBalance;
};

export const get_active_loan_account = (userId) => {
  const sql = `
        SELECT * FROM loans WHERE account_id = ? AND currentLoanBalance > 0 ORDER BY id ASC
    `;
  const rows = db.prepare(sql).all(userId);
  // console.log("This is it ", rows[0].sessionId);
  const account = rows;
  return parseStringify(account);
};

export const get_loan_transactions = (userId) => {
  const sql = `SELECT * FROM loans WHERE account_id = ? `;
  const rows = db.prepare(sql).all(userId);
  // console.log("This is it ", rows[0].sessionId);
  const transactions = rows;
  console.log(transactions);
  return parseStringify(transactions);
};

export const recordLoanTransaction = (transactionData) => {
  const {
    dateOfTransaction,
    typeOfTransaction,
    amount,
    formOfTransaction,
    account_id,
    name,
    status,
  } = transactionData;

  const timestamp = Date.now();

  const sql = `
    INSERT INTO loanTransactions(dateOfTransaction, typeOfTransaction, amount, formOfTransaction, account_id, name, status, timeStamp)
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

export const getLoanRequestList = () => {
  const sql = `SELECT * FROM loans WHERE status = 'pending'`;
  const row = db.prepare(sql).all();

  return parseStringify(row);
};

export const getApprovedLoanList = () => {
  const sql = `SELECT * FROM loans WHERE status = 'approved'`;
  const row = db.prepare(sql).all();

  return parseStringify(row);
};

export const getLoanList = () => {
  const sql = `SELECT * FROM loans WHERE status = 'success'`;
  const row = db.prepare(sql).all();

  return parseStringify(row);
};

export const getactiveLoanList = () => {
  const sql = `SELECT * FROM loans WHERE currentLoanBalance > '0' AND status = 'success'`;
  const row = db.prepare(sql).all();

  return parseStringify(row);
};

// export const getSession = () => {
//   const sql = `
//         SELECT * FROM session
//     `;
//   const rows = db.prepare(sql).all();
//   // console.log("This is it ", rows[0].sessionId);
//   const sessionId = rows[0].sessionId;
//   return sessionId;
// };

// export const getUsers = () => {
//   const sql = `
//         SELECT * FROM customerDetail
//     `;
//   const rows = db.prepare(sql).all();
//   //     db.all(sql, [], (err, rows) => {
//   //   if (err) return console.error(err.message);
//   //   rows.forEach((row) => {
//   //     console.log(row);
//   //   });
//   // });
//   console.log(rows);
// };

// export const getUser = (email) => {
//   const sql = `SELECT * FROM customerDetail
//     WHERE email = ?
//     `;
//   const user = db.prepare(sql).all(email);

//   // console.log(user);
//   // console.log("this is coming from staatment: ", email);
//   return parseStringify(user);
// };

// export const checkUser = (email) => {
//   const sql = `SELECT * FROM customerDetail
//     WHERE email = ?
//     `;
//   const user = db.prepare(sql).all(email);

//   // console.log(user.length);
//   // console.log(user);

//   if (user.length > 0) {
//     return "exist";
//   } else {
//     return "doesnot exist";
//   }
//   // console.log("this is coming from sentsssss: ", email);
//   // return parseStringify(user);
// };
// // getUser(1);
// // getUsers();

export const updateLoanAccount = (id, typeOfTransaction, Amount) => {
  let total;
  const amount = parseInt(Amount);
  console.log(id, typeOfTransaction, amount);
  // if (typeOfTransaction === "debit" || "credit") {
  const selectTable = `SELECT * FROM loans WHERE id = ?`;
  const selected = db.prepare(selectTable).all(id);
  // console.log(selected);
  const currentBalance = selected[0].currentLoanBalance;
  console.log(selected[0].currentLoanBalance);

  // if (typeOfTransaction === "credit") {
  //   total = amount + currentBalance;
  // } else if (typeOfTransaction === "debit") {
  total = currentBalance - amount;
  console.log(total);
  // }

  if (total < 0) {
    total = currentBalance;
  }

  const timestamp = Date.now();

  const sql = `
    UPDATE loans 
    SET currentLoanBalance =?, timeStamp =? WHERE id = ?;
  `;
  const result = db.prepare(sql).run(total, timestamp, id);
  if (result) {
    return "success";
  } else {
    return "failed";
  }
  // }
};

export const updateLoanPenalty = (id, typeOfTransaction, amount) => {
  let total;
  // const amount = parseInt(Amount);
  console.log(id, typeOfTransaction, amount);
  // if (typeOfTransaction === "debit" || "credit") {
  const selectTable = `SELECT * FROM loans WHERE id = ?`;
  const selected = db.prepare(selectTable).all(id);
  // console.log(selected);
  const currentBalance = selected[0].currentLoanBalance;
  console.log(selected[0].currentLoanBalance);

  // if (typeOfTransaction === "credit") {
  //   total = amount + currentBalance;
  // } else if (typeOfTransaction === "debit") {
  // total = currentBalance - amount;
  total = amount;
  console.log(total);
  // }

  if (total < 0) {
    total = currentBalance;
  }

  const timestamp = Date.now();

  const sql = `
    UPDATE loans 
    SET currentLoanBalance =?, timeStamp =? WHERE id = ?;
  `;
  const result = db.prepare(sql).run(total, timestamp, id);
  if (result) {
    return "success";
  } else {
    return "failed";
  }
  // }
};
