var page = require('webpage').create();
page.open('https://github.com/IanConery', function(status){
  console.log(status);
  if(status === 'success'){
    page.render('github.png')
  }
  phantom.exit();
});