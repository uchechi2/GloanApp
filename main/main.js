// const { app, BrowserWindow } = require("electron");

// import { app, BrowserWindow } from "electron";
import { app, BrowserWindow, Menu, protocol, session, shell } from "electron";
import serve from "electron-serve";
import path from "path";
import { createHandler } from "next-electron-rsc";
import { Database } from "better-sqlite3";
import { mysql } from "mysql";

// const db = require("better-sqlite3")("loan7.db");
const db = new Database("loan7.db");

const isDev = process.env.NODE_ENV === "development";
const appPath = app.getAppPath();
const localhostUrl = "http://localhost:3000"; // must match Next.js dev server
// const os = require("os-utils");
// const serve = require("electron-serve");
// const path = require("node:path");

const standaloneDir = path.join(appPath, ".next", "standalone");

const { createInterceptor } = createHandler({
  standaloneDir,
  localhostUrl,
  protocol,
});

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require("electron-squirrel-startup")) {
//   app.quit();
// }

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 1000,
    // height: 600,
    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js"),
    //   nodeIntegration: true,
    //   contextIsolation: false,
    // },
  });

  // Next.js handler

  if (!isDev) {
    console.log(
      `[APP] Server Debugging Enabled, ${localhostUrl} will be intercepted to ${standaloneDir}`
    );
    // stopIntercept = createInterceptor({
    //   session: mainWindow.webContents.session,
    // });

    createInterceptor();
  }

  // Next.js handler

  if (app.isPackaged) {
    appServe(mainWindow).then(() => {
      mainWindow.loadURL("app://-");
    });
  } else {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on("did-fail-load", (e, code, desc) => {
      mainWindow.webContents.reloadIgnoringCache();
    });
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
