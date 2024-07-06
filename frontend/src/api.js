
const config = {
    apiUrl: 'http://localhost:3000/auctions',
    options: {
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
      },

}

const getAuctions = async (cursor) => {
    const url = new URL(config.apiUrl)
    const options = config.options

    if (cursor && typeof cursor === 'string') {
        cursor = encodeURIComponent(cursor)
        url.searchParams.append('cursor', cursor)

    }
    return fetch(url, options)
        .then(response => response.json())
}

const updateAuction = async (id, changes) => {
    console.log('Updating auction with id ===>', id, ' with changes ===>', changes);
    const url = `${config.apiUrl}/${id}`
    console.log('Hitting url ===>', url);
    const options = config?.options


    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(changes),
        ...options,
    })
        .then(response => response.json())
}

export {
    getAuctions,
    updateAuction,
}
