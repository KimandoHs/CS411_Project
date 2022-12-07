import React from 'react'
import {useNavigate, useParams}  from "react-router-dom";

const Collection = () => {
    let navigate = useNavigate()
    let {username, useremail, login_type} = useParams()
    return (

        <div id = 'Collection'>

            This is {username}'s collection
            <button onClick = {() => navigate('/' + username + '&' + useremail+'&' +login_type)}> back to home</button>
        </div>


    )

}

export default Collection