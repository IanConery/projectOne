window.onload = function () {

  setTimeout(function(){
    var numPages = Number(window.location.href.split("numPages=")[1]);
    console.log(numPages);

    document.body.style.height = numPages * 1105;
    document.getElementById("container").style.height="100%";
    document.body.style.width = 800;

    var doc = new jsPDF();

    var done = function(){
      var fileLabel = localStorage.getItem("dg::fileName")
      var filename = fileLabel+ '.pdf';
      doc.save(filename);
      document.write("<div id='container' width=800>"+localStorage.getItem("dg::export")+localStorage.getItem("dg::export1")+localStorage.getItem("dg::export2")+"</div>");
    };

    html2canvas(document.getElementById("container")).then(function(canvas) {
      var ctxx = canvas.getContext("2d");
      var imageData = canvas.toDataURL("image/jpeg",1.0);
      var image = new Image();//pretty sure this does nothing even if it does it looks like it is overwritten by the next line
      image = Canvas2Image.convertToJPEG(canvas);//can't find a reference to this in html2canvas

      image.onload = function(){
        doc.addImage(imageData, 'JPEG', 10, 10);
        var croppingYPosition = 1095;
        count = Math.ceil(image.height/1095) - 1;
        var count =0;
        function callback(){

          doc.addPage();


          var sourceX = 0;
          var sourceY = croppingYPosition;
          var sourceWidth = image.width;
          var sourceHeight = 1095;
          var destWidth = sourceWidth;
          var destHeight = sourceHeight;
          var destX = -10;
          var destY = -10;
          var canvas1 = document.createElement('canvas');
          canvas1.setAttribute('height', destHeight);
          canvas1.setAttribute('width', destWidth);
          var ctx = canvas1.getContext("2d");
          ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

          var image2 = new Image();
          image2 = Canvas2Image.convertToJPEG(canvas1);
          image2.setAttribute("id", "image"+count);
          document.body.appendChild(image2);

          image2Data = image2.src;
          image2.onload = function(){
            doc.addImage(image2, 'JPEG', 10, 10);
            croppingYPosition += destHeight;
            count++;
            var element = document.getElementById("image"+count);
            console.log(element)
            if (count<numPages - 1){
              callback();
            } else {
              done();
            }
          };

        }
        callback();
      }
    });

  },1000);
};