const fetch = require('node-fetch');

exports.fetchUrls = async urls => {
    try {
        const data = await Promise.all(
            urls.map(url => {
                return fetch(url).then(response => response.json())
            })
        );
        return (data)
    } catch (error) {
        throw (error)

    }
}

exports.getRequest = (url, req, res) => {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => res.sendStatus(400))
}