import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./Upload.css";

function FileUploadPage() {
  const [cookies, setCookie] = useCookies(["user"]);
  const [file, setFile] = useState<File | undefined>();
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (typeof file === "undefined") return;
    const data = new FormData();
    data.append("file", file,cookies['user']);
    axios.post("http://127.0.0.1:5000/upload", data).then(function (response) {
      console.log(response.data);
    });
  }
  async function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    setFile(target.files[0]);
  }

  return (
    <div>
      <form id="uploadForm" onSubmit={handleSubmit}>
        <div id="section1">
          <input type="file" name="image" onChange={handleOnChange}></input>
        </div>
        <br />
        <div>
          <button id="submitButton">Upload</button>
        </div>
      </form>
    </div>
  );
}

export default FileUploadPage;
