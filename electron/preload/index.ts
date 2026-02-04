import { contextBridge, ipcRenderer } from "electron";

console.log("✅ DBForge preload loaded");
console.log(window.dbforge)


export type DbQueryResult = {
  columns: string[];
  rows: any[][];
};

export type DbOpenResponse = {
  ok: boolean;
  dbPath?: string;
  error?: string;
};

export type DbListTablesResponse = {
  ok: boolean;
  tables?: string[];
  error?: string;
};

contextBridge.exposeInMainWorld("dbforge", {
  openDb: (dbPath: string) =>
    ipcRenderer.invoke("db:open", { dbPath }) as Promise<DbOpenResponse>,
  listTables: () =>
    ipcRenderer.invoke("db:listTables") as Promise<DbListTablesResponse>,
});

console.log("✅ DBForge window.dbforge exposed");
