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

//set initial values for scores
const Quiz = () => {
    let navigate = useNavigate()
    let {userid, username, useremail, login_type} = useParams()

    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState(0);
    const [answerQuestion, setAnswer] = useState("")

    const handleQuizSubmit = (e) => {
        //don't refresh on submit
        e.preventDefault(); 
        submitAnswer(answerQuestion);
        //load new question on submission
        getCollectionObj(); 
    }
    
    //check if the user's answer was correct
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
        //no selection
        if (val == "" ) {
            document.getElementById('scoreText').innerHTML = score + "/" + (questions);
            document.getElementById('result').innerHTML ="Please choose an answer";
        }
        //correct answer
        else if (val == name) {
            setScore(prevScore => score + 1);
            setQuestions(prevQuestions => questions + 1)
            document.getElementById('scoreText').innerHTML = (score + 1) + "/" + (questions + 1);
            document.getElementById('result').innerHTML = name + " was the correct answer. Good job!";
        }
        //wrong answer
        else {
            setQuestions(prevQuestions => questions + 1)
            document.getElementById('scoreText').innerHTML = score + "/" + (questions + 1);
            document.getElementById('result').innerHTML =  "Unfortunately, that was not the correct answer.";
        }
    };
    
    //get user's collection
    const getCollectionObj = (e) => {
        e.preventDefault();
        //Get results from backend, will query user's collection
        axios.post('http://localhost:8000/get_plants',
            { email:useremail})
            .then((re) => {
                console.log("return from database",re.data)
                modifyContent(re.data);
            })
            .catch(err=>console.log(err))
    }
    
    //populates quiz with new question on a random plant from user's collection
    const modifyContent = (array) => {
        //get random plant and set correct answer to that plant
        let randomPlant = Math.floor(Math.random() * array.length);
        let randomChoice = Math.floor(Math.random() * 4) + 1
        let answer = document.getElementById(`choice${randomChoice}`);
        answer.innerHTML = array[randomPlant].plant_name;
        document.getElementById(`choiceBox${randomChoice}`).value = array[randomPlant].plant_name;
        
        //set image to new plant
        let imageSrc = document.getElementById('imageBox');
        imageSrc.src= array[randomPlant].image_url;
        setAnswer(prevAnswer => array[randomPlant].plant_name)
        
        // Set other 3 answers to random plants that are different from correct answer
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
    
    //page contents
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
                <img id="imageBox" style={{borderRadius: '5%', objectFit: 'cover'}} src="https://media.mixbook.com/images/templates/97_1_0_m.jpg" width={300} height={300} />
                <br></br>
                What plant is this?
                <br></br>
                <br></br>
                <div style={{textAlign: "left", width:"100%"}} className="center2">
                    <form>
                        <input type="radio" id={"choiceBox1"} name="choice"/> <text id = "choice1"></text> <br></br>
                        <input type="radio" id={"choiceBox2"} name="choice"/> <text id = "choice2"></text> <br></br>
                        <input type="radio" id={"choiceBox3"} name="choice"/> <text id = "choice3"></text> <br></br>
                        <input type="radio" id={"choiceBox4"} name="choice"/> <text id = "choice4"></text> <br></br>
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

