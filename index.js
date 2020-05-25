const http = require('http')
const fs = require('fs')
const url = require("url");
const path = require("path");
const util = require('util');
const mime = require('mime');
const httpPort = process.env.port || 3000;
const distPath = path.resolve(__dirname, "dist");

http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;
  console.log("==req.url==>" + req.url);
  console.log("==pathname==>" + pathname);

  if (path.sep === pathname) {
    pathname = path.join(pathname, "index.html");
  }

  pathname = path.join(distPath, pathname);

  fs.stat(pathname, (err, stats) => {
    if (err) {
      console.log("NSSERROR:" + err.message);
      pathname = path.join(distPath, "index.html");
    }

    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.writeHead(500, { "content-type": "text/plain" });
        res.end(err.message);
      };
      let ext = path.extname(pathname);
      let contenttype = mime.getType(ext) || "text/plain";
      res.writeHead(200, { "content-type": contenttype });
      res.write(data);
      res.end();
    });

  });

}).listen(httpPort, () => {
  console.log('Server listening on: http://localhost:%s', httpPort)
})