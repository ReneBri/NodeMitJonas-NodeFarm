// requiring the file system to read and write to
// declaring or requiring things this way stores an object into the fs variable
const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// just learning about intergrating third party modules
// const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
// console.log(slugs);
// console.log(slugify('Fresh Avacado', { lower: true }));


const server = http.createServer((req, res) => {
    console.log(req.url);

    const pathName = req.url;
    const { query, pathname } = url.parse(req.url, true);

    // overview page
    if(pathname === '/overview' || pathname === '/'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        const cardsHtml = dataObj.map(card => replaceTemplate(tempCard, card)).join();
        const finalOverview = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(finalOverview);

    // product page
    } else if (pathname === '/product'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        const product = dataObj[query.id];
        const finalProduct = replaceTemplate(tempProduct, product);
        res.end(finalProduct);

    // api
    } else if (pathname === '/api'){
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);

    // 404
    } else {
        res.writeHead(404, {
            "Content-Type": "text/html"
        });
        res.end("<h1>Page not found. 404!</h1>");
    }
    
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Listening to requests on port 3000');
});