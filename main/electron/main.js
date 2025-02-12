import { app, BrowserWindow } from "electron";
import path from "path";

// const { app, BrowserWindow } = require("electron");
// path = require("path");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({});
  mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
});
