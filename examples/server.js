var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var port = process.env.PORT || 4000;
app.listen(port);
