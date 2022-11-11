import axios from 'axios'
import {useEffect, useState} from 'react';
import './style.css'

const App = () => {
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
