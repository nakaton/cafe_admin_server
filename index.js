const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');

const app = express();


// Init middleware
app.use(logger);

// Set static folder. 'use' function is used for middleware
app.use(express.static(path.join(__dirname, 'static')));

app.get('/api/members', (req, res) => {
    const members = [
        {name: "Nick", age: 33},
        {name: "Jone", age: 23}
    ]
    res.json(members);
})

app.get('/', (req, res) => {
    res.send("<h1>Home Page</h1>");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));