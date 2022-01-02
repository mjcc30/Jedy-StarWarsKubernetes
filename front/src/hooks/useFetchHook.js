import { useEffect, useState } from "react";
import { getRequest } from "../utils/fetch";

export const useFetchHook = (url, pathname) => {

    const [data, setData] = useState({});
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(null);

    const id = pathname.split('/')[2];

    useEffect(() => {
        getRequest(`${process.env.REACT_APP_API_ENTRYPOINT}/swapi/${url}/${id}`)
            .then(response => response.json())
            .then(data => setData(data))
            .catch(err => setError(err))
            .finally(() => setIsFetching(false))
        // eslint-disable-next-line
    }, [id]);

    return {
        data,
        isFetching,
        error
    }
}
