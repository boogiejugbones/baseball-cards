const express = require('express');
const path = require('path');
const db = require("better-sqlite3")('./db/cards.db')
db.pragma("journal_mode = WAL"); //to enable WAL mode for better performance
const app = express();

app.use(express.json());    //to parse json
app.use(express.urlencoded({ extended: true })); //to parse urlencoded data

app.use(express.static('public'));

const createBaseballTables = db.transaction(() => {                     //switch this to .prepare if not using ai scanner and adding cards in bulk
db.prepare(`CREATE TABLE IF NOT EXISTS bcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playername TEXT NOT NULL,
    team TEXT NOT NULL,
    position TEXT NOT NULL,
    year INTEGER NOT NULL,
    "card-number" INTEGER NOT NULL)`).run();
});

const createFootballTables = db.transaction(() =>{
    db.prepare(`CREATE TABLE IF NOT EXISTS fcards(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playername TEXT NOT NULL,
        team TEXT NOT NULL,
        position TEXT NOT NULL,
        year INTEGER NOT NULL,
        "card-number" INTEGER NOT NULL)`).run();
});

createFootballTables();
createBaseballTables(); //create the tables if they don't exist

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.get('/api/cards', (req, res)=> {                //this gets all of the cards from the db
    try{
        const baseballCards = db.prepare("SELECT *, 'baseball' as type FROM bcards").all();
        const footballCards = db.prepare("SELECT *, 'football' as type FROM fcards").all();
        const cards =[...baseballCards, ...footballCards];
        res.json(cards);
    }catch(err){
        console.error('Error fetching cards', err);
        res.status(500).json({error: 'Failed to fetch cards'});
    }
})

app.post('/api/cards', (req, res) => {
    const{ playername, team, position, year, cardNumber, type} = req.body;

    try{
        if(type === 'baseball'){
            db.prepare("INSERT INTO bcards (playername, team, position, year, `card-number`) VALUES (?, ?, ?, ?, ?)")
            .run(playername, team, position, year, cardNumber);
        }
        else if(type === 'football'){
            db.prepare("INSERT INTO fcards (playername, team, position, year, `card-number`) VALUES (?, ?, ?, ?, ?)")
            .run(playername, team, position, year, cardNumber);
        }
        else{
            res.status(400).json({error: 'Invalid card type'});
        }

        console.log('Received card:', req.body)
        res.status(201).json({ message: 'Card added successfully' });   //response with http status code provided by express and send in json format
    }catch(err){
        console.error('Error inserting card', err);
        res.status(500).json({ error: 'Failed to add card'});
    }
});

app.delete('/api/cards/:id', (req, res) => {
    const id = req.params.id;
    const type = req.query.type;

    if(type != 'baseball' && type != 'football'){
        res.status(400).json({error: 'Invalid card type'});
    }

    try{
        let tableName;
            if (type === 'baseball') {
                tableName = 'bcards';
            } else {
                tableName = 'fcards';
            }

        const stmt = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`);
        const result = stmt.run(id);

        if (result.changes === 0) {
            res.status(404).json({ error: 'Card not found' });
        } else {
            console.log(`Deleted card with id ${id}`);
            res.sendStatus(204); // success
        }
    } catch (err) {
        console.error('Database delete error:', err);
        res.status(500).json({ error: 'Failed to delete card' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
});