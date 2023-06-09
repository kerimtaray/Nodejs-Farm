const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
///////////////////////////////
// FILES

// //Blocking, synchronous way
// const textIn = fs.readFileSync("complete-node-bootcamp-master/1-node-farm/starter/txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync("complete-node-bootcamp-master/1-node-farm/starter/txt/output", textOut);
// console.log("File has been written.");

// //Non-blocking, async way
// fs.readFile("complete-node-bootcamp-master/1-node-farm/starter/txt/start.txt", "utf-8", (err, data1) => {
//     fs.readFile(`complete-node-bootcamp-master/1-node-farm/starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
//         fs.readFile(`complete-node-bootcamp-master/1-node-farm/starter/txt/append.txt`, "utf-8", (err, data3) => {
//             console.log(data3);

//             fs.writeFile("complete-node-bootcamp-master/1-node-farm/starter/txt/final.txt", `${data2} \n${data3}`, "utf-8", err => {
//                 console.log("Your file has been written")
//             })
//         })
//     })
// })


///////////////////////////////////////
// SERVER
const tempOverview = fs.readFileSync(`1-node-farm/starter/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`1-node-farm/starter/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`1-node-farm/starter/templates/template-product.html`, "utf-8");
const data = fs.readFileSync(`1-node-farm/starter/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map( el => slugify( el.productName, { lower: true } ));
console.log(slugs);

const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);

    //Overview page
    if(pathname === "/" || pathname === "/overview"){
        res.writeHead(200, {"Content-type" : "text/html"});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");

        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
        res.end(output);

    //Product Page
    } else if (pathname === "/product"){
        res.writeHead(200, {"Content-type" : "text/html"});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    //API
    } else if(pathname === "/api") {
        res.writeHead(200, {"Content-type" : "application/json"});
        res.end(data);

    //Not found
    } else {
        res.writeHead(404, {
            "Content-type" : "text/html",
            "my-own-header" : "hello-world"
        });
        res.end("<h1>Page not found!</h1>");
        res.end(" ")
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to requests on port 8000..");
});



