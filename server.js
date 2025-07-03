const path = require('path');
const express = require('express');
const app = express();
const cardRoutes = require('./routes/cards');
const initTables = require('./models/initTables');

app.use(express.json());    //to parse json
app.use(express.urlencoded({ extended: true })); //to parse urlencoded data

app.use(express.static('public'));

initTables();

app.use('/api/cards', cardRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.put('/api/cards', (req, res))

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
});