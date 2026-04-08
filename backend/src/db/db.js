import Database from 'better-sqlite3'

const db = new Database('./database.sqlite')

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    );
    `).run()

export default db;
