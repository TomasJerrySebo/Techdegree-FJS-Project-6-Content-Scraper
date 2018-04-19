const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// using the required csv writer npm ext to write to the specified csv file in the data folder. First setting the file headers by creating their values in proper format , and then populating the csv file with the received data and writting the success message. If there was an error writing it to the console as well.
const CsvWriterInit = (path,data)=> {
    let headerValues = [];

    for (let k in data[0]) {
        let temObj = {};
        temObj.id = k; temObj.title = k;
        headerValues.push(temObj);
    }
    const csvWriter = createCsvWriter({
        path: path,
        header: headerValues
    });

    csvWriter.writeRecords(data)       // returns a promise
        .then(() => {
        console.log('Success, CSV file written!');
}).catch(function(e){
        console.log(`${e.code} - There was an error writing to the specified CSV file`);
    });
}



module.exports.CsvWriterInit = CsvWriterInit;
