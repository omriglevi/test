const Mongoose = require("mongoose")
const User = require('../models/user')

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
        required: true,
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
    liked: {
        type: [Mongoose.Schema.Types.ObjectId],
        ref: User,
        required: false,
        default: []
    },
    light: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    ddMarketValueAssessment: {
        type: Number,
        required: false,
    },
    dDTitle: {
        type: String,
        required: false,
    },
    dDZoning: {
        type: String,
        required: false,
    },
    dDPropertyAppraiser: {
        type: String,
        required: false,
    },
    dDLienAssessment: {
        type: String,
        required: false,
    },
    dDCodeEnforcment: {
        type: String,
        required: false,
    },
    dDCorporateOfDivisions: {
        type: String,
        required: false,
    },
    keyword: {
        type: String,
        required: false,
    },
    asIsValue: {
        type: Number,
        required: false,
    },
    arv: {
        type: Number,
        required: false,
    },
    brr70Percent: {
        type: Number,
        required: false,
    },
    sixtyPercentageCurrentValue: {
        type: Number,
        required: false,
    },
    rehabCosts: {
        type: Number,
        required: false,
    },
    maxBid: {
        type: Number,
        required: false,
    },
    maxBidBasedOnAsIsValue: {
        type: Number,
        required: false,
    },
    profitAsPercentage: {
        type: Number,
        required: false,
    },
    lienType: {
        type: String,
        required: false,
    },
    liens: {
        type: Array,
        required: false,
    },
    totalLiens: {
        type: Number,
        required: false,
    },
    strategy: {
        type: String,
        required: false,
    },
    strategy2: {
        type: String,
        required: false,
    },
    owner: {
        type: String,
        required: false,
    },
    ownerContact: {
        type: String,
        required: false,
    },
    noted: {
        type: String,
        required: false,
    },
})

const Auction = Mongoose.model("auction", AuctionSchema)
module.exports = Auction
