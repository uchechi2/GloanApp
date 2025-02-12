import { timeStamp } from "console";
import { parseStringify } from "../utils";
import { timestamp } from "drizzle-orm/mysql-core";

const db = require("better-sqlite3")("loan7.db");
// const onlineDb =
let message;

const updateDb = () => {};

const updateOnlineStatus = () => {
  navigator.online ? updateDB() : (message = "system not online");
};

//eventlisteners online and offline
