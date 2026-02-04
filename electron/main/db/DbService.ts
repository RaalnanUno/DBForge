import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export class DbService {
  private db: Database.Database | null = null;
  private dbPath: string | null = null;

  open(dbPath: string) {
    // Ensure folder exists (if user gives a nested path)
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Opening a non-existent path creates the file automatically
    this.db?.close();
    this.db = new Database(dbPath);
    this.dbPath = dbPath;

    // Recommended defaults
    this.db.pragma("foreign_keys = ON");

    // Migration table (for later)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS __schema_migrations (
        id TEXT PRIMARY KEY,
        applied_utc TEXT NOT NULL,
        description TEXT
      );
    `);

    return { dbPath };
  }

  isOpen() {
    return !!this.db;
  }

  getPath() {
    return this.dbPath;
  }

  listTables(): string[] {
    if (!this.db) throw new Error("Database not open");

    const stmt = this.db.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type='table'
        AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `);

    return stmt.all().map((r: any) => r.name as string);
  }

  close() {
    this.db?.close();
    this.db = null;
    this.dbPath = null;
  }
}