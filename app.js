require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const moviesData = require('./movies-data')

const app = express();

app.use(morgan("common"));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})

function equalsIgnoreCase(a, b) {
    return a.toLowerCase() === b.toLowerCase();
}

function includesIgnoreCase(a, b) {
    return a.toLowerCase().includes(b.toLowerCase());
}

app.get('/movie', (req, res) => {
    let { genre, country, avg_vote } = req.query;
    let results = [...moviesData];

    if(genre) {
        results = results.filter((itm) => {
            return includesIgnoreCase(itm.genre, genre);
        });
    }

    if(country) {
        results = results.filter((itm) => {
            return equalsIgnoreCase(itm.country, country.replace('+', ' '));
        });
    }

    if(avg_vote) {
        results = results.filter((itm) => {
            return itm.avg_vote >= parseFloat(avg_vote);
        });
    }

    return res.json(results);
});

app.listen(8080, () => {
    console.log("Listening on 8080");
});