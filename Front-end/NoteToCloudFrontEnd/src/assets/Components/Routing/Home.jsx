import React from 'react';
import Layout from '../Layout/Layout.jsx';
import './Page.css'

//Composant affichant la page d'accueuil
export default function Home() {    
    return (
        <div id='mainPage'>
            <Layout></Layout>
            <div id='ntc'>
                <p id='n'>Notes</p>
                <p id='t'>To</p>
                <p id='c'>Cloud</p>
            </div>
        </div>
    )
}