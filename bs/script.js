// insrty data.json  06/06/2024

const fs = require('fs')
const { connectDB } = require('../src/db')
const { insertBulk, insert } = require('../src/auctions/controller')
const Auction = require('../src/models/auction')

const numberFields = [
    'openingBid',
    'assessedValue',
    'totalValue',
    'finalJudgmentAmount',
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
    ['siteAddress']: 'address',
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
                auction[field] = !isNaN(value) ? value : null
            }
        })
        return auction
    })
    return normalizedData
}


// get all file names from data folder
const main = async () => {
    const dataDir = __dirname + '/data/'
    const files = fs.readdirSync(dataDir)
    console.log(files)
    const errors = {}

    for (const file of files) {
        const data = require('./data/' + file)
        // from file name get the auction date by removeing step5_output and .json then replace all appearances of _ with /
        const auctionDate = file.replace('step5_output', '').replace('.json', '').replace(/_/g, '/')
        console.log(auctionDate);
        const normalizedData = normalizeData(data).map((auction) => ({ ...auction, auctionDate }))
        console.log('Inserting data for', normalizedData[0].auctionDate);

        // remove duplicates, with same date same parcelID and same caseNumber
        // const uniqueData = normalizedData.filter((auction, index, self) =>
        //     index === self.findIndex((t) => (
        //         t.auctionDate === auction.auctionDate && auction.parcelID && t.parcelID === auction.parcelID && t.caseNumber === auction.caseNumber
        //     ))
        // )

        // // log ids
        // const ids = uniqueData.map((auction) => auction.parcelID)
        // console.log('Unique IDs', ids);

        // await insertBulk(uniqueData).catch(console.error)
        await insertBulk(normalizedData).catch(console.error)




    }
    console.log('All files inserted', errors);
}

connectDB().then(() =>
    main().catch(console.error)
).catch(console.error)


// const removeNotesFromEachAuction = async () => {
//     // connect to db
//     await connectDB()
//     // get all auctions
//     const auctions = await Auction.find()
//     console.log('Auctions', auctions.length);
//     // each auction who has legalDocuments field, from each array in the field remove the notes field
//     for (const auction of auctions) {
//         console.log('Auction', auction.caseNumber);
//         if (auction?.legalDocuments) {
//             auction.legalDocuments = auction.legalDocuments.map((arrays) => {
//                 return arrays.map((doc) => {
//                     delete doc.notes
//                     return doc
//                 })
//             })
//             try {
//                 await auction.save()
//             } catch (error) {
//                 console.error(error)
//             }

//         }
//     }
// }

// removeNotesFromEachAuction().catch(console.error)
