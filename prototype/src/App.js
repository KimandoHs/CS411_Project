import axios from 'axios'
import React, {useEffect, useState} from 'react';
import './style.css'
import {signInWithPopup, signOut, GoogleAuthProvider, FacebookAuthProvider} from 'firebase/auth';
import {authentication} from "./firebase_config";
import {Button} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';







const App = () => {

    const theme = createTheme({
        status: {
            danger: '#e53e3e',
        },
        palette: {
            primary_green: {
                main: '#6B8E23',
                darker: '#fff',
            },

        },
    });


    //                                        LOGIN STARTS HERE



    const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loginStat, setLoginStat] = useState(false);
  const [loginButton1, setLoginButton1] = useState("Google");
  const [loginButton2, setLoginButton2] = useState("Facebook");
  const [loginType, setLoginType] = useState("");



  const signInWithFacebook = () => {
      if(!loginStat) {
          const provider = new FacebookAuthProvider();
          signInWithPopup(authentication, provider)
              .then((re) => {
                  console.log(re.user);
                  setUserId(prevId => re.user.uid);
                  setUserName(prevName => re.user.displayName);
                  setUserEmail(prevEmail => {
                      if(re.user.email == null){
                          return "not setup."
                      }
                      else{
                          return re.user.email
                      }
                  });
                  setLoginType(prevType => "facebook")
                  setLoginStat(prevState => true);
              })
              .catch((err) => {
                  console.log(err);
              })
      }
      else{
          signOut(authentication)
              .then((re) => {
                  console.log("logged out")
                  setUserId(prevId => "");
                  setUserName(prevName => "");
                  setUserEmail(prevEmail => "");
                  setLoginType(prevType => "")
                  setLoginStat(prevState => false);
                  }
              )
              .catch((err) => {
                  console.log(err);
              })
      }
  }


  const signInWithGoogle = () => {
    if(!loginStat) {
      const provider = new GoogleAuthProvider();
      signInWithPopup(authentication, provider)
          .then((re) => {
            console.log(re.user);
            setUserId(prevId => re.user.uid);
            setUserName(prevName => re.user.displayName);
            setUserEmail(prevEmail => {
                if(re.user.email == null){
                    return "not setup."
                }
                else{
                    return re.user.email
                }
            });
            setLoginType(prevType => "google");
            setLoginStat(prevState => true);
          })
          .catch((err) => {
            console.log(err);
          })
    }
    else{
      signOut(authentication)
          .then((re) => {
                console.log("logged out");
              setUserName(prevName => "");
              setUserEmail(prevEmail => "");
              setUserId(prevId => "");
              setLoginType(prevType => "")
              setLoginStat(prevStat => false);
              }
          )
          .catch((err) => {
            console.log(err);
          })
    }

  }

  const checkInsertUser = () =>{
      axios.post('http://localhost:8000/check_user', {uid: userId})
          .then((re) => {
              console.log("returned match: ", re.data.length);

              if(re.data.length == 0){
                  axios.post('http://localhost:8000/insert_user', {uid: userId, name: userName, email: userEmail})
                  .then((re) => {
                      console.log("inserted new user");
                      console.log(re)
                  })
              }
              else{
                  console.log("old user not inserted")
              }
          })
  }


  useEffect(() => {
    if(loginStat && loginType == "google") {
      var login_name = userName;
      var login_email = userEmail;
      var login_id = userId;
      checkInsertUser();
      document.getElementById("loginname").innerHTML = "You are logged in to Google as " + login_name;
      document.getElementById("loginemail").innerHTML = "Email: " + login_email;
      setLoginButton1(prevButton => "Log Out");
      var x = document.getElementById("facebookbutton");
      var y = document.getElementById("logoutController");
        y.style.display = "none";
        x.style.display = "none";
    }
    else if(loginStat && loginType == "facebook"){
        var login_name = userName;
        var login_email = userEmail;
        var login_id = userId;
        checkInsertUser();
        document.getElementById("loginname").innerHTML = "You are logged in to Facebook as " + login_name;
        document.getElementById("loginemail").innerHTML = "Email: " + login_email;
        setLoginButton2(prevButton => "Log Out");
        var x = document.getElementById("googlebutton");
        var y = document.getElementById("logoutController");
        y.style.display = "none";
        x.style.display = "none";
    }
    else{
      document.getElementById("loginname").innerHTML = "You Are Not Logged In";
      document.getElementById("loginemail").innerHTML = "";
      setLoginButton1(prevButton => "Google");
      setLoginButton2(prevButton => "Facebook");

        var x = document.getElementById("googlebutton");
        var y = document.getElementById("facebookbutton");

        var w = document.getElementById("logoutController");
        x.style.display = "block";
        y.style.display = "block";
        w.style.display = "block";

    }

  }, [ userId, userName, userEmail, loginStat, loginType])





    //                                        PLANT QUERY STARTS HERE





  const [chosenName, setChosenName] = useState(null)
  const [chosenType, setChosenType] = useState("common")
  const [getDataInfo, setDataInfo] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = event => {
    event.preventDefault();
    if (chosenType && chosenName) {
      getData();
    }
    console.log('form submitted');
  }
  const getData = () => {

    const options = {
      method: 'GET',
      url: 'http://localhost:8000/results',
      params: {type: chosenType, name: chosenName.replace(/\s+/g, '')},
    };

    axios.request(options).then((response) => {
      console.log(response.data)
      setDataInfo(response.data)
    }).catch((error) => {
      console.error(error)
    })
  }


useEffect( () => {
  if (getDataInfo && getDataInfo.length > 0) {
    document.getElementById('demo2').innerHTML = ""
    var para = document.createElement("p");
    for (let i = 0; i < getDataInfo.length; i++) {
      var node = document.createTextNode(i + 1 +'. ' +
          'Scientific name: ' + getDataInfo[i].latin +
          ', Category: ' + getDataInfo[i].category +
          ', Origin: ' + getDataInfo[i].origin)
      document.getElementById('demo2').appendChild(node);
      var linebreak = document.createElement("br");
      document.getElementById('demo2').appendChild(linebreak);
    }
  }
  else if (getDataInfo && getDataInfo.length === 0) {
    document.getElementById('demo2').innerHTML = "No result returned."
  }
}, [getDataInfo]);





  //                                        PLANT IDENTIFIER STARTS HERE




//plant result variables

    const [identifyData, setIdentifyData] = useState(null);
    const [suggestArray, setSuggestArray] = useState([]);
    const [isPlant, setIsPlant] = useState(false);
    const [isPlantProb, setIsPlantProb] = useState(0);

//upload image path

    const [imagePathUrl, setImagePathUrl] = useState('')

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            };
        })
    }




   const initial_p = Promise.resolve('')
   const [imageProm64, setImageProm64] = useState(initial_p);
   const [base64, setBase64] = useState('');

  const onFileChange = e =>{
      const file = e.target.files[0]
      console.log("raw file submit", file)
      setImagePathUrl(URL.createObjectURL(file))
      setImageProm64(prevImage64 => convertBase64(file))
  }


    useEffect(() => {
        imageProm64
            .then(re=>{
            setBase64(prevBase64 => re.substring(re.indexOf(",") + 1));
            })
    }, [ imageProm64, imagePathUrl ])

    useEffect(() => {
        if(base64 != ''){
        console.log("base64 string recorded")}
    }, [ base64 ])

  const submitFileData = () => {
      console.log("image submitted")
      axios.post('http://localhost:8000/identify', {image: base64})
          .then((re)=>{
              setIdentifyData(re.data);
              console.log("return from api",re.data)})
          .catch(err=>{console.log(err)})
  }


    useEffect(() => {
    if(identifyData != null){
        setIsPlant(identifyData.is_plant);
        setIsPlantProb(identifyData.is_plant_probability);
        if(identifyData.suggestions.length > 3)
        setSuggestArray(identifyData.suggestions.subarray(0,3))  // only take first three suggestions
        else
            setSuggestArray(identifyData.suggestions)
    }
}, [ identifyData ])

    useEffect(()=>{

    }, [ isPlant, isPlantProb, suggestArray ])







    return (






      <div className="App">

          <div className= "login">
              <div className="loginStatus">
        <div id = "loginname"> </div>
        <div id = "loginemail"></div>
              </div>

        <div id = "loginbutton">
            <ThemeProvider theme={theme}>
                <Stack direction="row" spacing={0}>
            <div id="googlebutton" className="googleLogin">
                <Button size ='small' color = 'primary_green' variant="contained"  sx={{m:2}} startIcon = {<GoogleIcon/>} onClick={signInWithGoogle}>
                {loginButton1}
                </Button>
            </div>
            <div id = "facebookbutton" className="facebookLogin">
                <Button size ='small' color = 'primary_green' variant="contained" sx = {{m:2}} startIcon={<FacebookIcon/>} onClick={signInWithFacebook}>
                    {loginButton2}
                </Button>
            </div>
                </Stack>
            <div id = "logoutController">
            <div className="logoutProp">
                Log Out Existing Users At
            </div>
                <Stack direction="row" spacing={0}>
                    <div className="logout">
                <IconButton size ='small' aria-label="google" color = "primary_green" onClick = {() => window.open('https://myaccount.google.com', '_blank')}>
                    <GoogleIcon/>
                </IconButton>
            </div>
            <div className="logout">
                <IconButton size ='small' aria-label="facebook" color = "primary_green" onClick = {() => window.open('https://www.facebook.com', '_blank')}>
                    <FacebookIcon/>
                </IconButton>
            </div>
            </Stack>
            </div>
            </ThemeProvider>
        </div>

      </div>


          <div >
              <div className= "center2">
              <h1 >Plant Identification</h1>

              <div>
                  <input type = "file" name = "image" onChange={onFileChange}></input>
                  <button onClick = {submitFileData}>Upload and Identify</button>
              </div>
              </div>
              <br></br>
              <div>
                  <img src={imagePathUrl}/>
              </div>
          </div>



        <div className="center2">
          <h1>Plant lookup</h1>
            <p>Search up the name of a plant to return data about it. </p>
        </div>
        <div className="center">
          <div className="search">
            <form className="search-form" onSubmit={handleSubmit}>
              <select value = {chosenType} onChange = {e => setChosenType(e.target.value)}>
                <option value={"common"}>Common</option>
                <option value={"latin"}>Scientific/Latin</option>
              </select>
              <input type="text" id="textbox1" placeholder="Search for plants, houseplants, etc.." onChange = {e => setChosenName(e.target.value)} ></input>
              <input type="submit" value="Submit"></input>
            </form>
          </div>
        </div>
        <p id = "demo" className = "center2"></p>
        <div id = "demo2" className = "center2"></div>







      </div>



  )

}

export default App;
