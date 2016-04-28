//This file contains phantomjs code and needs to run as such see the documentation at http://phantomjs.org/
//This code has nothing to do with node.js
//usage ---> phantomjs htmlToPDF.js [url or file path] [destination file .pdf]
/*PROBLEM --- required files are not available to render the css properly --- PROBLEM*/
var page = require('webpage').create();
var system = require('system');
//invoiceNumber will be populated dynamicaly later, also need to add the 'title' dynamicaly
var invoiceNumber = '00012(temp)';
//this might be neccessary later
page.settings.localToRemoteUrlAccessEnabled = true;
//capture logs from the webpage
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
//log requests
page.onResourceRequested = function(data, request){
  console.log('::loading', data['url']);
};
/*//exit once finished
page.onLoadFinished = function(){
  console.log('::rendering');
  page.render(system.args[2]);
  phantom.exit();
};
//add the css to the head here
var content = '';*/

// change the paper size to A3 or Tabloid as Letter doesn't work, add small margins otherwise the content is cut off
//TODO add a header if needed
page.open(system.args[1], function (status) {
  //this log is purely for me for now
  console.log('Status ' + status);
  if(status === 'success'){
    var title = page.evaluate(function(){
      //.bgColor sets the background to white instead of the defaul transparent
      document.body.bgColor = 'white';
      return document.title;
    });
    page.paperSize = {
      format: 'A3',//Tabloid or A3 sizes are the only ones that grab the whole page
      orientation: 'portrait',
      margin: {left:'0.5cm', right:'0.5cm', top:'1.5cm', bottom:'1.0cm'},
      footer: {
        height: '0.9cm',
        // add a footer callback showing page number, invoice number and account name
        contents: phantom.callback(function(pageNum, numPages) {
        //TODO replace the title with the property name fix padding on invoice number div and page number div
            return "<div><div style='text-align:left; float:left; width:33%'><small>Invoice Number: " + invoiceNumber + "</small></div><div style='text-align:left; float:left; width:33%;'><small>Account Name: " + title + "</small></div><div style='text-align:right; float:left; width:33%'><small>" + pageNum + "</small></div></div>";
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


