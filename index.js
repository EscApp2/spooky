var express = require("express");
var util         = require('util');

var app = express();
app.use(express.logger());

//console.log('1231212123123123551153555512312312312312313135555');

app.get('/', function(request, response) {
  response.send('Hello World!');
  
  
});

app.get('/apps/', function(request, response) {
  response.send('1234');
  response.send(echo(request));
  response.send('123');
  
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


//http://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
function echo(data){
	if(typeof data == "object"){
		var str = util.inspect(data, {depth: null});
		str = str
			.replace(/<Buffer[ \w\.]+>/ig, '"buffer"')
			.replace(/\[Function]/ig, 'function(){}')
			.replace(/\[Circular]/ig, '"Circular"')
			.replace(/\{ \[Function: ([\w]+)]/ig, '{ $1: function $1 () {},')
			.replace(/\[Function: ([\w]+)]/ig, 'function $1(){}')
			.replace(/(\w+): ([\w :]+GMT\+[\w \(\)]+),/ig, '$1: new Date("$2"),')
			.replace(/(\S+): ,/ig, '$1: null,')
			.replace(/\n/ig, "<br/>");

		return  "<pre>"+JSON.stringify(str, null, 4)+"</pre>";
	}else{
		return  "<pre>"+data+"</pre>";
	}
} 
