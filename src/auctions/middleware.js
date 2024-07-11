const { list, update } = require('./controller')

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

        const data = await list({ filter,cursor, limit })
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

const updateAuction = async (req, res, next) => {
    try {
        const { id } = req.params
        const changes  = req.body

        if (!id) {
            throw new Error('Missing id')
        }
        if (!changes || Object.keys(changes).length === 0) {
            throw new Error('Missing changes')
        }

        const updated = await update(id, changes)
        res.status(200).json(updated)
    } catch (error) {
        next(error)
    }

}

module.exports = { getAuctionsWithFilter, updateAuction }
