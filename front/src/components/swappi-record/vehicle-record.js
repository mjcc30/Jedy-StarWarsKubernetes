import React from "react";
import { useFetchHook } from "../../hooks/useFetchHook";
import Spinner from "../spinner/spinner";
import RecordParamList from "../record-param-list/record-param-list";
import InputText from "../input-text/input-text";

const VehicleRecord = ({ history }) => {

    const { data: vehicle, isFetching, error } = useFetchHook('vehicles', history.location.pathname);

    if (isFetching) {
        return <Spinner />
    } else {
        return (
            <div className="card mt-5">
                <div className="card-body">
                    {error ? <div className="alert alert-primary">Erreur lors de la récupération des donneés</div>
                        :
                        <>
                            <h5 className="card-title">Fiche de {vehicle.name}</h5>
                            <p className="card-text">Voici la liste des informations de {vehicle.name}</p>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="name" label="Name" value={vehicle.name} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="passengers" label="Passengers" value={vehicle.passengers} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="max_atmosphering_speed" label="Max Atmosphering Speed" value={vehicle.max_atmosphering_speed} readOnly />
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="model" label="Model" value={vehicle.model} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="vehicle_class" label="Vehicle Class" value={vehicle.vehicle_class} readOnly />
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="cargo_capacity" label="Cargo Capacity" value={vehicle.cargo_capacity} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="consumables" label="Consumables" value={vehicle.consumables} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="length" label="Length" value={vehicle.length} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="crew" label="Crew" value={vehicle.crew} readOnly />
                                    </div>
                                </div>

                            </div>
                            <div className="card-footer">
                                <RecordParamList title="Liste de ses films" data={vehicle.films} linkTitle="Film" />
                                <RecordParamList title="Liste de ses Pilote" data={vehicle.pilots} linkTitle="Pilote" />
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}


export default VehicleRecord;