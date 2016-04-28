var page = require('webpage').create();
var system = require('system');

page.open('http://host1.controlco.com/login', function(status){
  console.log('Status: ' + status);
  var cookie = page.evaluate(function(){
    return document.cookie;
  });
  console.log('Cookie number 1 ' + cookie);
  var user = page.evaluate(function(){
    var thing = document.getElementById('username');
    // thing.value = 'dgSuper';
    return thing;
  });
  console.log(user);
  var password = page.evaluate(function(){
    var other = document.getElementById('password');
    // other.value = 'dglux1234';
    return other;
  });
  console.log(password);
  var clicked = page.evaluate(function(){
    return document.getElementById('submitButton');
  });
  console.log(clicked);
  var otherCookie = page.evaluate(function(){
    return document.cookie;
  });
  console.log('Cookie number 2 ' + otherCookie)
  phantom.exit();
});