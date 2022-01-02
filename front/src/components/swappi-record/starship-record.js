import React from "react";
import { useFetchHook } from "../../hooks/useFetchHook";
import Spinner from "../spinner/spinner";
import RecordParamList from "../record-param-list/record-param-list";
import InputText from "../input-text/input-text";

const StarshipRecord = ({ history }) => {

    const { data: starship, isFetching, error } = useFetchHook('starships', history.location.pathname);

    if (isFetching) {
        return <Spinner />
    } else {
        return (
            <div className="card mt-5">
                <div className="card-body">
                    {error ? <div className="alert alert-primary">Erreur lors de la récupération des donneés</div>
                        :
                        <>
                            <h5 className="card-title">Fiche de {starship.name}</h5>
                            <p className="card-text">Voici la liste des informations de {starship.name}</p>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-6 col-xs-6">
                                        <InputText id="name" label="Name" value={starship.name} readOnly />
                                    </div>
                                    <div className="col-lg-6 col-xs-6">
                                        <InputText id="model" label="Model" value={starship.model} readOnly />
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-lg-6 col-xs-6">
                                        <InputText id="manufacturer" label="Manufacturer" value={starship.manufacturer} readOnly />
                                    </div>
                                    <div className="col-lg-6 col-xs-6">
                                        <InputText id="starship_class" label="Starship Class" value={starship.starship_class} readOnly />
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="crew" label="Crew" value={starship.crew} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="hyperdrive_rating" label="Hyperdrive Rating" value={starship.hyperdrive_rating} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="cost_in_credits" label="Cost In Credits" value={starship.cost_in_credits} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="passengers" label="Passengers" value={starship.passengers} readOnly />
                                    </div>
                                </div>

                            </div>
                            <div className="card-footer">
                                <RecordParamList title="Liste de ses films" data={starship.films} linkTitle="Film" />
                                <RecordParamList title="Liste de ses pilotes" data={starship.pilots} linkTitle="Pilote" />
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}


export default StarshipRecord;