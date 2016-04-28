//This file contains phantomjs code and needs to run as such see the documentation at http://phantomjs.org/
//This code has nothing to do with node.js
//usage ---> phantomjs htmlToPDF.js [url or file path] [destination file .pdf] [invoice number] [building name]

/******** This is fill to prevent a bug from occuring **********************************************************/
RegExp.prototype.test = function(str){
  return str.match(this) !== null;
};
/********* End fill **** for more information see ianconery.com/2015/08/regexp-test-bug-in-javascript **********/

var page = require('webpage').create();
var system = require('system');
//invoiceNumber will be populated dynamicaly later, also need to add the 'title' dynamicaly
var invoiceNumber = system.args[3] || '00012(temp)';

//capture logs from the webpage
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
//log requests
page.onResourceRequested = function(data, request){
  // if((/http:\/\/.+?\/login/gi).test((data['url'])){
  //   console.log('Skipping: ', data['url']);
  //   request.abort();
  // }
  console.log('::loading', data['url']);
};
//catch error messages and stack trace
page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};

page.addCookie({
  'name'     : '_ga',   /* required property */
  'value'    : 'GA1.2.1150521923.1461282723; niagara_session=sd52d8a5e582e7cedc7018a068103b3bca172f45f84208b24c8',  /* required property */
  'domain'   : 'http://host1.controlco.com',           /* required property */
  'secure'   : false,
  'expires'  : (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
});

// change the paper size to A3 or Tabloid as Letter doesn't work, add small margins otherwise the content is cut off
//TODO add a header if needed
page.open(system.args[1], function (status) {
  //this log is purely for me for now
  console.log('Status ' + status);
  if(status === 'success'){
    var title = page.evaluate(function(){
      //.bgColor sets the background to white instead of the defaul transparent
      document.body.bgColor = 'white';// removed for now as I don't see a difference
      return document.title;
    });
    var buildingName = system.args[4] || title
    page.paperSize = {
      format: 'A3',//Tabloid or A3 sizes are the only ones that grab the whole page
      orientation: 'portrait',
      margin: {left:'0.5cm', right:'0.5cm', top:'1.5cm', bottom:'1.0cm'},
      footer: {
        height: '0.9cm',
        // add a footer callback showing page number, invoice number and account name
        contents: phantom.callback(function(pageNum, numPages) {
        //TODO replace the title with the property name fix padding on invoice number div and page number div
            return "<div><div style='text-align:left; float:left; width:33%'><small>Invoice Number: " + invoiceNumber + "</small></div><div style='text-align:left; float:left; width:33%;'><small>Account Name: " + buildingName + "</small></div><div style='text-align:right; float:left; width:33%'><small>" + pageNum + "</small></div></div>";
          })
      }
    };
    window.setTimeout(function(){
      page.render(system.args[2]);
      phantom.exit();
    }, 2000);
  }else{
    // TODO need to handle status errors
    console.log('Something went wrong, returning status of ' + status);
  }
});


