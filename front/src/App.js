import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ErrorBoundary from "./components/error-boundary/error-boundary";
import { selectCurrentUser } from './redux/user/user.selectors';
import NavbarComponent from "./components/navbar/navbar";
import SigninPage from "./pages/signin/signin";
import SignupPage from "./pages/signup/signup";
import Autocomplete from "./components/autocomplete/autocomplete";
import { checkUserSession } from './redux/user/user.actions';
import FilmRecord from "./components/swappi-record/film-record";
import PeopleRecord from "./components/swappi-record/people-record";
import PlanetRecord from "./components/swappi-record/planet-record";
import SpecieRecord from "./components/swappi-record/specie-record";
import StarshipRecord from "./components/swappi-record/starship-record";
import VehicleRecord from "./components/swappi-record/vehicle-record";

const App = () => {

  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  return (
    <>
      {currentUser && <NavbarComponent />}

      <Switch>
        <ErrorBoundary>

          <Route render={() => !currentUser && <Redirect to='/signin' />} />

          <div className="container">
            {currentUser && <Autocomplete />}
            <Route exact path="/films/:id" component={FilmRecord} />
            <Route exact path="/planets/:id" component={PlanetRecord} />
            <Route exact path="/people/:id" component={PeopleRecord} />
            <Route exact path="/species/:id" component={SpecieRecord} />
            <Route exact path="/starships/:id" component={StarshipRecord} />
            <Route exact path="/vehicles/:id" component={VehicleRecord} />
          </div>

          <Route exact path="/signup" render={() => {
            if (currentUser) {
              return (<Redirect to='/' />)
            } else {
              return (<SignupPage />)
            }
          }} />
          <Route exact path="/signin" render={() => {
            if (currentUser) {
              return (<Redirect to='/' />)
            } else {
              return (<SigninPage />)
            }
          }} />
        </ErrorBoundary>
      </Switch>
    </>
  );
}

export default App;
