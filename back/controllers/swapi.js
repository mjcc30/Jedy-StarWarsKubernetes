const swapi = require('../utils/swapi');
const { fetchUrls, getRequest } = require("../utils/fetch");


exports.getSwapiSearch = (req, res, next) => {
    const research = req.query.search;
    fetchUrls(swapi.SwapiUrls(research))
        .then(response => {
            const data = [];
            const results = [];
            data['films'] = response[0];
            data['people'] = response[1];
            data['planets'] = response[2];
            data['species'] = response[3];
            data['starships'] = response[4];
            data['vehicles'] = response[5];
            for (const [key, value] of Object.entries(data)) {
                if (value['count'] > 0) {
                    results.push({
                        type: key,
                        values: value['results']
                    })
                }
            }
            return res.status(200).json(results);
        })
        .catch(err => res.status(400).send(err));
};

exports.getSwappiById = (req, res, url) => {
    const id = req.params.id;
    return getRequest(`${process.env.API_ENTRYPOINT}/${url}/${id}`, req, res)
}
