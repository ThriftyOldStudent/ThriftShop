$(document).ready(function(){

    var element = $("#html-content-holder"); 
    var getCanvas; // global variable
   
    html2canvas(element, {
      onrendered: function (canvas) {
        $("#previewImage").append(canvas);
        getCanvas = canvas;
      }
    });
  });