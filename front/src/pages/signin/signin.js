import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./signin.css";
import { signInStartAsync } from "../../redux/user/user.actions";
import { selectIsLoginFetching, selectLoginError } from "../../redux/user/user.selectors";
import Spinner from "../../components/spinner/spinner";
import Error from "../../components/error/error";

const LoginPage = () => {

  const [userData, setUserData] = useState({
    email: "",
    password: ""
  });

  const dispatch = useDispatch();
  const error = useSelector(selectLoginError);
  const isLoading = useSelector(selectIsLoginFetching);

  const handleChange = event => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  }

  const handleSubmit = event => {
    event.preventDefault();
    dispatch(signInStartAsync(userData));
  }

  return (
    <div className="d-flex-center-both">
      {isLoading && <Spinner />}
      <form className="form-signin" onSubmit={handleSubmit}>
        <h1 className="h2 mb-5 text-center font-weight-normal">Page de connexion</h1>
        {error && <Error error={error} />}
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input type="email" id="email" name="email" onChange={handleChange} className="form-control" placeholder="Ton email"
          required autoFocus />

        <label htmlFor="password" className="sr-only">
          Mot de passe
        </label>
        <input type="password" onChange={handleChange} name="password" id="password" className="form-control" placeholder="Ton mot de passe"
          required="" />

        <span>Vous n'avez pas de compte ? <Link to="signup">Inscription</Link></span>
        <button className="btn btn-lg btn-primary btn-block mt-5" type="submit">
          Connexion
        </button>
      </form>
    </div>
  );
}


export default LoginPage;
