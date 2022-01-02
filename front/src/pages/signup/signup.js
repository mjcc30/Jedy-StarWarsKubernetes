import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Link} from "react-router-dom";
import "./signup.css";
import {signUpStartAsync} from "../../redux/user/user.actions";
import { selectIsLoginFetching, selectLoginError } from "../../redux/user/user.selectors";
import Spinner from "../../components/spinner/spinner";
import Error from "../../components/error/error";

const SignupPage = () => {

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
    dispatch(signUpStartAsync(userData));
  }

  return (
      <div className="d-flex-center-both">
        {isLoading && <Spinner />}
        <form className="form-signin" onSubmit={handleSubmit}>
          <h1 className="h2 mb-5 text-center font-weight-normal">Page d'inscription</h1>
          {error && <Error error={error} />}
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input type="email" id="email" name="email" onChange={handleChange} className="form-control" placeholder="Email"
                 required autoFocus autoComplete="off" />

          <label htmlFor="password" className="sr-only">
            Mot de passe
          </label>
          <input type="password" onChange={handleChange} name="password" id="password" className="form-control" placeholder="Mot de passe"
                 required="" autoComplete="off" />

          <span>Vous avez déja un compte ? <Link to="signin">Connexion</Link></span>
          <button className="btn btn-lg btn-primary btn-block mt-5" type="submit">
            Inscription
          </button>
        </form>
      </div>
  );
}


export default SignupPage;
