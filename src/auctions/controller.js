const Auction = require('../models/auction')

/** @typedef { import('../models/auction') } Auction */
const LIMIT = 10;

const insertBulk = async (auctions) => {
    try {
        await Auction.insertMany(auctions)
    } catch (error) {
        console.log('Error on inserting multiple auctions', error)
        throw new Error(error)
    }
}

const insert = async (auction) => {
    try {
        await Auction.create(auction)
    } catch (error) {
        console.log('Error on inserting auction', error)
        throw new Error(error)
    }
}

const findByName = async (name) => {
    try {
        return await Auction
            .find({ name })
            .exec()

    } catch (error) {
        console.log('Error on finding auction by name', error)
        throw error
    }
}

const findById = async (id) => {
    try {
        return await Auction
            .findById(id)
            .exec()
    } catch (error) {
        console.log('Error on finding auction by id', error)
        throw error
    }
}


/** @typedef { { cursor: string, limit: number, filter: object } } GetAuctionsParams */

/**
 * @typedef { object } GetAuctionsResults
 * @prop { string | null } nextCursor
 * @prop { string | null } prevCursor
 * @prop { number } totalResults
 * @prop { Auction[] } auctions
 * @prop { object } filter
 * @prop { number } limit
 */

/**
 * @param { GetAuctionsParams } params
 * @returns { Promise<GetAuctionsResults>
 */
const getAuctions = async ({ cursor, filter ,limit = LIMIT }) => {
    let query = {};

    if (filter) {
      query = { ...filter };
    }

    // If a cursor is provided, add it to the query
    if (cursor) {
      query._id = query._id ? {...query._id, $gt: cursor } : { $gt: cursor };
    }

    const auctions = await Auction
        .find(query)
        .limit(Number(limit) || LIMIT)
        .exec();

    // Extract the next and previous cursor from the result
    const prevCursor = cursor && auctions.length > 0 ? auctions[0]._id : null;
    const nextCursor = auctions.length > 0 ? auctions[auctions.length - 1]._id : null;

    // Return the paginated data
    return {
      nextCursor,
      prevCursor,
      totalResults: auctions.length,
      auctions,
      filter,
      limit,
    }
}




module.exports = { insertBulk, insert, getAuctions }
