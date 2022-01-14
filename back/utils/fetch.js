const fetch = require('node-fetch');

exports.fetchUrls = async urls => {
  try {
    const data = [];
    for(const url of urls) {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      data.push(await response.json())
    }
    return data
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
