
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Main from './Pages/Main'
import Collection from './Pages/Collection'
import Quiz from './Pages/Quiz'
import Error from './Pages/Error'

const App = () => {


return (

        <Router>
            <Routes>
                <Route path = "/" element={<Main />}/>
                <Route path = "/:main_username&:main_email&:login_type" element={<Main />}/>
                <Route path = "/my_collection/" element={<Collection />}/>
                <Route path = "/my_collection/:username&:useremail&:login_type" element={<Collection />}/>
                <Route path = "/quiz/" element={<Quiz />}/>
                <Route path = "/quiz/:username&:useremail&:login_type" element={<Quiz />}/>
                <Route path = "*" element={<Error />}/>
            </Routes>
        </Router>

  )

}

export default App;
