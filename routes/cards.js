const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res)=> {                //this gets all of the cards from the db
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

router.post('/', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router;