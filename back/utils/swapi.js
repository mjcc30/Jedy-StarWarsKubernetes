exports.SwapiUrls = research => {
    return [
        `${process.env.API_ENTRYPOINT}/films?search=${research}`,
        `${process.env.API_ENTRYPOINT}/people?search=${research}`,
        `${process.env.API_ENTRYPOINT}/planets?search=${research}`,
        `${process.env.API_ENTRYPOINT}/species?search=${research}`,
        `${process.env.API_ENTRYPOINT}/starships?search=${research}`,
        `${process.env.API_ENTRYPOINT}/vehicles?search=${research}`
    ];
}
