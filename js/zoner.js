  var filename;
  function handleFileSelect(evt) {
    var files = evt.target.files;
    filename = evt.target.files[0].name;

    for (var i = 0, f; f = files[i]; i++) {

      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          $("#pickfile").hide();
          $('img#editor').attr('src',e.target.result);
          if($('#grabber').length > 0)
            $('#grabber').remove();

          $("#reload").prop('disabled',false);
          setTimeout(createEditor,100);
        }
      })(f);
      reader.readAsDataURL(f);
    }
  }
var coords = new Array();
var points = new Array();
var shapes = new Array();
var rects = new Array();
var imgWidth,imgheight,offset;

function createEditor(){

          imgwidth = $('#editor').width();
          imgheight = $('#editor').height();
          offset = $('img#editor').offset();

$('#canvas').css({
position: "absolute",
top: Math.floor(offset.top),
left: Math.floor(offset.left),
width: Math.floor(imgwidth),
height: Math.floor(imgheight),
zIndex: 1,
opacity: .5,
});
var canvas = document.getElementById('canvas'),
    paper = new Raphael(canvas, imgwidth, imgheight),
    colour = 'black',
    mousedown = false,
    width = 1,
    lastX, lastY, path, pathString;
            $(canvas).mousedown(function (e) {
                mousedown = true;
                var x = e.pageX - $(this).offset().left;
                var y = e.pageY - $(this).offset().top;
                var i = {x:x,y:y,string:x+","+y};
                coords.push(i);
                var point = paper.circle(x,y,3);
                point.attr("fill","#cf0");
                points.push(point);
                if (points.length > 2) {
                  $("#closepath").prop('disabled',false).attr('value','Draw Polygon');
                } else if (points.length == 2) {
                  $("#closepath").prop('disabled',false).attr('value','Draw Rectangle');
                } else {
                  $("#closepath").prop('disabled',true).attr('value','Draw');
                }
                $('#clearpoints').prop('disabled',false);
            });
            $(document).mouseup(function () {
            });

            $(canvas).mousemove(function (e) {
              var xpx = Math.round(e.pageX - $('#editor').offset().left);
              var ypx = Math.round(e.pageY - $('#editor').offset().top);
              $("#xcordpx").text(xpx);
              $("#xcordpc").text(Math.round((xpx/imgwidth)*100));
              $("#ycordpx").text(ypx);
              $("#ycordpc").text(Math.round((ypx/imgheight)*100));
              $("#xypx").text(xpx+","+ypx);
            });

            $(document).keydown(function (e) {
                if (e.keyCode > 48 && e.keyCode < 58) {
                    width = e.keyCode - 48;
                }
            });

  $('#clearpoints').click(function(){
    for (var i = 0; i < points.length; i++) {
      points[i].remove()
    }
    coords.length = 0;
    points.length = 0;
    $('#clearpoints').prop('disabled',true);
  });
  $('#reload').click(function(){
    confirmation = window.confirm("Are you sure? This will start you from scratch again with no image, and you can't undo it.");
    if (confirmation) {
      window.location.reload(false);
    }
  });
  $('#clearall').click(function(){
    confirmation = window.confirm("Are you sure? This will delete everything, and you can't undo it.");
    if (confirmation) {
      paper.clear();
      points.length = 0;
      coords.length = 0;
      shapes.length = 0;
      rects.length = 0;
      $("#clearpoints").click();
      getPaths();
      $("#clearall").prop('disabled',true);
    }
    else return;
  });
  function getPaths (){
   tei = "<graphic url='"+filename+"' width='"+$('#editor').width()+"px' height='"+$('#editor').height()+"px' />\r\n";
   if (shapes.length > 0){
      for (var i = 0; i < shapes.length; i++) {
        var x,y,points="";
        for (var j=0; j < shapes[i].attrs.path.length; j++){
          if ($.inArray(shapes[i].attrs.path[j][0], new Array('M','L')) > -1){
            x = shapes[i].attrs.path[j][1];
            y = shapes[i].attrs.path[j][2];
            points += " " + Math.round(x) + "," + Math.round(y) + " ";
          }
        }
        tei += "<zone ";
        tei += " points = '" + points + "' ";
        tei += "/>";
        tei += "\r\n";
        tei = tei.replace(/^\s*|\s(?=\s)|\s*$/g, "");
      }
   }
   if (rects.length > 0){
      for (var i = 0; i < rects.length; i++) {
      tei += "<zone ";
        tei += 'ulx="'+Math.floor(rects[i].attr("x"))+'" ';
        tei += 'uly="'+Math.floor(rects[i].attr("y"))+'" ';
        tei += 'lrx="'+Math.floor(rects[i].attr("x") + rects[i].attr("width"))+'" ';
        tei += 'lry="'+Math.floor(rects[i].attr("y") + rects[i].attr("height"))+'" ';
      tei += "/>";
      tei += "\r\n";
      }
   }
   tei = hljs.highlight('xml',tei);
   $('#tei').html(tei.value);
    if (shapes.length > 0 || rects.length > 0) {
      $("#clearall").prop('disabled',false);
      $("#closepath").prop('disabled',true).attr('value','Draw');
    }
  }
  $('#gettei').click(function(){
    $("#teistuff").toggle();
    if ($("#teistuff").is(":visible"))
      $(this).attr('value','Hide TEI');
    else
      $(this).attr('value','Show TEI');
  });
  $('#closepath').click(function(){
   var path = null;
   if (coords.length > 2){
      for (var i = 0; i < coords.length; i++) {
        if (i == 0)
          var path = "M"+coords[i].string;
        else
          path += "L"+coords[i].string;
      }
      path += "z";
      var shape = paper.path(path);
      shape.attr({fill:"red",opacity:0.8});
      shapes.push(shape);
      getPaths();
      $("#clearpoints").prop('disabled',true);
   } else if (coords.length == 2) {
      var x = ( coords[0].x < coords[1].x ? coords[0].x : coords[1].x )
      var y = ( coords[0].y < coords[1].y ? coords[0].y : coords[1].y )
      var width = ( coords[0].x < coords[1].x ? coords[1].x - coords[0].x : coords[0].x - coords[1].x )
      var height = ( coords[0].y < coords[1].y ? coords[1].y - coords[0].y : coords[0].y - coords[1].y )
      var rect = paper.rect(x,y,width,height);
      rect.attr({fill:"red",opacity:0.8});
      rects.push(rect);
      getPaths();
      $("#clearpoints").prop('disabled',true);
   }
      for (var i = 0; i < points.length; i++) {
        points[i].remove()
      }
     coords.length = 0;
     points.length = 0;
  });
  getPaths();
  $('#gettei').prop('disabled',false);
}

$(document).ready(function(){
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  $("#tei").text("");
  $("#closepath").prop('disabled',true).attr('value','Draw');
  $("#clearall,#reload,#clearpoints, #gettei").prop('disabled',true);
  $('#teistuff').hide();
});