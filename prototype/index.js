const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const axios = require('axios')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')



app.use(cors())

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json({limit: '100mb'}))
app.use(express.urlencoded({ extended: true, limit: '100mb'}))





const db = mysql.createPool({
    host: 'plants.mysql.database.azure.com',
    user: 'csadmin@plants',
    password: process.env.DATABASE_KEY,
    database: 'cs411'
})

// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
// FLUSH PRIVILEGES;

app.get('/', (req, res) => {

    res.send("hi");
})



app.post('/identify', (req, res) => {

    const image64 = req.body.image


    const data = {
        api_key: process.env.IDENTIFY_API,
        images: [image64], //need a string list!!!!!!!!

        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        plant_details: ["common_names",
            "url",
            "name_authority",
            "wiki_description",
            "taxonomy",
            "synonyms"],
    };

    axios.post('https://api.plant.id/v2/identify', data).then(re => {
        res.send(re.data);
        console.log('Success:', re.data);
    }).catch(error => {
        console.error('Error: ', error)
    })




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