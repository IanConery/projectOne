//This file contains phantomjs code and needs to run as such see the documentation at http://phantomjs.org/
//This code has nothing to do with node.js
//TODO see if I need to inject some js library that they are using or something of the like
//usage ---> phantomjs htmlToPDF.js [url or file path] [destination file .dpf]
var page = require('webpage').create();
var system = require('system');
var invoiceNumber = '00012(temp)';
// change the paper size to A3 or Tabloid as Letter doesn't work, add small margins otherwise the content is cut off
// add a footer callback showing page number, invoice number and account name
//TODO add a header if needed
//potentially add page.onConsoleMessage to capture logs from webpage
//Trying .settings to authenticate as I recieve a CORS error when no logged in trying to view html
page.settings = {
  userName: 'dgSuper',
  password: 'dglux1234'
};
page.open(system.args[1], function (status) {
  //this log is purely for me for now
  console.log('Status ' + status);
  if(status === 'success'){
    var title = page.evaluate(function(){
      document.body.bgColor = 'white';//this sets the background to white instead of the defaul transparent
      return document.title;
    });
    page.paperSize = {
      format: 'A3',//Tabloid or A3 sizes are the only ones that grab the whole page
      orientation: 'portrait',
      margin: {left:'0.5cm', right:'0.5cm', top:'1.5cm', bottom:'1.0cm'},
      footer: {
        height: '0.9cm',
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


