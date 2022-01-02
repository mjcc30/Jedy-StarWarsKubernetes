import React from "react";
import {Link} from "react-router-dom";
import {useDispatch} from 'react-redux';
import {logout} from "../../redux/user/user.actions";

const Navbar = () => {

  const dispatch = useDispatch();

  const handleClick = () => {
    localStorage.removeItem('star-wars-user');
    dispatch(logout());
  };

  return (
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Rebels Alliance</Link>
          <form className="d-flex">
            <button className="btn btn-outline-success" type="button" onClick={handleClick}>Déconnexion</button>
          </form>
        </div>
      </nav>
  );
}

export default Navbar;
