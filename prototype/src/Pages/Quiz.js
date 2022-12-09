import React, {useEffect, useState} from 'react';
import {useNavigate, useParams}  from "react-router-dom";
import './style.css';
import {Button} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";

const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        primary: {
            main: '#0971f1',
            darker: '#053e85',
        },
        neutral: {
            main: '#f2ac57',
            contrastText: '#fff',
        },
    },
});

const Quiz = () => {
    let navigate = useNavigate()
    let {userid, username, useremail, login_type} = useParams()

    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState(0);
    const [answerQuestion, setAnswer] = useState("")

    const handleQuizSubmit = (e) => {
        e.preventDefault();
        submitAnswer(answerQuestion);
        getCollectionObj();
    }

    const submitAnswer = (name) => {
        let radios = document.getElementsByName('choice');
        let val= "";
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                val = radios[i].value;
                console.log(radios);
                break;
            }
        }
        if (val == "" ) {
            document.getElementById('scoreText').innerHTML = score + "/" + (questions);
            document.getElementById('result').innerHTML ="Please choose an answer";
        } else if (val == name) {
            setScore(prevScore => score + 1);
            setQuestions(prevQuestions => questions + 1)
            document.getElementById('scoreText').innerHTML = (score + 1) + "/" + (questions + 1);
            document.getElementById('result').innerHTML = name + " was the correct answer. Good job!";
        } else {
            setQuestions(prevQuestions => questions + 1)
            document.getElementById('scoreText').innerHTML = score + "/" + (questions + 1);
            document.getElementById('result').innerHTML =  "Unfortunately, that was not the correct answer.";
        }
    };

    const getCollectionObj = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/get_plants',
            { email:useremail})
            .then((re) => {
                console.log("return from database",re.data)
                modifyContent(re.data);
            })
            .catch(err=>console.log(err))
    }

    const modifyContent = (array) => {
        let randomPlant = Math.floor(Math.random() * array.length);
        let randomChoice = Math.floor(Math.random() * 4) + 1
        //alert(randomChoice);
        let answer = document.getElementById(`choice${randomChoice}`);
        answer.innerHTML = array[randomPlant].plant_name;
        document.getElementById(`choiceBox${randomChoice}`).value = array[randomPlant].plant_name;
        let imageSrc = document.getElementById('imageBox');
        imageSrc.src= array[randomPlant].image_url;
        setAnswer(prevAnswer => array[randomPlant].plant_name)
        const arr = [];
        arr.push(array[randomPlant].plant_name);
        for (let i = 1; i < 5; i++) {
            if (i != randomChoice) {
                let randomNum = Math.floor(Math.random() * array.length);
                while (arr.includes(array[randomNum].plant_name)) {
                    randomNum = Math.floor(Math.random() * array.length);
                }
                arr.push(array[randomNum].plant_name);
                let choice = document.getElementById(`choice${i}`);
                choice.innerHTML = array[randomNum].plant_name;

                //let imageSrc = document.getElementById('imageBox');
                //imageSrc.src= rowObj.image_url;
                //document.getElementById(`choiceBox${i + 1}`).value = rowObj.plant_name;
            }

        }
    }

    useEffect( () => {
        axios.post('http://localhost:8000/get_plants',
            { email:useremail})
            .then((re) => {
                console.log("return from database",re.data)
                modifyContent(re.data);
            })
            .catch(err=>console.log(err))
    }, [])

    return (
        <div id = 'Quiz' className="center3">
            <br></br>
            <div className={"center2"}>
                <ThemeProvider theme={theme}>
                <Button variant="contained" size={"small"} color={"neutral"} onClick={() => navigate('/' + userid + '&' + username + '&' + useremail+'&' +login_type)}> Go back to the main page</Button>
                    </ThemeProvider>
            </div>
            <p id={"scoreText"} style={{float:"right", padding:"0px 100px 140px 0px", fontWeight:"bold", fontSize:"35px"}}>0/0</p>
            <br></br>
            <br></br>
                <div className={"center2"}>
                    This is a quiz based on your collection. How many can you get right?{"\n"}
                </div>
            <br></br>
            <div className = "center2" style={{backgroundColor: '#FAF9F6', width: "300px", borderRadius:'5%'}}>
                    <img id="imageBox" style={{borderRadius: '5%'}} src="https://watchandlearn.scholastic.com/content/dam/classroom-magazines/watchandlearn/videos/animals-and-plants/plants/what-are-plants-/What-Are-Plants.jpg" width={300} height={300} />
                <br></br>
                What plant is this?
                <br></br>
                <br></br>
                <div style={{textAlign: "left", width:"100%"}} className="center2">
                    <form>
                        <input type="radio" id={"choiceBox1"} name="choice"/> <text id = "choice1">Random plant</text> <br></br>
                        <input type="radio" id={"choiceBox2"} name="choice"/> <text id = "choice2">Lily</text> <br></br>
                        <input type="radio" id={"choiceBox3"} name="choice"/> <text id = "choice3">Dandelion</text> <br></br>
                        <input type="radio" id={"choiceBox4"} name="choice"/> <text id = "choice4">Sunflower</text> <br></br>
                    </form>
                </div>
                <ThemeProvider theme={theme}>
                    <Button variant="contained" style={{width:"140px", marginBottom:"10px"}} size={"small"} color={"neutral"} disableElevation onClick={handleQuizSubmit}>Submit Answer</Button>
                </ThemeProvider>
                <br></br>
                <ThemeProvider theme={theme}>
                    <Button variant="contained" style={{width:"140px"}} size={"small"} color={"neutral"} disableElevation onClick={getCollectionObj}>Try a new one</Button>
                </ThemeProvider>
            </div>
            <p id={"result"}></p>
        </div>

    )

}

export default Quiz