//Take HTML file as input, find all instances of .css files, remove those instances and replace them with local files to load from, output html
//alternativley just add the css from the local files to the html in the appropriate places

var style = function(href){
  var element = document.createElement('link');
  element.type = 'text/css';
  element.rel = 'stylesheet';
  element.href = href;
  return element;
};

var addCSSToPage = function(hrefs){
  var head = document.head;
  for(var i = 0; i < hrefs.length; i++){
    head.appendChild(style(hrefs[i]));
  }
  return html;
};

  // var ending = data['url'].slice(-4);
  // if(ending === '.css'){
  //   var file = /\/(\w+)\.css/gi.exec(data['url'])[1];
  //   if(styles.indexOf(file)){
  //     // var newFile = data['url'].replace()
  //     console.log('I HAVE THIS FILE LOCALLY')
  //   }
  // }