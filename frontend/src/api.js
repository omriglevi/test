
const config = {
    apiUrl: 'http://localhost:3000/auctions',
    options: {
        credentials: "include",
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

export {
    getAuctions
}
