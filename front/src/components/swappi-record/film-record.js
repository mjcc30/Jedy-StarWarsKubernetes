import React from "react";
import { useFetchHook } from "../../hooks/useFetchHook";
import Spinner from "../spinner/spinner";
import RecordParamList from "../record-param-list/record-param-list";
import InputText from "../input-text/input-text";

const FilmRecord = ({ history }) => {

    const { data: film, isFetching, error } = useFetchHook('films', history.location.pathname);

    if (isFetching) {
        return <Spinner />
    } else {
        return (
            <div className="card mt-5">
                <div className="card-body">
                    {error ? <div className="alert alert-primary">Erreur lors de la récupération des donneés</div>
                        :
                        <>
                            <h5 className="card-title">Fiche de {film.title}</h5>
                            <p className="card-text">Voici la liste des informations de {film.title}</p>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="title" label="Title" value={film.title} readOnly />
                                    </div>
                                    <div className="col-lg-3">
                                        <InputText id="producer" label="Producer" value={film.producer} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="director" label="Director" value={film.director} readOnly />
                                    </div>
                                    <div className="col-lg-3 col-xs-6">
                                        <InputText id="release_date" label="Release Date" value={film.release_date} readOnly />
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-lg-3 col-xs-6">
                                        <div className="form-group">
                                            <InputText id="episode_id" label="Episode id" value={film.episode_id} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-lg-9 col-xs-12">
                                        <div className="form-group">
                                            <label htmlFor="opening_crawl">opening_crawl</label>
                                            <textarea id="opening_crawl" className="form-control" readOnly value={film.opening_crawl} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="card-footer">
                                <RecordParamList title="Liste de ses planètes" data={film.planets} linkTitle="Planète" />
                                <RecordParamList title="Liste de ses espèces" data={film.species} linkTitle="Espèce" />
                                <RecordParamList title="Liste de ses vaisseaux" data={film.starships} linkTitle="Vaisseau" />
                                <RecordParamList title="Liste de ses véhicules" data={film.vehicles} linkTitle="Véhicule" />
                                <RecordParamList title="Liste de ses personnages" data={film.characters} linkTitle="Personnage" />
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}


export default FilmRecord;