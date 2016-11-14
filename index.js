var express = require("express");
var app 	= express();
var util    = require('util');
var Spooky  = require('spooky');
var	url 	= require('url');
var	valid_url 	= require('valid-url');

var	  GLOBALS      = {
	"body":{
		"required":[],
		"parts":{},
	}
};
		
		
//app.use(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/apps/', function(request, response) {
		
		makeResponce(response);
		
		//makeUrl(request.url); //.originalUrl
		makeUrl(request.originalUrl); //
		
		var query_param = GLOBALS['url']['query'];
		
		//console.log(query_param);
		
		if(query_param["app_id"] == "get_dom" ){
			
			addPart('body_content');
			
			var query_param = GLOBALS['url']['query'];
			var url = query_param['url'];
			var func = query_param['func'];
			
			if(!!url && valid_url.isWebUri(url)){
				
				var flag = getDomSpooky(url,func);
				
				if(!flag){
					response.status(200).send('error');
				}	
				
			}else{
				response.status(200).send('no_url or no_valid_url');
			}
			
		}else{
			response.status(200).send('no_app');
		}

		//response.send('end');
   
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


function makeResponce(res){
   GLOBALS['response'] = res;
}

function makeUrl(req_url){
   GLOBALS['url'] = url.parse(req_url,true);
}

function  addPart(part){
	if(!!part){
		GLOBALS["body"]["required"].push("#"+part+"#");
	}
}

function getDomSpooky(url, func){
		
		if(!url){
			return false;
		}	
		
		if(!func){
			func = "title";
		}
		
		var spooky = new Spooky({
			child: {
				//transport: 'http'
			},
			 child: {
				//spooky_lib: __dirname+'/../',
			 },
			 casper: {
				//logLevel: 'debug',
				//verbose: true
				verbose: false
			}
		}, function (err) {
			
			if (err) {
				e = new Error('Failed to initialize SpookyJS');
				e.details = err;
				throw e;
			}
			
			spooky.start(url);
			
			/*
			spooky.then(function () {
				 // this function runs in Casper's environment
				this.emit('page.loaded', this.evaluate(function () {
					// this function runs in the page's environment	
					return document.title;
				}));
			});
			*/
			
			spooky.then([{
				"func":func,
			},//this params goes from nodejs to casperjs enviroment
			function () {
				// this function runs in Casper's environment
				//console.log(func);
				
				this.emit('page.loaded', 
					this.evaluate(function (func) {
						// this function runs in the page's environment	
						
						var GET_DOM = {}
						GET_DOM.title = function(){
							return document.title;
						} 
						
						GET_DOM.getBitcoinGraphData = function(){
							//return {"a":"a","b":"b"}; //d1.file_;
							return d1.file_;
						}
						
						if(!GET_DOM.hasOwnProperty(func)){
							func = "title";
						}
						
						
						return GET_DOM[func]();
					}
					//this params goes from casperjs to browser page enviroment
					, func )
				);
				
				
			}]);
			
			spooky.run();
		});
		
		spooky.on('page.loaded', function (browser_page_response) {
			//console.log('on browser_page_response');
			//console.log(browser_page_response);
			BodyContentCallback("body_content",browser_page_response);
		});
		
		// Uncomment this block to see all of the things Casper has to say.
		// There are a lot.
		// He has opinions.
		spooky.on('console', function (line) {
			console.log(line);
		});
		
		
		spooky.on('error', function (e, stack) {
			console.error(e);

			if (stack) {
				console.log(stack);
			}
		});
	  
		
		spooky.on('log', function (log) {
			if (log.space === 'remote') {
				console.log(log.message.replace(/ \- .*/, ''));
			}
		});
		return true;
}

function isBodyContentFull(){
	PHP.foreach(GLOBALS['body']['required'], function(ind,val){
		if(!GLOBALS['body']['parts'][val]){
			return false;
		}
	})
	
	return true;
}

function BodyContent(){
    
	//console.log('BodyContent');
	
	//GLOBALS['response'].setHeader('Content-Type', contentTypes['html']);
	//GLOBALS['response'].setHeader('Cache-Control', 'no-cache, no-store');
	
	
	
	GLOBALS['response'].status(200);
	
	let content = "";
	//let html_template = "<html><head></head><body>#body_content#</body></html>";
	let html_template = "#body_content#";
	
	
	
	
	var query_param = GLOBALS['url']['query'];
	if(query_param['header'] == "json"){
		
		content = {};
		PHP.foreach(GLOBALS['body']['parts'],function(ind, val){
			var key = PHP.str_replace("#","",ind);
			content[key] = val;
		});
		GLOBALS['response'].json(content);
	
	}else{
		content = PHP.str_replace(
			PHP.array_keys(GLOBALS['body']['parts']),
			PHP.array_values(GLOBALS['body']['parts']),
			html_template
		);
		
		GLOBALS['response'].send(content); // only once
	}
	
	
	
}

function EndContent(end_data){
	//console.log('EndContent');
	
	if(!!end_data){
		GLOBALS['response'].end(end_data);  // only once
	}else{
		GLOBALS['response'].end(); // only once 
	}
	 
}

function BodyContentCallback(key,content){
	if(!!key){
		GLOBALS['body']['parts']["#"+key+"#"] = content;
		
		if(isBodyContentFull()){
			BodyContent();
			EndContent();
		}
		
	}
	
} 


var PHP = {}

PHP.foreach = function (obj, callback){
	// callback (index,value)
	/*jquery*/
	var value,
		i = 0,
		length = obj.length,
		isArray;
	
	if(Object.prototype.toString.call(obj) === '[object Array]' ) {
		// array
		isArray = true;
	}else{
		//object
		isArray = false;
	}
	
	if ( isArray ) {
		for ( ; i < length; i++ ) {
			value = callback.call( obj[ i ], i, obj[ i ] );

			if ( value === false ) {
				break;
			}
		}
	} else {
		for ( i in obj ) {
			value = callback.call( obj[ i ], i, obj[ i ] );

			if ( value === false ) {
				break;
			}
		}
	}
}

PHP.str_replace = function( search, replace, subject ) {	// Replace all occurrences of the search string with the replacement string
	// 
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: Gabriel Paderni

	if(!(replace instanceof Array)){
		replace=new Array(replace);
		if(search instanceof Array){//If search	is an array and replace	is a string, then this replacement string is used for every value of search
			while(search.length>replace.length){
				replace[replace.length]=replace[0];
			}
		}
	}

	if(!(search instanceof Array))search=new Array(search);
	while(search.length>replace.length){//If replace	has fewer values than search , then an empty string is used for the rest of replacement values
		replace[replace.length]='';
	}

	if(subject instanceof Array){//If subject is an array, then the search and replace is performed with every entry of subject , and the return value is an array as well.
		for(k in subject){
			subject[k]=str_replace(search,replace,subject[k]);
		}
		return subject;
	}

	for(var k=0; k<search.length; k++){
		var i = subject.indexOf(search[k]);
		while(i>-1){
			subject = subject.replace(search[k], replace[k]);
			i = subject.indexOf(search[k],i);
		}
	}

	return subject;

}


PHP.array_values = function( input ) {	// Return all the values of an array
	// 
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)

	var tmp_arr = new Array(), cnt = 0;
	var key = null;
	
	for ( key in input ){
		tmp_arr[cnt] = input[key];
		cnt++;
	}

	return tmp_arr;
}

PHP.array_keys = function ( input, search_value, strict ) {	// Return all the keys of an array
	// 
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)

	var tmp_arr = new Array(), strict = !!strict, include = true, cnt = 0;
	var key = null;
	
	for ( key in input ){
		include = true;
		if ( search_value != undefined ) {
			if( strict && input[key] !== search_value ){
				include = false;
			} else if( input[key] != search_value ){
				include = false;
			}
		}

		if( include ) {
			tmp_arr[cnt] = key;
			cnt++;
		}
	}

	return tmp_arr;
}


