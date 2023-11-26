import React from "react";
import axios from "axios";
import "./Upload.css";

//Composant pour upload les documents
class FileUploadPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: "",
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  //Fonction de uplaod l'image vers le serveur
  handleUploadImage(ev) {
    ev.preventDefault();
    //Variable ou sauvegarder l'image
    const data = new FormData();

    if (this.uploadInput.files[0] === undefined) {
      alert("No file selected");
    } else {
      data.append("file", this.uploadInput.files[0]);
      axios
        .post("http://127.0.0.1:5000/upload", data)
        .then(function (response) {
          console.log(response.data);
        });
    }
  }
  render() {
    console.log(localStorage.getItem("user"));
    return (
      <form id="uploadForm" onSubmit={this.handleUploadImage}>
        <div id="section1">
          <input
            id="fileInput"
            ref={(ref) => {
              this.uploadInput = ref;
            }}
            type="file"
          />
        </div>
        <br />
        <div>
          <button id="submitButton">Upload</button>
        </div>
      </form>
    );
  }
}

export default FileUploadPage;
