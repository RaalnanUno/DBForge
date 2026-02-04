import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { dbService } from "./db";

function registerIpc() {
  ipcMain.handle("db:open", async (_evt, args: { dbPath: string }) => {
    try {
      const { dbPath } = dbService.open(args.dbPath);
      return { ok: true, dbPath };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? String(e) };
    }
  });

  ipcMain.handle("db:listTables", async () => {
    try {
      const tables = dbService.listTables();
      return { ok: true, tables };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? String(e) };
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // IMPORTANT: electron-vite builds preload to ../preload/index.js relative to dist main
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // In electron-vite templates, VITE_DEV_SERVER_URL is provided in dev
  const devUrl = process.env.VITE_DEV_SERVER_URL;

  if (devUrl) {
    win.loadURL(devUrl);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    // In production build, renderer is bundled to dist/renderer/index.html
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  registerIpc();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  // On macOS it's common to keep the app open until explicit quit
  if (process.platform !== "darwin") app.quit();
});
