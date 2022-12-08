import React, {useEffect, useState} from 'react';
import {useNavigate, useParams}  from "react-router-dom";
import './style.css';
import {Button} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    let {username, useremail, login_type} = useParams()

    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState(0);

    const handleQuizSubmit = (e) => {
        e.preventDefault();
        submitAnswer("Lily");
    }

    const submitAnswer = (name) => {
        let radios = document.getElementsByName('choice');
        let val= "";
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                val = radios[i].value;
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

    return (
        <div id = 'Quiz' className="center3">
            <br></br>
            <div className={"center2"}>
                <ThemeProvider theme={theme}>
                <Button variant="contained" size={"small"} color={"neutral"}onClick = {() => navigate('/' + username + '&' + useremail+'&' +login_type)}> Go back to the main page</Button>
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
                    <img style={{borderRadius: '5%'}} src="https://watchandlearn.scholastic.com/content/dam/classroom-magazines/watchandlearn/videos/animals-and-plants/plants/what-are-plants-/What-Are-Plants.jpg" width={300} height={300} />
                <br></br>
                What plant is this?
                <br></br>
                <br></br>
                <div style={{textAlign: "left", width:"40%"}} className="center2">
                    <form>
                        <input type="radio" name="choice" value="Random plant" /> Random plant<br></br>
                        <input type="radio" name="choice" value="Lily" /> Lily<br></br>
                        <input type="radio" name="choice" value="Dandelion" /> Dandelion<br></br>
                        <input type="radio" name="choice" value="Sunflower"/> Sunflower<br></br>
                    </form>
                </div>
                <ThemeProvider theme={theme}>
                    <Button variant="contained" size={"small"} color={"neutral"} disableElevation onClick={handleQuizSubmit}>Submit Answer</Button>
                </ThemeProvider>
            </div>
            <p id={"result"}></p>
        </div>

    )

}

export default Quiz