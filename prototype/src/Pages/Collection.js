import React, {useEffect, useState} from 'react'
import {useNavigate, useParams}  from "react-router-dom";
import axios from "axios";
import './style.css'
import {Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {ThemeProvider} from "@mui/material/styles";
import {createTheme} from "@mui/material/styles";




const Collection = () => {

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

    let navigate = useNavigate()
    let {userid, username, useremail, login_type} = useParams()
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    const getCollectionObj = () => {
        axios.post('http://localhost:8000/get_collection',
            { email:useremail})
            .then((re) => {
                console.log("return from database",re.data)
                displayCollection(re.data)
            })
            .catch(err=>console.log(err))
    }



    const handleDelete = (plant_name) => {
        axios.post('http://localhost:8000/delete_fav',
            { plant_name:plant_name})
            .then((re) => {
                console.log("deleted collection",re.data)
            })
            .catch(err=>console.log(err))

        axios.post('http://localhost:8000/delete_image',
            { plant_name:plant_name})
            .then((re) => {
                console.log("deleted image",re.data)
            })
            .catch(err=>console.log(err))
        getCollectionObj();
    }


    const displayCollection = (array) => {
        removeAllChildNodes(document.getElementById("collectionblock"))
        for(let i = 0;i < array.length; i++){
            const rowObj = array[i]
            console.log("displaying", rowObj)
            const name_div = document.createElement("h2")
            const name = document.createTextNode(rowObj.plant_name)
            name_div.append(name)


            const date_div = document.createElement("div")
            date_div.style = "text-align:left"
            const date_cat = document.createTextNode("Created on")
            date_div.appendChild(date_cat)
            const date_span = document.createElement("span")
            date_span.style = "float:right"
            const date = document.createTextNode(rowObj.add_date.substring(0,24))
            date_span.appendChild(date)
            date_div.appendChild(date_span)


            const sci_div = document.createElement("div")
            sci_div.style = "text-align:left"
            const sci_cat = document.createTextNode("Scientific name")
            sci_div.appendChild(sci_cat)
            const sci_span = document.createElement("span")
            sci_span.style = "float:right"
            const sci = document.createTextNode(rowObj.sci_name)
            sci_span.appendChild(sci)
            sci_div.appendChild(sci_span)

            const cla_div = document.createElement("div")
            cla_div.style = "text-align:left"
            const cla_cat = document.createTextNode("Class")
            cla_div.appendChild(cla_cat)
            const cla_span = document.createElement("span")
            cla_span.style = "float:right"
            const cla = document.createTextNode(rowObj.plant_class)
            cla_span.appendChild(cla)
            cla_div.appendChild(cla_span)



            const fam_div = document.createElement("div")
            fam_div.style = "text-align:left"
            const fam_cat = document.createTextNode("Family")
            fam_div.appendChild(fam_cat)
            const fam_span = document.createElement("span")
            fam_span.style = "float:right"
            const fam = document.createTextNode(rowObj.family)
            fam_span.appendChild(fam)
            fam_div.appendChild(fam_span)

            const gen_div = document.createElement("div")
            gen_div.style = "text-align:left"
            const gen_cat = document.createTextNode("Genus")
            gen_div.appendChild(gen_cat)
            const gen_span = document.createElement("span")
            gen_span.style = "float:right"
            const gen = document.createTextNode(rowObj.genus)
            gen_span.appendChild(gen)
            gen_div.appendChild(gen_span)

            const kin_div = document.createElement("div")
            kin_div.style = "text-align:left"
            const kin_cat = document.createTextNode("Kingdom")
            kin_div.appendChild(kin_cat)
            const kin_span = document.createElement("span")
            kin_span.style = "float:right"
            const kin = document.createTextNode(rowObj.kingdom)
            kin_span.appendChild(kin)
            kin_div.appendChild(kin_span)

            const ord_div = document.createElement("div")
            ord_div.style = "text-align:left"
            const ord_cat = document.createTextNode("Order")
            ord_div.appendChild(ord_cat)
            const ord_span = document.createElement("span")
            ord_span.style = "float:right"
            const ord = document.createTextNode(rowObj.order)
            ord_span.appendChild(ord)
            ord_div.appendChild(ord_span)

            const phy_div = document.createElement("div")
            phy_div.style = "text-align:left"
            const phy_cat = document.createTextNode("Phylum")
            phy_div.appendChild(phy_cat)
            const phy_span = document.createElement("span")
            phy_span.style = "float:right"
            const phy = document.createTextNode(rowObj.phylum)
            phy_span.appendChild(phy)
            phy_div.appendChild(phy_span)


            const wiki_div = document.createElement("div")
            wiki_div.style = "text-align:left"
            const wiki_cat = document.createTextNode("Wiki")
            wiki_div.appendChild(wiki_cat)
            const wiki_span = document.createElement("span")
            wiki_span.style = "float:right"
            const wiki = document.createTextNode(rowObj.info.substring(0,30) + "...")
            wiki_span.appendChild(wiki)
            wiki_div.appendChild(wiki_span)

            const image_div = document.createElement("img")
            image_div.src = rowObj.image_url
            image_div.alt = "Avatar"
            image_div.style = "width: 310px; height: 310px; object-fit: cover"

            var id = "block"+ i
            var block = document.createElement('div')
            block.className = "card"
            block.id = id
            block.appendChild(image_div)

            var container = document.createElement('div')
            container.className = "container"
            var containerinfo = document.createElement('div')
            containerinfo.className = "containerinfo"

            container.appendChild(name_div)

            containerinfo.appendChild(date_div)
            containerinfo.appendChild(sci_div)
            containerinfo.appendChild(cla_div)
            containerinfo.appendChild(fam_div)
            containerinfo.appendChild(gen_div)
            containerinfo.appendChild(ord_div)
            containerinfo.appendChild(phy_div)
            containerinfo.appendChild(wiki_div)

            container.appendChild(containerinfo)
            block.appendChild(container)

            var delete_div = document.createElement('div')
            var deleteButton = document.createElement('button')
            deleteButton.innerHTML = "REMOVE"
            deleteButton.id = rowObj.plant_name
            deleteButton.addEventListener("click",function (e){
                handleDelete(this.id);
            })
            delete_div.appendChild(deleteButton)
            container.appendChild(delete_div)

            if(i%4 == 0){
                var newline = document.createElement("div")
                newline.id = "line"+(i/4)
                newline.appendChild(block);
                document.getElementById('collectionblock').appendChild(newline)
            }
            else {
                var lineId = "line" + (i - i%4)/4
                document.getElementById(lineId).appendChild(block)
            }


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
            <ThemeProvider theme={theme}>



            <div id = "userinfo" className= "collectionid">
                <div>{username}'s Plant Collection</div>
                <div className="backhomebutton">
                    <Button size ='small' color = 'primary_green' variant="contained" sx = {{m:2}} startIcon={<ArrowBackIcon/>}
                            onClick={() => navigate('/' + userid +'&' + username + '&' + useremail+'&' +login_type)}>Back to Main Page</Button>
                </div>

            </div>




            <div id = "collectionblock" >
            </div>




            </ThemeProvider>
        </div>


    )

}

export default Collection