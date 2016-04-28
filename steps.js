/******************************TEST****************************************/
//this didn't work leaving it here anyway just in case
var page = require('webpage').create();
var page2 = require('webpage').create();
var system = require('system');
var invoiceNumber = '00012(temp)';
var stepIndex = 0;
var loadInProgress = false;
var date = new Date();
var milSec = date.getMilliseconds();

page.onConsoleMessage = function(msg) {
    console.log('page one msg: ', msg);
};

page2.onConsoleMessage = function(msg) {
    console.log('page two msg: ', msg);
};

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log('Loading started');
};
page.onLoadFinished = function() {
    loadInProgress = false;
    console.log('Loading finished');
};

var executeStepsInOrder = function(){
  if(typeof steps[stepIndex] === 'function'){
    steps[stepIndex]();
    stepIndex++;
  }
  if(typeof steps[stepIndex] !== 'function'){
    console.log('Steps complete, exiting');
    phantom.exit();
  }
};

var steps = [
  function(){
    console.log('step one - open host1 page');
    console.log('  MilSec: ' + milSec);
    page2.open('http://host1.controlco.com/login', function(status){
      console.log('Page2 status ' + status);
    });
  },
  function(){
    console.log('step two - populate login form and submit');
    milSec = new Date().getMilliseconds();
    console.log('  MilSec: ' + milSec);
    page2.evaluate(function(){
      setTimeout(function(){},4000);
      document.getElementById('username').value = 'dgSuper';
      document.getElementById('password').value = 'dglux1234';
      document.getElementById('submitButton').click();
    });
    console.log('Signed in!');
  },
  function(){
    console.log('Skipping: step three - wait for dg to sign in and retreive the cookie');
    milSec = new Date().getMilliseconds();
    console.log('  MilSec: ' + milSec);
    cookies = page2.cookies;
    console.log('listing cookies');
    for(var i in cookies){
      console.log(cookies[i].name + '=' + cookies[i].value);
    }
  },
  function(){
    console.log('step four - /*set cookies for the page,*/ open the page and add paper settings');
    milSec = new Date().getMilliseconds();
    console.log('  MilSec: ' + milSec);
    // page.addCookie({
    //   name: cookies[0].name,
    //   value: cookies[0].value,
    //   path: '/path',
    //   expires: (new Date()).getTime() + (1000 * 60 * 60)
    // });
    page.open(system.args[1], function (status) {
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
    });
  },
  function(){
    console.log('step five - render the page to pdf');
    milSec = new Date().getMilliseconds();
    console.log('  MilSec: ' + milSec);
    page.render(system.args[2]);
  }
];


window.setInterval(executeStepsInOrder, 500);
