// var fs = require('fs');
window.onload = function(){
var pdf = require('html-pdf');
var html = document.getElementByTagName('body');
var options = { format: 'Letter' };

define(function(require){
    var fs = require('fs');
});

var clicked = document.getElementByID('export');
clicked.onclick = function(){
    console.log("clicked",html);
    pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
};
};