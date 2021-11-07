const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////////////////////////
//FILES

//blocking, synchronous way
// const textIn = fs.readFileSync(
//   "/Users/manish/Desktop/1-node-farm/starter/txt/input.txt",
//   "utf8"
// );
// const textOut = `This is what we know about avocado: ${textIn}\nCreated on ${Date.now()}`;
// fs.writeFileSync(
//   "/Users/manish/Desktop/1-node-farm/starter/txt/output.txt",
//   textOut
// );
// console.log("File written");

//non-blocking, asynchronous way
// fs.readFile(
//   "/Users/manish/Desktop/1-node-farm/starter/txt/start.txt",
//   "utf-8",
//   (err, data1) => {
//     fs.readFile(
//       `/Users/manish/Desktop/1-node-farm/starter/txt/${data1}.txt`,
//       "utf-8",
//       (err, data2) => {
//         console.log(data2);
//         fs.readFile(
//           "/Users/manish/Desktop/1-node-farm/starter/txt/append.txt",
//           "utf-8",
//           (err, data3) => {
//             console.log(data3);

//             fs.writeFile(
//               "/Users/manish/Desktop/1-node-farm/starter/txt/final.txt",
//               `${data2}\n${data3}`,
//               "utf-8",
//               (err) => {
//                 console.log("Your file has been written.");
//               }
//             );
//           }
//         );
//       }
//     );
//   }
// );
// console.log("will read file");
//////////////////////////////////////////////////////////////////////////
//SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }

  //Product page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  //API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  }

  //NOT FOUND
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>This page could not be found.</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to request on port 8000');
});
