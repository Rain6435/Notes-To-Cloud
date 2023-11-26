import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import FileUploadPage from './Upload';
import { useNavigate } from 'react-router-dom';
import './MyDocs.css'
import DocsList from './DocsList';

//Composante d'affichage de la section de Documents
function MyDocs() {
    //État d'affichage de l'élément actif
    const [active, setActive] = useState("list")
    //Activation de la composante d'upload
    function toggleUpload() {
        setActive("upload")
    }
    //Activation de la composante de list de documents
    function toggleDocsList() {
        setActive("list")
    }
    //Constante navigate qui nous permet de passer d'une page à une autre.
    const navigate = useNavigate()
    //Use Effect pour vérifer qu'un utilisateur est connecté pour pouvoir accéder à la page de documents
    useEffect(() => {
        if (localStorage.getItem('user') === null) {
            console.log(localStorage.getItem('user'))
            alert("Please log in to access you documents")
            navigate('/login')
        }
    })
    //Fonction d'affichage en fonction l'élément actif
    function RenderedComponent() {
        if(active === "upload"){
            return(
                <FileUploadPage></FileUploadPage>
            )
        }
        if(active === "list"){
            return(
                <DocsList></DocsList>
            )
        }
    }
    return (
        <div id="docsPage">
            <Layout></Layout>
            <div id='contentSection'>
                <input id="docsBtn" onClick={toggleDocsList} type="submit" required value="Documents" />
                <input id="listBtn" onClick={toggleUpload} type="submit" required value="Upload" />
            </div>
            <RenderedComponent></RenderedComponent>
        </div>
    )
}

export default MyDocs;