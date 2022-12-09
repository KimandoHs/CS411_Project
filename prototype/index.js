const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const axios = require('axios')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
var wikipediaParser = require('./WikipediaParser');



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



app.post('/wikipedia', (req,res) => {

    const searchText = req.body.searchText;

    if (searchText != "") {

        wikipediaParser.fetchArticleElements(searchText).then(function (result) {
            res.send(result);

        }).catch(function (error) {
            console.log(error);
        });
    }
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




app.post('/check_fav', (req,res) => {
    const obj = req.body.obj;
    const uid = req.body.uid;
    const sqlNew = "SELECT * from plant_collection WHERE (uid=(?) AND plant_name=(?))";

    db.query(sqlNew, [uid,obj.name], (err, result) => {
        res.send(result);
    })
})


app.post('/insert_fav', (req,res) => {
    const uid = req.body.uid;
    const suggestObj = req.body.obj;
    const plant_name = suggestObj.name;
    const date =  new Date().toUTCString();
    const add_date = Date(date);
    const image_url = suggestObj.img
    const sci_name = suggestObj.sci_name;
    const plant_class = suggestObj.class;
    const family = suggestObj.family;
    const genus = suggestObj.genus;
    const kingdom = suggestObj.kingdom;
    const order = suggestObj.order;
    const phylum = suggestObj.phylum;
    const info = suggestObj.info

    const sqlNew = "INSERT INTO plant_collection VALUES (?,?,?,?,?,?,?,?,?,?,?)";


    db.query(sqlNew, [uid,plant_name,add_date,sci_name,plant_class,
            family,genus,kingdom,order,phylum,info], (err, result) => {
        res.send(result);
    })
})

app.post('/get_collection', (req,res) => {

    const email = req.body.email


    const sql = "SELECT * FROM user, plant_collection, plant_image WHERE user.email = (?) AND user.uid = plant_collection.uid AND plant_collection.plant_name = plant_image.plant_name";


    db.query(sql, [email], (err, result) => {
        res.send(result);
    })
})

app.post('/get_plants', (req,res) => {

    const email = req.body.email


    const sql = "SELECT * FROM plant_collection, plant_image WHERE plant_collection.plant_name = plant_image.plant_name";


    db.query(sql, [email], (err, result) => {
        res.send(result);
    })
})


app.post('/check_image', (req,res) => {

    const plant_name = req.body.name;

    const image_url = req.body.url


    const sql1 = "SELECT * FROM plant_image WHERE (plant_name = ? AND image_url = ?)"

    db.query(sql1, [plant_name,image_url], (err1, result1) => {
        res.send(result1)

    })

})


app.post('/insert_image', (req,res) => {

    const plant_name = req.body.name;

    const image_url = req.body.url


    const sql1 = "INSERT INTO plant_image (plant_name, image_url) VALUES (?,?)"

    db.query(sql1, [plant_name,image_url], (err1, result1) => {
        res.send(result1)

    })

})


app.post('/delete_fav', (req,res) => {
    const name = req.body.plant_name

    sql = "DELETE FROM plant_collection WHERE plant_name = ?"

    db.query(sql, [name], (err, result) => {
        res.send(result);
    })
})

app.post('/delete_image', (req,res) => {
    const name = req.body.plant_name

    sql = "DELETE FROM plant_image WHERE plant_name = ?"

    db.query(sql, [name], (err, result) => {
        res.send(result);
    })
})


app.post('/check_user', (req, res) => {


    //update this part
    const uid = req.body.uid;
    const useremail = req.body.useremail;
    const sqlNew = "SELECT * from user WHERE uid=(?) OR email = (?) ";

    db.query(sqlNew, [uid,useremail], (err, result) => {
        res.send(result);
    })
})

app.post('/insert_user', (req, res) => {

    //update this part
    const uid = req.body.uid;
    const name = req.body.name;
    const email = req.body.email;

    const sqlInsert = "INSERT INTO user (uid, name, email) VALUES (?,?,?)";

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
