var express = require("express");
var util         = require('util');

var app = express();
app.use(express.logger());

//console.log('1231212123123123551153555512312312312312313135555');

app.get('/', function(request, response) {
  response.send('Hello World!');
  
  
});

app.get('/apps/', function(request, response) {
  
 
  
  
  var Spooky = require('spooky');
		console.log('444444444444444');
	
//} catch (e) {
	//var Spooky = require(__dirname+'/node_modules/spooky/lib/spooky');
//}
	  
		
		
		//res.end(echo(Spooky));
		//return true;
		
		
		var spooky = new Spooky({
				child: {
					//transport: 'http'
				},
				 child: {
					//spooky_lib: __dirname+'/../',
				 },
				 casper: {
					logLevel: 'debug',
					verbose: true
				}
			}, function (err) {
				if (err) {
					e = new Error('Failed to initialize SpookyJS');
					e.details = err;
					throw e;
				}

				spooky.start(
					'http://en.wikipedia.org/wiki/Spooky_the_Tuff_Little_Ghost');
				spooky.then(function () {
					this.emit('hello', 'Hello, from ' + this.evaluate(function () {
						return document.title;
					}));
				});
				spooky.run();
			});

		spooky.on('error', function (e, stack) {
			console.error(e);

			if (stack) {
				console.log(stack);
			}
		});
	  
		
		// Uncomment this block to see all of the things Casper has to say.
		// There are a lot.
		// He has opinions.
		spooky.on('console', function (line) {
			console.log(line);
		});
		
		spooky.on('hello', function (greeting) {
			console.log(greeting);
		});
     
		spooky.on('log', function (log) {
			if (log.space === 'remote') {
				console.log(log.message.replace(/ \- .*/, ''));
			}
		});
		
   response.send('end');
   
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
