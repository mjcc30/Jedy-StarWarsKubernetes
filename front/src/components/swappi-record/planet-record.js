import React from "react";
import { useFetchHook } from "../../hooks/useFetchHook";
import Spinner from "../spinner/spinner";
import RecordParamList from "../record-param-list/record-param-list";
import InputText from "../input-text/input-text";

const PlanetRecord = ({ history }) => {

    const { data: planet, isFetching, error } = useFetchHook('planets', history.location.pathname);

    if (isFetching) {
        return <Spinner />
    } else {
        return (
            <div className="card mt-5">
                <div className="card-body">
                    {error ? <div className="alert alert-primary">Erreur lors de la récupération des données</div>
                        :
                        <>
                            <h5 className="card-title">Fiche de {planet.name}</h5>
                            <p className="card-text">Voici la liste des informations de {planet.name}</p>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="name" label="Name" value={planet.name} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="Climate" label="Climate" value={planet.climate} readOnly />
                                    </div>

                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="Gravity" label="Gravity" value={planet.gravity} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="diametre" label="Diameter" value={planet.diametre} readOnly />
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="orbital_period" label="Orbital Period" value={planet.orbital_period} readOnly />
                                    </div>
                                    <div className="col-lg-2 col-xs-6">
                                        <InputText id="population" label="Population" value={planet.population} readOnly />
                                    </div>
                                    <div className="col-lg-2 col-xs-6">
                                        <InputText id="surface_water" label="Surface Water" value={planet.surface_water} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="terrain" label="Terrain" value={planet.terrain} readOnly />
                                    </div>
                                    <div className="col-lg-2 col-xs-6">
                                        <InputText id="rotation_period" label="Rotation Period" value={planet.rotation_period} readOnly />
                                    </div>
                                </div>

                            </div>
                            <div className="card-footer">
                                <RecordParamList title="Liste de ses films" data={planet.films} linkTitle="Film" />
                                <RecordParamList title="Liste de ses résidents" data={planet.residents} linkTitle="Résidents" />
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}


export default PlanetRecord;