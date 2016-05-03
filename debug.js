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

// var styles = ['_styles', 'app', 'app_icons', 'block_icons', 'charts', 'colored_icons', 'component', 'dglux', 'dock-manager', 'editor', 'fonts', 'grid', 'loader', 'style', 'tree', 'view'];
console.log(time);

// var stylePaths = [];

var styles = [];
var fonts = [];

/*************************************** Page Error Handling ************************************************/

//capture logs from the webpage
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
//log requests and block css requests as they are 302ed to the login page
page.onResourceRequested = function(data, request){
    //Block css requests
    if((/http:\/\/.+?\.css$/gi).test(data['url'])) {
      //Grab the file name and add to list for local loading later
      var fileName = /\/(\w+)\.css/gi.exec(data['url'])[1];
      styles.push(fileName);
      console.log('Skipping CSS', data['url']);
      // if(fileName !== 'loader'){
      // if(fileName === 'view' || fileName === 'component'){
      //   page.evaluate(function(fileName){
      //     var path = 'file:\\C:\\Users\\Ian\\Desktop\\Styles\\';
      //     var head = document.head;
      //     var element = document.createElement('link');
      //     element.type = 'text/css';
      //     element.rel = 'stylesheet';
      //     element.href = path + fileName + '.css';
      //     head.appendChild(element);
      //   },fileName);
      // }
      request.abort();
    //Block all ttf requests
    }else if((/http:\/\/.+?\.ttf$/gi).test(data['url'])){
      //Grab the name of the font and add to list for local loading
      //Not using regex as it wasn't capturing unusual file names
      var url = data['url'].split('/');
      var fileName = url[url.length - 1];
      // var fileName = /\/(\w+)\.ttf/gi.exec(data['url'])[1];
      fonts.push(fileName);
      console.log('Skipping Font', data['url']);
      page.evaluate(function(fileName){
        var path = 'file:\\C:\\Users\\Ian\\Desktop\\Styles\\';
        var head = document.head;
        var element = document.createElement('link');
        element.type = 'text/css';
        element.rel = 'stylesheet';
        element.href = path + fileName/* + '.ttf'*/;
        head.appendChild(element);
      },fileName);
      request.abort();
    }else{
      //Log any other request so we can eventually block those too
      console.log('::loading', data['url']);
    }
};

//log the responses from the requests
// page.onResourceReceived = function(response) {
//   console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response.headers));
// };
//catch error messages and stack trace from the page
page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};
//log the response if the resource takes too long
page.onResourceTimeout = function(request) {
    console.log('Response (#' + request.id + '): ' + JSON.stringify(request));
};
//log the error if the resource fails to load
// page.onResourceError = function(resourceError) {
//   console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
//   console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
// };

/*************************************** End Page Error Handling ********************************************/

// page.onLoadStarted = function() {
//   var head = page.evaluate(function() {
//     return document.head;
//   });
//   console.log('Head ' + head + ' will gone...');
//   console.log('Now loading a new page...');
// };

page.onLoadFinished = function(){
  time = new Date().getSeconds();
  console.log('Before timeout')
  console.log('   Time: ', time)
  page.render(system.args[2]);

  window.setTimeout(function(){
    time = new Date().getSeconds();
    console.log('After timeout');
    console.log('   Time: ', time);
    page.render('afterTime.pdf');
    phantom.exit();
  },5000);
};


// change the paper size to A3 or Tabloid as Letter doesn't work, add small margins otherwise the content is cut off
//TODO add a header if needed
page.open(system.args[1], function (status) {

/*
phantom.addCookie({
  'name': '_ga',
  'value':'GA1.2.1150521923.1461282723',
  'domain':'.controlco.com',
  'path': '/',
  'httponly': true,
  'secure': false,
  'expires': (new Date()).getTime() + (1000 * 60 * 60)
});

phantom.addCookie({
  'name': 'niagara_session',
  'value':'s83fa9c59760587c59b68f093d2ad06bcfff3bcac4d3fca91e4',
  'domain':'host1.controlco.com',
  'path': '/',
  'httponly': true,
  'secure': false,
  'expires': (new Date()).getTime() + (1000 * 60 * 60)
});
*/



  //this log is purely for me for now
  console.log('Status ' + status);
/*    page.evaluate(function(){
    var path = 'file:\\C:\\Users\\Ian\\Desktop\\projectOne\\ownCSS.css';
    var head = document.head;
    var element = document.createElement('link');
    element.type = 'text/css';
    element.rel = 'stylesheet';
    element.href = path;
    head.appendChild(element);
  });*/
  if(status === 'success'){
    time = new Date().getSeconds();
    console.log('Step One - Cut A Hole In The Box')
    console.log('   Time: ', time)
    var content = page.content;
    // console.log('Content: ' + content);
    //use this to sign into any dglux page
    // page.evaluate(function(){
    //   var user = document.getElementById('username');
    //   user.value = 'dgSuper';
    //   var pass = document.getElementById('password');
    //   pass.value = 'dglux1234';
    //   var button = document.getElementById('submitButton');
    //   button.click();
    //   var styleSheet = document.styleSheets;
    //   for(var i in styleSheets){
    //     console.log('Sheet ' + i + styleSheets[i].href);
    //   }
    // });
    // window.setTimeout(function(){ //don't need this if not authenticating
      // if(stylePaths.length !== 0){
      //   page.evaluate(function(){
      //     //this doesn't recognize the function declared at the top of the file
      //     addCSSToPage(stylePaths);
      //   });
      //   console.log('Added CSS Local Paths');
      // }
      time = new Date().getSeconds();
      console.log('Step Two - Put Your Junk In That Box')
      console.log('   Time: ', time)
      var title = page.evaluate(function(){
        //.bgColor sets the background to white instead of the defaul transparent
        // document.body.bgColor = 'white';// removed for now as I don't see a difference
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
      // console.log(styles);
      // console.log(fonts);
      // window.setTimeout(function(){
      //   time = new Date().getSeconds();
      //   console.log('Step Three - And Thats How You Do It')
      //   console.log('   Time: ', time)
      //   page.render(system.args[2]);
      //   phantom.exit();
      // }, 2000);
    // }, 2000); // this is the end of the auth setTimeout
  }else{
    // TODO need to handle status errors
    console.log('Something went wrong, returning status of ' + status);
  }
});


