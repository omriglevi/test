// insrty data.json  06/06/2024
const { connectDB } = require('../src/db')
const data = require('./data.json')['06/06/2024'].map((auction) => ({...auction, auctionDate: '06/06/2024'}))
const { insertBulk, insert } = require('../src/auctions/controller')

const numberFields = [
    'openingBid',
    'assessedValue',
    'totalValue',
    'taxCollectorDebt',
    'bathrooms',
    'bedrooms',
    'floors',
    'lotSize',
    'livingArea',
    'yearBuilt',
]

const namesMap = {
    ['caseNumber(Count)']: 'caseNumber',
    // ['siteAddress']: 'address',
}

/** @type { (data: object) => object} */
const normalizeData = (data) => {
    const dataAfterRenamingFields = data.map((auction) => {
        Object.keys(namesMap).forEach((oldName) => {
            if (auction[oldName]) {
                auction[namesMap[oldName]] = auction[oldName]
                delete auction[oldName]
            }
        })
        return auction
    })

    const normalizedData = dataAfterRenamingFields.map((auction) => {
        numberFields.forEach((field) => {
            let fieldVal
            if (auction[field] && typeof auction[field] === 'string') {
                fieldVal = auction[field].replace(/[$,]/g, '')
                const value = parseFloat(fieldVal)
                // if (!isNaN(value)) {
                //     auction[field] = value
                // }
                auction[field] = !isNaN(value) ? value : null


            }
        })
        return auction
    })
    return normalizedData
}
const normalizedData = normalizeData(data)
connectDB().then(()=> {
    return Promise.all(normalizedData.map(a => insert(a).catch(console.error)))
})
// console.log(normalizedData);
// connectDB().then(insertBulk(normalizedData).catch(console.error))
// console.log(normalizeData(data));
