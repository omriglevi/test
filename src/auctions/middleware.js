const { getAuctions } = require('./controller')

const getAuctionsWithFilter = async (req, res, next) => {
    try {
        let { filter, cursor, limit } = req.query

        if (filter) {
            try {
            filter = JSON.parse(filter)
            } catch (error) {
                console.log('Error while parsing the filter', error);
                filter = {}
            }
        }

        const data = await getAuctions({ filter,cursor, limit })
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

module.exports = { getAuctionsWithFilter }
