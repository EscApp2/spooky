var express = require("express");
var app = express();
app.use(express.logger());

//console.log('1231212123123123551153555512312312312312313135555');

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});