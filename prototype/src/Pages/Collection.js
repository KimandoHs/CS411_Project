import React, {useEffect, useState} from 'react'
import {useNavigate, useParams}  from "react-router-dom";
import axios from "axios";
import './style.css'
import Stack from '@mui/material/Stack';



const Collection = () => {
    let navigate = useNavigate()
    let {username, useremail, login_type} = useParams()

    const getCollectionObj = () => {
        axios.post('http://localhost:8000/get_collection',
            {name:username, email:useremail})
            .then((re) => {
                console.log("return from database",re.data)
                displayCollection(5,re.data)
            })
            .catch(err=>console.log(err))
    }



    const displayCollection = (endIndex,array) => {
        removeAllChildNodes(document.getElementById("collectionblock").children[0])
        for(let i = 0; i < endIndex && i < array.length; i++){
            const rowObj = array[i]
            console.log("displaying", rowObj)
            const name_div = document.createElement("div")
            const name = document.createTextNode(rowObj.plant_name)
            name_div.append(name)
            const date_div = document.createElement("div")
            const date = document.createTextNode(rowObj.add_date.substring(0,24))
            date_div.append(date)
            const sci_div = document.createElement("div")
            const sci = document.createTextNode(rowObj.sci_name)
            sci_div.append(sci)
            const class_div = document.createElement("div")
            const class_name = document.createTextNode(rowObj.plant_class)
            class_div.append(class_name)
            const family_div = document.createElement("div")
            const family = document.createTextNode(rowObj.family)
            family_div.append(family)
            const genus_div = document.createElement("div")
            const genus = document.createTextNode(rowObj.genus)
            genus_div.append(genus)
            const kingdom_div = document.createElement("div")
            const kingdom = document.createTextNode(rowObj.kingdom)
            kingdom_div.append(kingdom)
            const order_div = document.createElement("div")
            const order = document.createTextNode(rowObj.order)
            order_div.append(order)
            const phylum_div = document.createElement("div")
            const phylum = document.createTextNode(rowObj.phylum)
            phylum_div.append(phylum)
            const wiki_div = document.createElement("div")
            const wiki = document.createTextNode(rowObj.info)
            wiki_div.append(wiki)
            const image_div = document.createElement("img")
            image_div.src = rowObj.image_url
            image_div.width = 200
            image_div.height = 200

            var id = "block"+ i
            console.log(id)
            console.log(document.getElementById(id))
            document.getElementById(id).appendChild(name_div)
            document.getElementById(id).appendChild(date_div)
            document.getElementById(id).appendChild(sci_div)
            document.getElementById(id).appendChild(class_div)
            document.getElementById(id).appendChild(family_div)
            document.getElementById(id).appendChild(genus_div)
            document.getElementById(id).appendChild(order_div)
            document.getElementById(id).appendChild(phylum_div)
            document.getElementById(id).appendChild(wiki_div)
            document.getElementById(id).appendChild(image_div)




        }
    }

    const removeAllChildNodes = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    useEffect(() => {

        getCollectionObj()
    }, [])


    return (

        <div id = 'Collection'>




            <div id = "userinfo">
            This is {username}'s collection
            <button onClick = {() => navigate('/' + username + '&' + useremail+'&' +login_type)}> back to home</button>
        </div>
            <div id = "collectionblock">

                    <div style={{padding:"50px 50px 0px 0px"}} id = "block0" className="box0"></div>
                    <div style={{padding:"50px 50px 0px 0px"}} id = "block1" className = "box1"></div>
                    <div style={{padding:"50px 50px 0px 0px"}} id = "block2" className = "box2"></div>
                    <div id = "block3" className = "box3"></div>
                    <div id = "block4" className = "box4"></div>



            </div>





        </div>


    )

}

export default Collection