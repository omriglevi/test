
const config = {
    apiUrl: 'http://3.80.89.208:3000/auctions',
    options: {
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
      },

}

const getAuctions = async ({ cursor, filter } ) => {
    const url = new URL(config.apiUrl)
    const options = config.options

    if (cursor && typeof cursor === 'string') {
        cursor = encodeURIComponent(cursor)
        url.searchParams.append('cursor', cursor)

    }

    if (filter && typeof filter === 'object') {
        // add filters to the url
        url.searchParams.append('filter', JSON.stringify(filter))
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
