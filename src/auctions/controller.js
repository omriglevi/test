const Auction = require('../models/auction')

/** @typedef { import('../models/auction') } Auction */
const LIMIT = 50;

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
const list = async ({ cursor, filter ,limit = LIMIT }) => {
    let query = {};

    if (filter) {
      query = { ...filter };
    }

    // If a cursor is provided, add it to the query
    if (cursor) {
      query._id = query._id ? {...query._id, $gt: cursor } : { $gt: cursor };
    }

    const queryLimit = Number(limit) || LIMIT;
    const auctions = await Auction
        .find(query)
        .limit(queryLimit)
        .exec();

    // Extract the next and previous cursor from the result
    // const prevCursor = cursor && auctions.length > 0 ? auctions[0]._id : null;
    let nextCursor = auctions.length > 0 ? auctions[auctions.length - 1]._id : null;

    if (auctions?.length < queryLimit){
        nextCursor = null
    }

    return {
      nextCursor,
      totalResults: auctions.length,
      auctions,
      filter,
      limit,
    }
}


const update = async (id, changes) => {
    try {
        const auction = await Auction.findByIdAndUpdate(id, changes)
        return auction
}
    catch (error) {
        console.log('Error on updating auction', error)
        throw error
    }
}


module.exports = { insertBulk, insert, list, update }
