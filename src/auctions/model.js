const Mongoose = require("mongoose")

const AuctionSchema = new Mongoose.Schema({
    auctionDate: {
        type: Date,
        required: true,
    },
    caseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    caseType: {
        type: String,
        required: true,
        enum: ['TAXDEED', 'FORECLOSURE']
    },
    openingBid: {
        type: Number,
        required: false,
    },
    parcelID: {
        type: String,
        required: true,
        unique: true,
    },
    certificateNumber: {
        type: String,
        required: false,
    },
    assessedValue: {
        type: Number,
        required: true,
    },
    propertyAppraiserLegalDescription: {
        type: String,
        required: false,
    },
    partyDetails: {
        type: Array,
        of: Map,
        required: false,
    },
    url: {
        type: String,
        required: true,
    },
    bathrooms: {
        type: Number,
        required: false,
    },
    bedrooms: {
        type: Number,
        required: false,
    },
    floors: {
        type: Number,
        required: false,
    },
    municipality: {
        type: String,
        required: false,
    },
    lotSize: {
        type: Number,
        required: false,
    },
    primaryLandUse: {
        type: String,
        required: false,
    },
    livingArea: {
        type: Number,
        required: false,
    },
    yearBuilt: {
        type: Number,
        required: false,
    },
    primaryZone: {
        type: String,
        required: false,
    },
    subdivision: {
        type: String,
        required: false,
    },
    neighborhood: {
        type: String,
        required: false,
    },
    buildingArea: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    units: {
        type: Number,
        required: false,
    },
    address: {
        type: String,
        required: false,
        // set default value ''
        default: ''
    },
    totalValue: {
        type: Number,
        required: false,
    },
    salesInfos: {
        type: Array,
        required: false,
    },
    owners: {
        type: Array,
        required: false,
    },
    taxCollectorDebt: {
        type: Number,
        required: false,
    },
    violations: {
        type: Array,
        required: false,
    },
    qualifiedOwners: {
        type: Array,
        required: false,
    },
    legalDocuments: {
        type: Array,
        required: false,
    },
})

const Auction = Mongoose.model("auction", AuctionSchema)
module.exports = Auction
