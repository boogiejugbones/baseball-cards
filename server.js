const express = require('express');
const path = require('path');
const db = require("better-sqlite3")('./db/cards.db')
db.pragma("journal_mode = WAL"); //to enable WAL mode for better performance
const app = express();

app.use(express.json());    //to parse json
app.use(express.urlencoded({ extended: true })); //to parse urlencoded data

app.use(express.static('public'));

const createTables = db.transaction(() => {                     //switch this to .prepare if not using ai scanner and adding cards in bulk
db.prepare(`CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playername TEXT NOT NULL,
    team TEXT NOT NULL,
    position TEXT NOT NULL,
    year INTEGER NOT NULL)`).run();
});

createTables(); //create the tables if they don't exist

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.get('/api/cards', (req, res)=> {
    try{
        const cards = db.prepare('SELECT * FROM cards').all();
        res.json(cards);
    }catch(err){
        console.error('Error fetching cards', err);
        res.status(500).json({error: 'Failed to fetch cards'});
    }
})

app.post('/api/cards', (req, res) => {
    try{
        db.prepare("INSERT INTO cards (playername, team, position, year) VALUES (?, ?, ?, ?)")
        .run(req.body.playername, req.body.team, req.body.position, req.body.year);

        res.status(201).json({ message: 'Card added successfully' });   //response with http status code provided by express and send in json format
    }catch(err){
        console.error('Error inserting card', err);
        res.status(500).json({ error: 'Failed to add card'});
    }
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
});