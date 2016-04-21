window.onload = function () {

  setTimeout(function(){
    var numPages = Number(window.location.href.split("numPages=")[1]);
    var container = document.getElementById("container");
    var doc = new jsPDF();

    container.style.height="100%";

    document.body.style.height = numPages * 1105;
    document.body.style.width = 800;

    var done = function(){
      var fileLabel = localStorage.getItem("dg::fileName") + '.pdf';
      doc.save(fileLabel);
      document.write("<div id='container' width=800>"+localStorage.getItem("dg::export")+localStorage.getItem("dg::export1")+localStorage.getItem("dg::export2")+"</div>");
    };

    html2canvas(container).then(function(canvas){
      var ctxx = canvas.getContext("2d");
      var imageData = canvas.toDataURL("image/jpeg",1.0);
      var image = Canvas2Image.convertToJPEG(canvas);

      image.onload = function(){
        doc.addImage(imageData, 'JPEG', 10, 10);
        var count = 0;

        var pageGenerator(cropPosition){
          cropPosition = cropPosition || 1095;
          var height = 1095;
          var width = image.width;
          var canvas1 = document.createElement('canvas');
          var ctx = canvas1.getContext("2d");

          doc.addPage();

          canvas1.setAttribute('height', height);
          canvas1.setAttribute('width', width);
          ctx.drawImage(image, 0, cropPosition, width, height, -10, -10, width, height);

          var image2 = Canvas2Image.convertToJPEG(canvas1);// I can't believe you can't chain the setatribute to this
          image2.setAttribute("id", "image"+count);

          document.body.appendChild(image2);

          image2.onload = function(){
            count++;
            doc.addImage(image2, 'JPEG', 10, 10);
            if(count < numPages - 1){
              pageGenerator(cropPosition + height);
            }else{
              done();
            }
          };
        };
        pageGenerator();// could make this an iife
      };
    });

  },1000);
};