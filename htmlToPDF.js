//This file contains phantomjs code and needs to run as such see the documentation at http://phantomjs.org/
//<--- USAGE ---> phantomjs htmlToPDF.js [url or file path] [destination file .pdf] [invoice number] [account name]

/******** This is fill to prevent a bug from occuring **********************************************************/
RegExp.prototype.test = function(str){
  return str.match(this) !== null;
};
/********* End fill **** for more information see ianconery.com/2015/08/regexp-test-bug-in-javascript **********/

var page = require('webpage').create();
var system = require('system');
var invoiceNumber = system.args[3] || 'Invoice Number Not Available';
var buildingName = system.args[4] || 'Account Name Not Available';
var styles = [];
var fonts = [];

/*************************************** Page Error Handling ************************************************/

//capture logs from the webpage
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

//catch error messages and stack trace from the page
page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};

//this is uneccessary now
//log requests and block requests
// page.onResourceRequested = function(data, request){
//     //Block css requests
//     if((/http:\/\/.+?\.css$/gi).test(data['url'])) {
//       //Grab the file name and add to list for local loading later
//       var fileName = /\/(\w+)\.css/gi.exec(data['url'])[1];
//       styles.push(fileName);
//       console.log('Skipping CSS', data['url']);
//       request.abort();
//     //Block all ttf requests
//     }else if((/http:\/\/.+?\.ttf$/gi).test(data['url'])){
//       //Grab the name of the font and add to list for local loading
//       //Not using regex as it wasn't capturing unusual file names
//       var url = data['url'].split('/');
//       var fileName = url[url.length - 1];
//       // var fileName = /\/(\w+)\.ttf/gi.exec(data['url'])[1];
//       fonts.push(fileName);
//       console.log('Skipping Font', data['url']);
//       request.abort();
//     }else{
//       //Log any other request so we can eventually block those too
//       console.log('::loading', data['url']);
//     }
// };

//log the response if the resource takes too long
page.onResourceTimeout = function(request) {
    console.log('Response (#' + request.id + '): ' + JSON.stringify(request));
};

//log the responses from the requests
// page.onResourceReceived = function(response) {
//   console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response.headers));
// };

//log the error if the resource fails to load
// page.onResourceError = function(resourceError) {
//   console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
//   console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
// };

/*************************************** End Page Error Handling ********************************************/

page.onLoadFinished = function(){
  window.setTimeout(function(){
    time = new Date().getSeconds();
    console.log('Finished');
    console.log('   Time: ', time);
    page.render(system.args[2]);
    phantom.exit();
  },2000);
};



// change the paper size to A3 or Tabloid as Letter doesn't work, add small margins otherwise the content is cut off
page.open(system.args[1], function (status) {
  console.log('Status ' + status);
  if(status === 'success'){
    page.evaluate(function(){
      //.bgColor sets the background to white instead of the defaul transparent
      document.body.bgColor = 'white';
    });
    page.paperSize = {
      format: 'A3',//Tabloid or A3 sizes are the only ones that grab the whole page
      orientation: 'portrait',
      margin: {left:'0.5cm', right:'0.5cm', top:'1.5cm', bottom:'1.0cm'},
      footer: {
        height: '0.9cm',
        // add a footer callback showing page number, invoice number and account name
        contents: phantom.callback(function(pageNum, numPages) {
        //TODO: fix padding on invoice number div and page number div
            return "<div><div style='text-align:left; float:left; width:33%'><small>Invoice Number: " + invoiceNumber + "</small></div><div style='text-align:left; float:left; width:33%;'><small>Account Name: " + buildingName + "</small></div><div style='text-align:right; float:left; width:33%'><small>" + pageNum + "</small></div></div>";
          })
      }
    };

  }else{
    // TODO need to handle status errors
    console.log('Something went wrong, returning status of ' + status);
  }
});


