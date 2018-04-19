// setting global constatnts, requiring necessary node modules
const fs = require('fs');
const scrapeIt = require("scrape-it")
const baseUrl = 'http://shirts4mike.com/';
const dataDir = './data';
const csv = require("./csvWriter.js");
// generating new filename and path
const filepath = dataDir+'/'+new Date().toISOString().split('T')[0].toString()+'.csv';
// helper params
let csvInitCounter = 0;
let dataObj = [];

// Create data folder if it doesn't exist
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

// scrapping all the detail pages based on the dynamically generated urls and fetching all the necessary data. Then once the data fetching is complete from each iteration the data and the and the filepath is sent to the CSV writer Init function.
const scrapDetailPage = (url,initTrigger) => {
    scrapeIt(`${baseUrl}${url}`, {
        title: {
        selector: ".shirt-details h1",
        texteq: 0
        },
        price: "span.price",
        ImageURL: {
            selector: ".shirt-picture>span>img", attr: "src"
        }
    }).then(({ data, response }) => {
        csvInitCounter++;
        data.ImageURL = baseUrl + data.ImageURL;
        data.URL = baseUrl+url;
        data.time = new Date().toISOString().replace('T',' ').split('.')[0];
        dataObj.push(data);
    if(csvInitCounter == initTrigger) { csv.CsvWriterInit(filepath,dataObj); }

})
}

// scraping the entry point url and fetching all the shirt urls, then looping through all the urls and for each url calling the scrapDetailPage function. Also handling error message with the catch function.
scrapeIt(baseUrl+"shirts.php",{pages: {
        listItem: "ul.products li"
        , name: "pages"
        , data: {
            url: {
                selector: "a"
                , attr: "href"
            }
        }
    }}).then(({ data, response }) => {
        if(data.pages.length == 0) {
        console.log("Couldn't scrape anything from the specified web page");
        } else {
        data.pages.forEach(val=>scrapDetailPage(val.url,parseInt(data.pages.length)));
        }

}).catch(function(e){
    console.log(`${e.code} - The specified web page to scrape is down`);
});






