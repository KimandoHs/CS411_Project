const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const axios = require('axios')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')




const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '20010511',
    database: 'cs411'
})
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(express.json())


// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
// FLUSH PRIVILEGES;

app.get('/', (req, res) => {

    res.send("hi");
})



app.post('/check_user', (req, res) => {

    //update this part
    const uid = req.body.uid;
    const sqlNew = "SELECT userId from user WHERE userId=(?) ";

    db.query(sqlNew, [uid], (err, result) => {
        res.send(result);
    })
})


app.post('/insert_user', (req, res) => {

    //update this part
    const uid = req.body.uid;
    const name = req.body.name;
    const email = req.body.email;


    const sqlInsert = "INSERT INTO user (userId, name, email) VALUES (?,?,?)";

    db.query(sqlInsert, [uid, name, email], (err, result) => {
        res.send(result);
        })
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