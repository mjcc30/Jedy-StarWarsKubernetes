import React from "react";
import { Link } from "react-router-dom";
import { useFetchHook } from "../../hooks/useFetchHook";
import Spinner from "../spinner/spinner";
import RecordParamList from "../record-param-list/record-param-list";
import InputText from "../input-text/input-text";

const PeopleRecord = ({ history }) => {

    const { data: people, isFetching, error } = useFetchHook('people', history.location.pathname);

    if (isFetching) {
        return <Spinner />
    } else {
        return (
            <div className="card mt-5">
                <div className="card-body">
                    {error ? <div className="alert alert-primary">Erreur lors de la récupération des donneés</div>
                        :
                        <>
                            <h5 className="card-title">Fiche de {people.name}</h5>
                            <p className="card-text">Voici la liste des informations de {people.name}</p>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="name" label="Name" value={people.name} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="height" label="Height" value={people.height} readOnly />
                                    </div>

                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="mass" label="Mass" value={people.mass} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="gender" label="Gender" value={people.gender} readOnly />

                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="hair_color" label="Hair Color" value={people.hair_color} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="skin_color" label="Skin Color" value={people.skin_color} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="eye_color" label="Eye Color" value={people.eye_color} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="birth_year" label="Birth year" value={people.birth_year} readOnly />
                                    </div>
                                </div>

                            </div>
                            <div className="card-footer">
                                <div>
                                    <Link to={people.homeworld.replace('http://swapi.dev/api', '')}>Voir sa planète</Link>
                                </div>
                                <RecordParamList title="Liste de ses films" data={people.films} linkTitle="Film" />
                                <RecordParamList title="Liste de ses véhicules" data={people.vehicles} linkTitle="Véhicule" />
                                <RecordParamList title="Liste de ses vaisseaux" data={people.starships} linkTitle="Vaisseau" />
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}


export default PeopleRecord;