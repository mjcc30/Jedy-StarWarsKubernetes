import React from "react";
import { Link } from "react-router-dom";

const RecordParamList = ({ title, data, linkTitle }) => {

    return (
        <div className="mt-4">
            <p>{title}</p>
            {data.length > 0 ?
                <div className="d-flex-column">
                    {data.map((value, index) => {
                        return <Link to={value.replace('https://swapi.dev/api', '')} key={index}>{`${linkTitle} ${index + 1}`}</Link>
                    })}
                </div>
                :
                <p>Aucune entrée</p>
            }

        </div>
    )

}

export default RecordParamList;