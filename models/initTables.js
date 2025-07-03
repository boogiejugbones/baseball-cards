const db = require('../db/db');

const createBaseballTables = db.transaction(() => {                     //switch this to .prepare if not using ai scanner and adding cards in bulk
db.prepare(`CREATE TABLE IF NOT EXISTS bcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playername TEXT NOT NULL,
    team TEXT NOT NULL,
    position TEXT NOT NULL,
    year INTEGER NOT NULL,
    "card-number" INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'baseball')`).run();
});

const createFootballTables = db.transaction(() =>{
    db.prepare(`CREATE TABLE IF NOT EXISTS fcards(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playername TEXT NOT NULL,
        team TEXT NOT NULL,
        position TEXT NOT NULL,
        year INTEGER NOT NULL,
        "card-number" INTEGER NOT NULL,
        type TEXT NOT NULL DEFAULT 'football')`).run();
});

module.exports = () =>{
    createBaseballTables();
    createFootballTables();
}