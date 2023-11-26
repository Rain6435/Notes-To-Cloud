import { useEffect, useState } from 'react';
import './DocsList.css'
import axios, { AxiosResponse } from 'axios';
import * as Tooltip from '@radix-ui/react-tooltip';

//Composant représentatn la liste de documents
function DocsList() {
    //État list des documents prêt à être consultés
    const [listReadyFiles, setListReadyFiles] = useState(Array<String>);
    //État list des documents pas prêt à être consultés
    const [listNotReadyFiles, setListNotReadyFiles] = useState(Array<String>);
    //État chaine de caractères représentant le message d'erreur lorsque voulu
    const [message, setMessage] = useState("")
    //Composant représentant le spinner lorsqu'un document est entrain d'être traité
    const Spinner = () => <div className="loader"></div>;
    //Use Effect pour obtenir la liste des documents d'un utilisateur au moment ou le composant est charger
    useEffect(() => {
        request()
    }, [])
    //Fonction d'obtention des documents du serveur
    function request() {
        axios.post("http://127.0.0.1:5000/getListFiles", { "id": localStorage.getItem("user") })
            .then(function (response:AxiosResponse) {
                var files = response.data['files']
                console.log(files)
                if (files[0].length < 1 && files[1].length < 1) {
                    setMessage("You haven't uploaded any files yet!")
                    document.getElementById("content")!.style.display = "none";
                }
                if(files[0].length < 1 && files[1].length >= 1){
                    document.getElementById("ready")!.style.display = "none";
                }
                if (files[1].length === 0) {
                    document.getElementById("not_ready")!.style.display = "none";
                }
                for (let index = 0; index < files[0].length; index++) {
                    setListReadyFiles(values => [...values, files[0][index]])
                }
                for (let index = 0; index < files[1].length; index++) {
                    setListNotReadyFiles(values => [...values, files[1][index]])
                }
            })
    }
    //Fonction pour ouvrir le document PDF à partir d'un blob
    function openPDF(index:number) {
        axios.post("http://127.0.0.1:5000/getPDF", { "id": localStorage.getItem("user"), "file": listReadyFiles[index] + ".pdf" }, { responseType: "blob" })
            .then(function (response) {
                if (response.data!.size === 4) {
                    console.log("No documents")
                } else {
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL);
                }
            })
    }
    //Fonction pour ouvrir le document TXT à partir d'un blob
    function openTXT(index:number) {
        axios.post("http://127.0.0.1:5000/getTXT", { "id": localStorage.getItem("user"), "file": listReadyFiles[index] + ".pdf" }, { responseType: "blob" })
            .then(function (response) {
                if (response.data!.size === 4) {
                    console.log("No documents")
                } else {
                    const blob = new Blob([response.data], { type: 'text/plain' });
                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL);
                }
            })
    }
    //Fonction de téléchargement d'un blob.
    function downloadBlob(blob:Blob, name:string) {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = name;
        document.body.appendChild(link);
        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );
        document.body.removeChild(link);
    }
    //Fonction de téléchargement d'un fichier texte.
    function downloadTXT(index:number) {
        axios.post("http://127.0.0.1:5000/getTXT", { "id": localStorage.getItem("user"), "file": listReadyFiles[index] + ".pdf" }, { responseType: "blob" })
            .then(function (response) {
                if (response.data!.size === 4) {
                    console.log("No documents")
                } else {
                    const blob = new Blob([response.data], { type: 'text/plain' });
                    downloadBlob(blob, listReadyFiles[index] + ".txt")
                }
            })
    }
    //Fonction de suppression d'un fichier
    function deleteFile(index:number) {
        if (window.confirm("Do you really want to delete this file?")) {
            axios.post("http://127.0.0.1:5000/delete", { "id": localStorage.getItem("user"), "file": index })
                .then(() => {
                    window.location.reload();
                })
        }
    }
    //Composant retournant une liste de fichier prêt
    const listOfDocs = listReadyFiles.map((d, index) =>
        <li key={index}>
            <div>
                <Tooltip.Provider >
                    <Tooltip.Root delayDuration={0}>
                        <Tooltip.Trigger asChild>
                            <button id='fileName'>
                                {d}
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content className="TooltipContent" sideOffset={5} >
                                <button id='download' onClick={() => { deleteFile(index) }}>Delete</button>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
            </div>
            <button id='download' onClick={openPDF.bind(d, index)}>PDF</button>
            <div>
                <Tooltip.Provider >
                    <Tooltip.Root delayDuration={0}>
                        <Tooltip.Trigger asChild>
                            <button id='download'>
                                TXT
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content className="TooltipContent" sideOffset={5} >
                                <button id='download' onClick={openTXT.bind(d, index)}>View</button>
                                <button id='download' onClick={downloadTXT.bind(d, index)}>Download</button>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
            </div>
        </li>)
    //Composant retournant une liste de fichier pas prêt
    const listOfNotReadyDocs = listNotReadyFiles.map((d,index) =>
        <li key={index}>
            {d}<Spinner></Spinner>
        </li>
    )
    return (
        <div>
            <div id="page">
                <div id='content'>
                    <div id='ready'>
                        <div id='uploadingSection'>
                            <h1>Ready documents</h1>
                            <div id="uploadingDocs">
                                <ul id='listOfFiles'>
                                    {listOfDocs}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div id="not_ready">
                        <div id='uploadingSection'>
                            <h1>Not ready documents</h1>
                            <div id="uploadingDocs">
                                <ul id='listOfFiles'>
                                    {listOfNotReadyDocs}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
                <div id='noFilesMessage'>
                    {message}
                </div>
            </div>
        </div>
    )
}
export default DocsList;