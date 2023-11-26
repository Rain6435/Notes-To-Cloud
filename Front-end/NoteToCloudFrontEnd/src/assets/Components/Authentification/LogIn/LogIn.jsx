import React, { useEffect, useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import CryptoJS from 'crypto-js';
import { BsArrowLeftCircle } from 'react-icons/bs';
import './LogIn.css'

//Composant de connection et d'authentification

const LoginPage = () => {
    //État dictionnaire qui représente l'utilisateur
    const [mUser, setUser] = useState({});
    //Constante navigate qui nous permet de passer d'une page à une autre.
    const navigate = useNavigate();
    //Use Effect qui vérifie constament si un utilisateur est connecté ou non.
    useEffect(() => {
        if (localStorage.getItem('user') !== null) {
            alert("Already logged in")
            navigate('/mydocs')
        }
    })
    //Fonction de reaction au changement dans un input au niveau du email et du mot de passe.
    //Fondamentalement obtenir la valeur des champs et l'enregistrer dans l'état utilisateur.
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUser(values => ({ ...values, [name]: value }))
    }
    //Fonction de gestion du bouton de connection.
    const handleManualLogin = (event) => {
        event.preventDefault();
        //Création de hash avec le mot de passe insérer par l'utilisateur.
        var r = CryptoJS.SHA256(mUser['password']).toString()
        //Requête Axios vers le serveur pour vérifier l'existence du client.
        axios.post("http://127.0.0.1:5000/login", { "mUser": { "email": mUser['email'], "password": r } })
            .then(function (response) {
                console.log(response.data)
                if (response.data['status'] === "success") {
                    localStorage.setItem('user', response.data['id']);
                    navigate("/mydocs");
                } else {
                    alert("Your email or password are not correct.");
                    document.getElementById("no_account").style.display = "block"
                }

            })
    };
    //Fonction de gestion d'une erreur générée par la connection Google.
    const handleGoogleLoginFailure = (error) => {
        console.log(error);
    };

    return (
        <div id='authPage'>
            <Link to="/" id='homeBtnContainer'><BsArrowLeftCircle id='homeButton'></BsArrowLeftCircle></Link>
            <div id='login'>
                <h1>Login</h1>
                <form id="loginForm" onSubmit={handleManualLogin}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name='email'
                            onChange={handleChange}
                            autoComplete="on"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name='password'
                            onChange={handleChange}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div id="social">
                    <GoogleOAuthProvider clientId='659499233457-92392u3k6g2fktgocegbv0dcvjkp0bad.apps.googleusercontent.com'>
                        <GoogleLogin onSuccess={credentialResponse => {
                            //Requête Axios pour vérifier l'existence de l'utilisateur Google dans notre base donnée.
                            axios.post(
                                //JWTDecode pour décoder la hash envoyer par Google
                                "http://127.0.0.1:5000/login", { "gUser": jwtDecode(credentialResponse.credential) }
                            )
                                .then(function (response) {
                                    if (response.data['status'] === "success") {
                                        localStorage.setItem('user', response.data['id']);
                                        navigate("/mydocs");
                                    } else if (response.data['status'] === "inexistent") {
                                        alert("Your google account isn't linked to any existing account, but we have created you one.");
                                        localStorage.setItem('user', response.data['id']);
                                        navigate("/mydocs");
                                    } else {
                                        alert("An error occured during the log in phase! Please try again.")
                                        localStorage.clear()
                                        navigate("/login");
                                    }
                                })
                        }}
                            onError={handleGoogleLoginFailure}></GoogleLogin>
                    </GoogleOAuthProvider>
                </div>
                <div id='no_account'>
                    <p>No account? Sign up <Link id="here" to="/signup">here</Link>!</p>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
