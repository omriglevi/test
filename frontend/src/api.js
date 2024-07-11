
const config = {
    apiUrl: process.env?.NODE_ENV === 'development'
        ? process.env.REACT_APP_API_URL_DEV
        : process.env.REACT_APP_API_URL_PROD,
    options: {
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
      },

}

const getAuctions = async ({ cursor, filter } ) => {
    const url = new URL(config.apiUrl + '/auctions')
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
    const url = `${config.apiUrl}/auctions/${id}`
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
