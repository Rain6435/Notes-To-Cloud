import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../Authentification/LogIn/LogIn.jsx';
import SignUpPage from '../Authentification/SignUp/SignUp.jsx';
import MyDocs from '../MyDocs/MyDocs.jsx'
import AboutUS from '../AboutUS/AboutUs.jsx'
import Home from './Home.jsx';
import './Page.css'

export default function Router() {
    return (
        <div id='mainPage'>
            <div id='menu'>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path='/mydocs' element={<MyDocs />} />
                        <Route path='/aboutus' element={<AboutUS />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    )
}