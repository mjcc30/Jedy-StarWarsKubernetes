import React from "react";
import { useFetchHook } from "../../hooks/useFetchHook";
import Spinner from "../spinner/spinner";
import RecordParamList from "../record-param-list/record-param-list";
import InputText from "../input-text/input-text";

const SpecieRecord = ({ history }) => {

    const { data: specie, isFetching, error } = useFetchHook('species', history.location.pathname);

    if (isFetching) {
        return <Spinner />
    } else {
        return (
            <div className="card mt-5">
                <div className="card-body">
                    {error ? <div className="alert alert-primary">Erreur lors de la récupération des donneés</div>
                        :
                        <>
                            <h5 className="card-title">Fiche de {specie.name}</h5>
                            <p className="card-text">Voici la liste des informations de {specie.name}</p>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="name" label="Name" value={specie.name} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="language" label="Language" value={specie.language} readOnly />
                                    </div>

                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="designation" label="Designation" value={specie.designation} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="classification" label="Classification" value={specie.classification} readOnly />
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-lg-2 col-xs-6">
                                        <InputText id="average_height" label="Average Height" value={specie.average_height} readOnly />
                                    </div>
                                    <div className="col-lg-2 col-xs-6">
                                        <InputText id="average_lifespan" label="Average Lifespan" value={specie.average_lifespan} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="hair_colors" label="Hair Colors" value={specie.hair_colors} readOnly />
                                    </div>
                                    <div className="col-lg-5 col-xs-6">
                                        <InputText id="eye_colors" label="Eye Colors" value={specie.eye_colors} readOnly />
                                    </div>
                                </div>

                            </div>
                            <div className="card-footer">
                                <RecordParamList title="Liste de ses films" data={specie.films} linkTitle="Film" />
                                <RecordParamList title="Liste de ses personnages" data={specie.people} linkTitle="Personnage" />
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}


export default SpecieRecord;