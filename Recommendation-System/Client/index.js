let express = require("express"),
  app = express(),
  cors = require('cors')
// var https = require('https');
var http = require('http');
// var fs = require('fs');
var path = require('path')
app.use(cors())
app.use(express.static(__dirname + '/build')) //project k root m build k name se folder banaiega or wahan react ki build daal dijiega
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build', 'index.html'));
});
// var options = {
//     key: fs.readFileSync('/etc/letsencrypt/live/live.xio.app/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/live.xio.app/fullchain.pem')
//   };

http.createServer(app).listen(3000);
// https.createServer(options, app).listen(443);