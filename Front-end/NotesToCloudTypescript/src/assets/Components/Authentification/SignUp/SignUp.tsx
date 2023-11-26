import axios from "axios";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import "./SignUp.css";

//Composant de la page de création de compte
export default function SignUpPage() {
  //État dictionnaire qui représente l'utilisateur
  const [user, setUser] = useState({
    type: "manual",
    firstName: "Test",
    lastName: "Son of Test",
    UUID: uuidv4(),
    
  });
  //Constante navigate qui nous permet de passer d'une page à une autre.
  var navigate = useNavigate();
  //Fonction de reaction au changement dans les inputs.
  //Fondamentalement obtenir la valeur des champs et l'enregistrer dans l'état utilisateur.
  const handleChange = (event: any) => {
    const name = event.target.id;
    const value = event.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };
  //Fonction de gestion du bouton de création de compte.
  const handleSubmit = (event: any) => {
    event.preventDefault();
    //Requête Axios vers le serveur pour créer l'utilisateur.
    axios
      .post("http://127.0.0.1:5000/signin", { user: user })
      .then(function (response) {
        console.log(response.data);
        if (response.status === 201) {
          console.log(response.data);
          alert(
            "A user with the same email already exists. Please use a different email to sign up."
          );
        }
        if (response.status === 404) {
          alert(
            "Sorry, but we can't create your account right. Please try again later. Thank you for your understanding"
          );
        }
        if (response.status === 200) {
          alert("Account created successfully.");
          navigate("/login");
        }
        //if (response.data['status'] === 'existing') {
        //    alert("A user with the same email already exists. Please use a different email to sign up.")
        //}
        //if (response.data['status'] === 'failure') {
        //    alert("Sorry, but we can't create your account right. Please try again later. Thank you for your understanding")
        //}
      });
  };
  return (
    <div id="signupPage">
      <Link to="/" id="homeBtnContainer">
        <BsArrowLeftCircle id="homeButton"></BsArrowLeftCircle>
      </Link>
      <div id="signup">
        <h1>Create Account</h1>
        <form id="signupForm" onSubmit={handleSubmit}>
          <div id="formElement">
            <label>First Name</label>
            <input
              id="firstName"
              type="text"
              onChange={handleChange}
              maxLength={15}
              required
              defaultValue={"Test"}
            />
          </div>
          <div id="formElement">
            <label>Last Name</label>
            <input
              id="lastName"
              type="text"
              onChange={handleChange}
              maxLength={15}
              required
              defaultValue={"Son of Test"}
            />
          </div>
          <div id="formElement">
            <label>Email</label>
            <input
              id="email"
              type="email"
              onChange={handleChange}
              required
              defaultValue={"test@yahoo.fr"}
            />
          </div>
          <div id="formElement">
            <label>Birth Day</label>
            <input
              id="age"
              type="date"
              onChange={handleChange}
              maxLength={15}
              required
            />
          </div>
          <div id="formElement">
            <label>Address Number</label>
            <input
              id="addNum"
              type="text"
              onChange={handleChange}
              maxLength={15}
              required
              defaultValue={"77"}
            />
          </div>
          <div id="formElement">
            <label>Address Name</label>
            <input
              id="addName"
              type="text"
              onChange={handleChange}
              maxLength={15}
              required
              defaultValue={"Test st."}
            />
          </div>
          <div id="formElement">
            <label>Address ZIP</label>
            <input
              id="addZIP"
              type="text"
              onChange={handleChange}
              maxLength={15}
              required
              defaultValue={"T1E2S4T"}
            />
          </div>
          <div id="formElement">
            <label>Phone Number</label>
            <input
              id="phoneNum"
              type="tel"
              onChange={handleChange}
              required
              defaultValue={"111-111-1111"}
            />
          </div>
          <div id="formElement">
            <label>Sex</label>
            <select id="sex" onChange={handleChange}>
              <option>Choose option</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div id="formElement">
            <label>Password</label>
            <input
              id="password"
              type="password"
              onChange={handleChange}
              maxLength={15}
              required
              defaultValue={"test"}
            />
          </div>

          <input id="formSumbit" type="submit" value="Sign up" />
        </form>
      </div>
    </div>
  );
}
