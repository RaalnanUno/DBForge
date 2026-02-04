export {};

declare global {
  interface Window {
    dbforge: {
      openDb: (dbPath: string) => Promise<{ ok: boolean; dbPath?: string; error?: string }>;
      listTables: () => Promise<{ ok: boolean; tables?: string[]; error?: string }>;
    };
  }
}
