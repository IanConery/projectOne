window.onload = function () {

  setTimeout(function(){
    var numPages = Number(window.location.href.split("numPages=")[1]);// this is supplied in the url blablabla?numPages=2 it is then converted to a number
    console.log(numPages);//need to remove this from the server

    document.body.style.height = numPages * 1105; //if this 1105 is changed bad things happen
    document.getElementById("container").style.height="100%";
    document.body.style.width = 800; //again a fixed number assuming that if it is changed bad things will happen

    var doc = new jsPDF();// this returns an object with methods

    var done = function(){
      var fileLabel = localStorage.getItem("dg::fileName");//not quite sure where this comes from but it provides the building name what it is for ie. hvac and the month
      var filename = fileLabel+ '.pdf';// looks like this can be appended to the above line
      doc.save(filename);
      document.write("<div id='container' width=800>"+localStorage.getItem("dg::export")+localStorage.getItem("dg::export1")+localStorage.getItem("dg::export2")+"</div>");
    };

    html2canvas(document.getElementById("container")).then(function(canvas){//pretty sure we could save a reference to the "container" as we use it twice
      var ctxx = canvas.getContext("2d");
      var imageData = canvas.toDataURL("image/jpeg",1.0);
      var image = new Image();//pretty sure this does nothing it looks like it is overwritten by the next line this returns an img tag
      image = Canvas2Image.convertToJPEG(canvas);//calls genImage which returns an img 'tag' using canvas2Image older version

      image.onload = function(){
        doc.addImage(imageData, 'JPEG', 10, 10);

        var croppingYPosition = 1095;// since this is hardcoded and the number is used several times it should be one variable so it can be changed once if it needs to be
        var count = Math.ceil(image.height/1095) - 1;//uneccessary as it is overwritten below also could just use floor
        var count =0;

        var callback = function(){//needs a better name also recursive looks like I can add some arguments to this function to make it more readable
          doc.addPage();

          var sourceX = 0;//again hard coded values that can just be passed below to the draw image function
          var sourceY = croppingYPosition;//^^^^
          var sourceWidth = image.width;
          var sourceHeight = 1095;//hardcoded value
          var destWidth = sourceWidth;//this and the one below seem uneccessary
          var destHeight = sourceHeight;//^^^^
          var destX = -10;//again these could be combined or just added to the function call below
          var destY = -10;//^^^
          var canvas1 = document.createElement('canvas'); //creates a canvas
          canvas1.setAttribute('height', destHeight);
          canvas1.setAttribute('width', destWidth);
          var ctx = canvas1.getContext("2d");// this returns an object called 'CanvasRenderingContext2D'
          ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);// this must draw the image as the name suggests

          var image2 = new Image();// Again WTF I need to see if this is neccessary
          image2 = Canvas2Image.convertToJPEG(canvas1);//this is interesting as we are essentially preforming the same action twice [this might be why it become blurry taking a picture of a picture]
          image2.setAttribute("id", "image"+count); //end result is id="image2" or whatever the number is
          document.body.appendChild(image2);// then it is appended to the body

          image2Data = image2.src;//this is base64 encoded

          image2.onload = function(){
            doc.addImage(image2, 'JPEG', 10, 10);// this does what it sounds like
            croppingYPosition += destHeight;// this makes croppingYpos 1095 * 2, I see the next page if there is one
            count++;// this is what determines if we infinetly recurse or not would be unfortunate if numPages ended up being very large somehow
            var element = document.getElementById("image"+count);
            console.log(element)//  this is returning null, which is weird as image2Data returns a value !!! WTF
            if (count<numPages - 1){// base case
              callback();
            } else {
              done();
            }
          };

        };
        callback();// could make this an iife
      }
    });

  },1000);
};