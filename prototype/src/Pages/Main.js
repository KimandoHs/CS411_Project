import axios from 'axios'
import React, {useEffect, useState} from 'react';
import './style.css'
import {signInWithPopup, signOut, GoogleAuthProvider, FacebookAuthProvider} from 'firebase/auth';
import {authentication} from "./firebase_config";
import {Button, Typography} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';
import GradeIcon from '@mui/icons-material/Grade';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AppsIcon from '@mui/icons-material/Apps';
import {useNavigate, useParams} from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';


const Main = () => {
    let navigate = useNavigate()
    let {main_username, main_email, login_type} = useParams();

    const theme = createTheme({
        status: {
            danger: '#e53e3e',
        },
        palette: {
            primary_green: {
                main: '#11B4CB',
                darker: '#fff',
            },

        },
        typography: {
            fontFamily: [
                'segoe ui',
            ].join(','),
        },
    });



    //                                        LOGIN STARTS HERE


    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [loginStat, setLoginStat] = useState(false);
    const [loginType, setLoginType] = useState("");



    const signInWithFacebook = () => {
        if(loginStat){
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
        else if(!loginStat) {
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
                    document.getElementById("loginname").innerHTML = "Oops! This Facebook email is linked to an existing Google user"
                    document.getElementById("loginemail").innerHTML = "Use Google login instead"

                })

        }

    }


    const signInWithGoogle = () => {
        if(loginStat){
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
        else if(!loginStat) {
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


    }

    const checkInsertUser = () =>{
        axios.post('http://localhost:8000/check_user', {uid: userId,useremail:userEmail})
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

    const handleLogout =() => {

            if (loginType == "facebook") {
                signInWithFacebook();
            } else if (loginType == "google") {
                signInWithGoogle()
            }
    }


    useEffect(() => {
        if(loginStat && loginType == "google") {
            var login_name = userName;
            var login_email = userEmail;
            var login_id = userId;
            checkInsertUser();
            document.getElementById("loginname").innerHTML = "Welcome back, " + login_name;
            document.getElementById("loginemail").innerHTML = "Email: " + login_email;
            document.getElementById("usercollection").style.display = "block"
            document.getElementById("facebookbutton").style.display = "none"
            document.getElementById("googlebutton").style.display = "none"

            document.getElementById("logoutbutton").style.display = "block"

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
            document.getElementById("loginname").innerHTML = "Welcome back, " + login_name;
            document.getElementById("loginemail").innerHTML = "Email: " + login_email;
            document.getElementById("usercollection").style.display = "block"
            document.getElementById("facebookbutton").style.display = "none"
            document.getElementById("googlebutton").style.display = "none"
            document.getElementById("logoutbutton").style.display = "block"
            var x = document.getElementById("googlebutton");
            var y = document.getElementById("logoutController");
            y.style.display = "none";
            x.style.display = "none";
        }
        else{
            document.getElementById("loginname").innerHTML = "Not Logged In";
            document.getElementById("loginemail").innerHTML = "";
            document.getElementById("usercollection").style.display = "none"
            document.getElementById("logoutbutton").style.display = "none"
            var x = document.getElementById('file')
            var y = document.getElementById('loadingimage')
            var z = document.getElementById('addfavbutton')

            z.style.display = "none"
            y.style.display = "none"
            x.style.display = "none"

            var x = document.getElementById("googlebutton");
            var y = document.getElementById("facebookbutton");
            var w = document.getElementById("logoutController");
            x.style.display = "block";
            y.style.display = "block";
            w.style.display = "block";
            navigate('/')
        }

    }, [ userId, userName, userEmail, loginStat, loginType])




    //                                        PLANT IDENTIFIER STARTS HERE




    //plant result variables

    const [identifyData, setIdentifyData] = useState(null);
    const [suggestArray, setSuggestArray] = useState([]);
    const [isPlant, setIsPlant] = useState(false);
    const [isPlantProb, setIsPlantProb] = useState(0);
    const [uploadImage, setUploadImage] = useState('');
    const [favObject, setFavObject] = useState(null);
    const [favButton, setFavButton] = useState('Add to Collection');

    const initial_p = Promise.resolve('')
    const [imageProm64, setImageProm64] = useState(initial_p);
    const [fileName,setFileName] = useState('No File Chosen');
    const [base64, setBase64] = useState('');
    const [imagePathUrl, setImagePathUrl] = useState('')
    //upload image path



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



    const onFileChange = e =>{
        document.getElementById("isplant").innerHTML = ''
        document.getElementById("suggestion1").innerHTML = ''
        document.getElementById("suggestion2").innerHTML = ''
        document.getElementById("suggestion3").innerHTML = ''
        var y = document.getElementById("addfavbutton")
        y.style.display = "none";

        setFavObject(null);
        setIdentifyData(null)
        setSuggestArray([])
        setUploadImage('');
        setIsPlantProb(0);
        const file = e.target.files[0]
        console.log("raw file submit", file)
        setFileName(file.name)
        setImagePathUrl(URL.createObjectURL(file))
        setImageProm64(prevImage64 => convertBase64(file))
    }


    useEffect(() => {
        if(imagePathUrl != ''){
            var x = document.getElementById('uploadimage')
            x.style.display = "block";
        }
        else{
            var x = document.getElementById('uploadimage')
            x.style.display = "none";
        }
        imageProm64
            .then(re=>{
                setBase64(prevBase64 => re.substring(re.indexOf(",") + 1));
            })
    }, [ imageProm64, imagePathUrl, fileName])

    useEffect(() => {
        if(base64 != ''){
            console.log("base64 string recorded")}
    }, [ base64 ])

    const submitFileData = () => {
        console.log("image submitted")
        var x = document.getElementById("loadingimage")
        x.style.display = "block";
        axios.post('http://localhost:8000/identify', {image: base64})
            .then((re)=>{
                setIdentifyData(re.data);
                console.log("return from api",re.data)})
            .catch(err=>{console.log(err)})
    }


    useEffect(() => {
        if(identifyData != null){
            setIsPlant(identifyData.is_plant);
            setUploadImage(identifyData.images[0].url);
            setIsPlantProb(identifyData.is_plant_probability);
            if(identifyData.suggestions.length > 3)
                setSuggestArray(identifyData.suggestions.slice(0,3))  // only take first three suggestions
            else
                setSuggestArray(identifyData.suggestions)
        }
    }, [ identifyData ])



    const parseXmlSuggestion = (item, i,userId) => {
        const details = item.plant_details;
        const index = i+1
        const plant_name = item.plant_name;
        var common_name_array = details.common_names;
        if(common_name_array == null){
            common_name_string = 'no common name'
        }
        else {
            common_name_array = common_name_array.slice(0, 3);
            var common_name_string = '';
            for (let i = 0; i < common_name_array.length; i++) {
                common_name_string += common_name_array[i] + ', ';
            }
            common_name_string = common_name_string.substring(0, (common_name_string.length - 2))
        }

        var scientific_name = details.scientific_name;
        if(scientific_name == null)
            {scientific_name = "no scientific name"}
        var synonym_array = details.synonyms;
        if(synonym_array == null){
            synonym_string = 'no synonym string'
        }
        else{
            if(synonym_array.length > 3) {
                synonym_array = synonym_array.slice(0, 3)
                var synonym_string = '';
                for (let i = 0; i < synonym_array.length; i++) {
                    synonym_string += synonym_array[i] + ', ';
                }
                synonym_string = synonym_string.slice(0, (synonym_string.length - 2))
            }
        }

        var plant_class = details.taxonomy.class
        if(plant_class == null)
            plant_class = "no class"
        var family = details.taxonomy.family
        if(family == null)
            family = "no family"
        var genus = details.taxonomy.genus
        if(genus == null)
            genus = "no genus"
        var kingdom = details.taxonomy.kingdom
        if(kingdom == null)
            kingdom = "no kingdom"
        var order = details.taxonomy.order
        if(order == null)
            order = "no order"
        var phylum = details.taxonomy.phylum
        if(phylum == null)
            phylum = "no phylum"
        var wiki_des = details.wiki_description;
        if(wiki_des == null)
            wiki_des = "no wikipedia description"
        else{wiki_des = details.wiki_description.value}
        var probability = item.probability;
        if(probability == null)
            probability = "no plant class"
        var simIm = item.similar_images;
        if(simIm == null){
            simImage_string = "no similar image"
        }
        else {
            if (simIm.length > 3)
                simIm = simIm.slice(0, 3);
            var simImage_string = '';
            for (let i = 0; i < simIm.length; i++) {
                simImage_string += "<div className = 'similar_image'>" +
                    "<img src =" + simIm[i].url + " width = '200px' height = '200px'>" +
                    "<div> Similarity:</div>" +
                    "<div> " + simIm[i].similarity.toPrecision(6) + "</div>" +
                    "</div>"
            }

            simImage_string = "<Stack direction = 'row' spacing = '20px'>" + simImage_string + "</Stack>"
        }
        const xmlBlock = "<div className = 'suggestion'>" +
            "<h2 >Suggestion " + index + "</h2>" +
            "<div> Likelyhood: " +probability.toPrecision(6)+"</div>" +
            "<div> Plant Name: " +plant_name+"</div>" +
            "<div> Common Names: " +common_name_string+"</div>" +
            "<div> Scientific Name: " +scientific_name+"</div>" +
            "<div> Synonyms: " +synonym_string+"</div>" +
            "<div> Class: " +plant_class+"</div>" +
            "<div> Family: " +family+"</div>" +
            "<div> Genus: " +genus+"</div>" +
            "<div> Kingdom: " +kingdom+"</div>" +
            "<div> Order: " +order+"</div>" +
            "<div> Phylum: " +phylum+"</div>" +
            "<div> Information: " +wiki_des+"</div>" +
            "<div> Similar Images: " +simImage_string+"</div>" +
            "</div>"
        let xmlObject = {xml: xmlBlock, name: plant_name, sci_name:scientific_name,
            class:plant_class, family:family, genus:genus,
            kingdom:kingdom, order:order, phylum:phylum,
            info:wiki_des, img:uploadImage, uid:userId}
        return xmlObject;
    }


    useEffect(()=>{
        if(suggestArray !=[] && isPlant) {
            document.getElementById("loadingimage").style.display = "none"
            document.getElementById("addfavbutton").style.display = "block"
            setFavButton('Add to Collection')
            for (let i = 0; i < suggestArray.length; i++) {
                if (i == 0){
                    const parseObj = parseXmlSuggestion(suggestArray[i], i,userId);
                    document.getElementById("suggestion1").innerHTML = parseObj.xml;
                    document.getElementById("isplant").innerHTML = 'It looks like ' + parseObj.name
                    setFavObject(parseObj);
                }
                else if (i == 1)
                    document.getElementById("suggestion2").innerHTML = parseXmlSuggestion(suggestArray[i], i,userId).xml
                else if (i == 2)
                    document.getElementById("suggestion3").innerHTML = parseXmlSuggestion(suggestArray[i], i,userId).xml
            }


        }
        else if(identifyData != null){
            document.getElementById("isplant").innerHTML = "Oops, doesn't look like a plant"
        }

    }, [ isPlant, isPlantProb, suggestArray, uploadImage ])

    useEffect(() => {

    }, [favObject, setFavButton])



    const checkInsertExistFav = (suggestObj) => {

        axios.post('http://localhost:8000/check_fav',
            {obj:suggestObj, uid:suggestObj.uid})
            .then((re) => {
                console.log("check user collection", suggestObj.uid, suggestObj.name, re)
                if(re.data.length != 0){
                    console.log("plant already in collection")
                    insertNewImage(suggestObj.name,suggestObj.img)
                }
                else{
                    insertNewPlant(suggestObj);
                }
            })
            .catch(err=>console.log(err))

    }

    const insertNewPlant = (suggestObj) => {
        const name = suggestObj.name
        const url = suggestObj.img
        console.log("trying to insert into user",suggestObj.uid,suggestObj)

        axios.post('http://localhost:8000/insert_fav',
            {obj:suggestObj, uid:suggestObj.uid})
            .then((re) => {
                console.log("inserted into user", suggestObj.uid, re)

            })
            .catch(err=>console.log(err))
        insertNewImage(name,url);
    }

    const insertNewImage = (name, url) => {
        axios.post('http://localhost:8000/check_image',
            {name:name, url:url})
            .then((re) => {
                if(re.data.length == 0){
                    axios.post('http://localhost:8000/insert_image',
                        {name:name, url:url})
                        .then((res) => {
                            console.log("inserted image", res)
                        })
                        .catch(err=>console.log(err))
                }
                else{
                    console.log("Image already in collection")
                }
            })
            .catch(err=>console.log(err))
    }

    const removeFav = (obj) => {
        axios.post('http://localhost:8000/delete_fav',
            {plant_name:obj.name})
            .then((res) => {
                console.log("deleted image", res)
            })
            .catch(err=>console.log(err))

        axios.post('http://localhost:8000/delete_image',
            {plant_name:obj.name})
            .then((res) => {
                console.log("deleted image_url", res)
            })
            .catch(err=>console.log(err))
    }

    const handleFavorite = () => {
        console.log("clicked favButton", favButton)
        if(favButton == 'Add to Collection'){

            console.log("uid state is", userId)
            const uid = userId
            console.log("user id is ",uid)
            if (uid == ''){
                alert("Log in to keep a collection")
            }
            else{
                const obj = favObject
                console.log("add favObj", favObject)

                setFavButton('In Collection');
                obj.uid = uid
                checkInsertExistFav(obj);
            }

        }
        else if(favButton == 'In Collection'){
            const uid = userId
            console.log("uid is", uid)
            if (uid == ''){
                alert("Log in to keep a collection")
                document.getElementById("addfavbutton").children[0].variant = "outlined"
                setFavButton('Add to Collection')
            }
            else{
                const obj = favObject
                document.getElementById("addfavbutton").children[0].variant = "outlined"
                setFavButton('Add to Collection')
                removeFav(obj);
            }

        }
    }




//                                      WIKI SEARCH STARTS HERE


    const [wikiSearch, setWikiSearch] = useState('');
    const [wikiIntro, setWikiIntro] = useState('');
    const [wikiImage, setWikiImage] = useState('');
    const [wikiTitle, setWikiTitle] = useState('');


    const parseWikiPage = (text) => {
        setWikiIntro('')
        setWikiImage('')
        setWikiTitle('')
        console.log("parsed",text)
        axios.post('http://localhost:8000/wikipedia', {searchText:text})
            .then((re)=>{
                const array = re.data
                console.log(array);
                var Continue = true;
                var counter = 0;
                var passIntro = false;
                while (counter < array.length && Continue) {
                    if(array[counter].type == "MAIN_TITLE"){
                        setWikiTitle(array[counter].text)
                    }
                    else if(array[counter].type == "MAIN_IMAGE_URL"){
                        setWikiImage(array[counter].url)
                    }
                    else if(array[counter].text == "Introduction"){
                        passIntro = true;
                    }
                    else if(passIntro && array[counter].type == "PARAGRAPH" && !(array[counter].text.substring(0,1)=='\n')){
                        setWikiIntro(array[counter].text);
                        Continue = false;
                    }
                    else if(passIntro && array[counter].type == "LIST"){
                        setWikiIntro(array[counter].list_items[0].text);
                        Continue = false;
                    }
                    counter += 1;
                }
                if(Continue){
                    setWikiIntro('No Information Found')
                }
            })

            .catch(err=>{console.log(err)})
    }

    useEffect(() =>{
        if(wikiIntro != '' && wikiImage != ''&& wikiTitle != '') {
            console.log("title: ", wikiTitle)
            console.log("imageurl: ", wikiImage)
            console.log("intro: ", wikiIntro)
            var x = document.getElementById('wikiimage')
            x.style.display = "block";
        }
        else{
            var x = document.getElementById('wikiimage')
            x.style.display = "none";
        }
    },[wikiIntro, wikiImage, wikiTitle])

    const handleWikiSubmit = (e) => {
        e.preventDefault();
        parseWikiPage(wikiSearch);
    }




    useEffect(()=>{

    }, [wikiSearch])


    const handleLogout2 = () => {

    }


//                                                              DEFAULT RENDER HERE
    useEffect(() => {

        if(main_username != null) {
            document.getElementById('loginname').innerHTML = "Welcome back, " + main_username
            document.getElementById('loginemail').innerHTML = "Email: "+main_email
            document.getElementById('facebookbutton').style.display = "none"
            document.getElementById('googlebutton').style.display = "none"
            document.getElementById('logoutbutton').style.display = "none"
            document.getElementById('usercollection').style.display = "block"
            document.getElementById('logoutController').style.display = "none"
            setUserName(main_username)
            setUserEmail(main_email)
            setLoginType(login_type)
            setLoginStat(true)
        }
        else{
        var w = document.getElementById('usercollection')
        var x = document.getElementById('file')
        var y = document.getElementById('loadingimage')
        var z = document.getElementById('addfavbutton')
        var a = document.getElementById('logoutbutton')

            a.style.display = "none"
        w.style.display = "none"
        z.style.display = "none"
        y.style.display = "none"
        x.style.display = "none"
        }
    }, [])




    //                                                   COLLECTION FEATURE HERE


    return (




        <div style={{ backgroundImage: "url(/newphoto.jpg)" }}>

        <div className="App">
            <ThemeProvider theme={theme}>






                <div className= "login">
                    <Stack direction = "row" spacing = {0}>
                        <div className="loginStatus">
                            <div id = "loginname"> </div>
                            <div id = "loginemail"></div>
                        </div>
                        <div id = "logoutbutton">
                            <Button size ='small' color = 'primary_green' variant="outlined"  sx={{m:2}} startIcon = {<LogoutIcon/>} onClick = {handleLogout}>
                                LOG OUT
                            </Button>
                        </div>


                    </Stack>

                    <div id  = "usercollection">
                        <Button size ='small' color = 'primary_green' variant="contained"  sx={{m:2}}
                                startIcon = {<AppsIcon/>} onClick = {() => navigate('/my_collection/'+userName+'&' + userEmail +'&' +loginType)}>
                            My Collection
                        </Button>
                    </div>

                    <div id = "loginbutton">

                        <Stack direction="row" spacing={0}>
                            <div id="googlebutton" className="googleLogin">
                                <Button size ='small' color = 'primary_green' variant="contained"  sx={{m:2}} startIcon = {<GoogleIcon/>} onClick={signInWithGoogle}>
                                    Google
                                </Button>
                            </div>
                            <div id = "facebookbutton" className="facebookLogin">
                                <Button size ='small' color = 'primary_green' variant="contained" sx = {{m:2}} startIcon={<FacebookIcon/>} onClick={signInWithFacebook}>
                                    Facebook
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

                    </div>
                </div>



                <div className= "center2">

                    <Typography variant="h4" gutterBottom>Plant Identification</Typography>

                    <div id = 'uploadimage'>
                        <img src={imagePathUrl} width={300} height={300}/>
                    </div>
                    <br></br>

                    <div>
                        <Button size ='small' color = 'primary_green' variant="contained" sx = {{m:2}} startIcon={<AttachFileIcon/>}
                                onClick={() => document.getElementById('file').click()}>Choose File</Button>

                        <input id = 'file' type = "file"  name = "image" onChange={onFileChange}></input>
                        &nbsp;&nbsp;{fileName}&nbsp;&nbsp;
                        <Button size ='small' color = 'primary_green' variant="contained" sx = {{m:2}}
                                startIcon={<UploadFileIcon/>} onClick = {submitFileData}>Identify</Button>
                    </div>
                    <br></br>
                    <h2 id = "loadingimage">Loading... Please Wait</h2>

                    <h2 id = "isplant"></h2>
                    <div id = "addfavbutton">
                        <Button size ='small' color = 'primary_green' variant="outlined" sx = {{m:2}} startIcon={<GradeIcon/>} onClick={handleFavorite}>
                            {favButton}
                        </Button>
                    </div>

                    <Stack direction = 'row' spacing = {1}>
                        <div id="suggestion1"></div>
                        <div id="suggestion2"></div>
                        <div id="suggestion3"></div>
                    </Stack>
                </div>






                <div className="center2">
                    <Typography variant="h4" gutterBottom>Plant Query</Typography>
                    <input type="text" placeholder="Search for plants" onChange = {e => setWikiSearch(e.target.value)} ></input>
                    <Button size ='small' color = 'primary_green' variant="contained" sx = {{m:2}}
                            startIcon={<SearchIcon/>} onClick={handleWikiSubmit}>Search</Button>
                </div>
                <div id = "wikipage" className="center2">
                    <h2>{wikiTitle}</h2>
                    <Stack direction="row" spacing={2}>
                        <div>{wikiIntro}</div>

                        <div id = 'wikiimage' ><img width={300} height={300} src={wikiImage}/></div>
                    </Stack>
                </div>



            </ThemeProvider>
        </div>
        </div>




    )

}

export default Main;
