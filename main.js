window.onload = function(){
    var button = document.getElementById('button');
  button.onclick = function(event){
    event.preventDefault();
    alert('Ive been clicked');
  };

  var nodeList = [];
  var link = new DS.LinkProvider('http://127.0.0.1:8080/conn', 'Example-');
//   link = new DS.LinkProvider('http://127.0.0.1:8080/conn',
//   'Example-', {
//     defaultNodes: {
//       AddNum: {
//         $name: 'Add number',
//         $is: 'addnum',
//         $invokable: 'write',
//         $params: [{ name: 'value', type: 'int' }]
//       }
//     },
//     profiles: {
//       addnum: function(path) {
//         return new DS.SimpleActionNode(path, function(params) {
//           var addVal = parseInt(params['value'], 10);
//           var ndNum = nodeList.length;
//           nodeList.add(link.addNode('/MyNum' + ndNum, {
//             $name: 'My node #' + ndNum,
//             $type: 'int',
//             '?value': addVal
//           }));
//           // myNode.updateValue(myNum + addVal);
//         });
//     }
// });
  link.connect();
  var myNum = Math.round(Math.random() * 50);
  var myNode = link.addNode('/MyNum', {
    '$name': 'My Number',
    '$type': 'int',
    '?value': myNum
  });
  window.setInterval(function(){
    myNum = Math.round(Math.random() * 50);
    myNode.updateValue(myNum);
  }, 5000);
  // if(myNode.hasSubscriber){

  // }
  window.setInterval(function(){
    console.log(myNum);
  }, 1000)

};