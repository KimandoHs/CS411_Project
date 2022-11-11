const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const axios = require('axios')
const app = express()
app.use(cors())

app.get('/', (req, res) => {
    res.json('hi')
})

app.get('/results', (req, res) => {
    console.log(req.query)
    const chosenType = req.query.type
    const chosenName = req.query.name
    const options = {
        method: 'GET',
        url: 'https://house-plants.p.rapidapi.com/' + chosenType + '/' + chosenName,
        headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
            'X-RapidAPI-Host': 'house-plants.p.rapidapi.com'
        }
    };

    axios.request(options).then((response) => {
        res.json(response.data)
        console.log(response.data)
    }).catch((error) => {
        console.error(error)
    })
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))