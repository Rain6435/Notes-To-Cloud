import React from 'react';
import './AboutUs.css'
import Layout from '../Layout/Layout.jsx';

function AboutUS() {
    return (
        <div id="page">
            <Layout></Layout>
            <div className='card'>
                <p id='description'>We provide a service that allows you to easily convert text within images into a readable and searchable format. With this service, you can upload an image containing text to the application, and the AI technology will automatically detect the text, extract it, and convert it into a PDF file or a text file. You can then access the converted file by logging into the application and finding your collection of uploaded documents. This service can save you time and effort by quickly and accurately converting important information within images into a usable format.</p>
            </div>
            <div>
                <h1 id='authorsTitle'>The wonderful authors of this tool</h1>
                <div id='authors'>
                    <div id="card">
                        <div id='author'>Mohammed Elhasnaoui</div>
                        <img id='authorImage' alt='author' src={''}></img>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUS;