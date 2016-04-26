var page = require('webpage').create();
var system = require('system');

if(system.args.length === 1){
  console.log('Usage: main.js <https://some URL>');
  phantom.exit();
}

var t = Date.now();
var address = system.args[1];
page.open(address, function(status){
  if(status !== 'success'){
    console.log('Failed to load' + address);
  }else{
    var title = page.evaluate(function(){
      return document.title;
    });
    t = Date.now() - t;
    console.log('Loading ' + system.args[1]);
    console.log('Loading time ' + t + ' msec');
    console.log('Page title is ' + title);
  }
  page.render('address.png');
  phantom.exit();
});