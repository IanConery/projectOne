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
var time = new Date().getSeconds();
console.log(time);

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


// change the paper size to A3 or Tabloid as Letter doesn't work, add small margins otherwise the content is cut off
//TODO add a header if needed
page.open(system.args[1], function (status) {
  //this log is purely for me for now
  console.log('Status ' + status);
  if(status === 'success'){
    time = new Date().getSeconds();
    console.log('Step One - Cut A Hole In The Box')
    console.log('   Time: ', time)
    //use this to sign into any dglux page
/*    page.evaluate(function(){
      var user = document.getElementById('username');
      user.value = 'dgSuper';
      var pass = document.getElementById('password');
      pass.value = 'dglux1234';
      var button = document.getElementById('submitButton');
      button.click();
    });*/
    // window.setTimeout(function(){ //don't need this if not authenticating
      // time = new Date().getSeconds();
      // console.log('Step Two - Put Your Junk In That Box')
      // console.log('   Time: ', time)
      var title = page.evaluate(function(){
        //.bgColor sets the background to white instead of the defaul transparent
        //document.body.bgColor = 'white';// removed for now as I don't see a difference
        return document.title;
      });
      var buildingName = system.args[4] || title;
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
        time = new Date().getSeconds();
        console.log('Step Three - And Thats How You Do It')
        console.log('   Time: ', time)
        page.render(system.args[2]);
        phantom.exit();
      }, 2000);
    // }, 2000); // this is the end of the auth setTimeout
  }else{
    // TODO need to handle status errors
    console.log('Something went wrong, returning status of ' + status);
  }
});


