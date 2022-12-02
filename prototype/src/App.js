import axios from 'axios'
import {useEffect, useState} from 'react';
import './style.css'
import {signInWithPopup, signOut, GoogleAuthProvider, FacebookAuthProvider} from 'firebase/auth';
import {authentication} from "./firebase_config";

const App = () => {

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loginStat, setLoginStat] = useState(false);
  const [loginButton1, setLoginButton1] = useState("Log in with Google");
  const [loginButton2, setLoginButton2] = useState("Log in with Facebook");
  const [loginType, setLoginType] = useState("");
  const [isNew, setIsNew] = useState([]);

  const signInWithFacebook = () => {
      if(!loginStat) {
          const provider = new FacebookAuthProvider();
          signInWithPopup(authentication, provider)
              .then((re) => {
                  console.log(re.user);
                  setUserName(prevName => re.user.displayName);
                  setUserEmail(prevEmail => re.user.email);
                  setUserId(prevId => re.user.uid)
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
                      setUserName(prevName => "");
                      setUserEmail(prevEmail => "");
                  setUserId(prevId => "")
                  setLoginType(prevType => "")
                  setLoginStat(prevStat => false);
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
            setUserName(prevName => re.user.displayName);
            setUserEmail(prevEmail => re.user.email);
              setUserId(prevId => re.user.uid);

              setLoginType(prevType => "google")

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

  const insertUserData = () =>{
      axios.post('http://localhost:8000/insert_user', {uid: userId, name: userName, email: userEmail})
          .then((re) => {
              console.log("inserted new user");
          })
  }

  const checkNewUser = () => {
      axios.post('http://localhost:8000/check_user', {uid: userId})
          .then((re) => {
              console.log(re);
              setIsNew(prevIsNew => re.data);
              if(re.data.length > 0) {
                  console.log(re.data.length);
              }
              else{
                  console.log("data length 0")
              }
          })
  }

  useEffect(() => {
    if(loginStat && loginType == "google") {
      var login_name = userName;
      var login_email = userEmail;
      var login_id = userId;
      checkNewUser();
      console.log(isNew[0]);
      console.log("ok")
      if(isNew.length > 0) {
      }
      else{
      insertUserData();}
      document.getElementById("loginname").innerHTML = "You are logged in to Google as " + login_name;
      document.getElementById("loginemail").innerHTML = "Email: " + login_email;
      setLoginButton1(prevButton => "Log out");
      var x = document.getElementById("facebookbutton");
      x.style.display = "none";
    }
    else if(loginStat && loginType == "facebook"){
        var login_name = userName;
        var login_email = userEmail;
        var login_id = userId;
        checkNewUser()
        if(isNew.length > 0){}
        else{
        insertUserData();}
        document.getElementById("loginname").innerHTML = "You are logged in to Facebook as " + login_name;
        document.getElementById("loginemail").innerHTML = "Email: " + login_email;
        setLoginButton2(prevButton => "Log out");
        var x = document.getElementById("googlebutton");
        x.style.display = "none";
    }
    else{
      document.getElementById("loginname").innerHTML = "You are not logged in";
      document.getElementById("loginemail").innerHTML = "";
      setLoginButton1(prevButton => "Log in with Google");
      setLoginButton2(prevButton => "Log in with Facebook");

        var x = document.getElementById("googlebutton");
        var y = document.getElementById("facebookbutton");
        x.style.display = "block";
        y.style.display = "block";



    }

  }, [userName, userEmail, userId, loginStat, loginType])







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

  console.log(chosenName)
  console.log(chosenType)

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
}, [getDataInfo])


  return (
      <div className="App">


        <div id = "loginname"> You are not logged in </div>
        <div id = "loginemail"></div>
        <div id = "loginbutton">
          <p id="googlebutton"><button  onClick={signInWithGoogle}> {loginButton1}</button></p>
          <p id = "facebookbutton"><button  onClick={signInWithFacebook}> {loginButton2}</button></p>
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
  );
}

export default App;
