function make_image_source(useVideo, fileList) {
  var isRunning = false;
  var isReadyToReceive = false;

  var samplePeriod = 40; // ms

  var startTime;
  var endTime;
  var averageFramePeriod = samplePeriod;
  var ewmaSmooth = 0.3;

  var videoSourceId;
  var selectedSource;

  var imageData;
  
  function getVideoSources(cbFun) {
    // Populate list of video sources e.g. laptop camera and USB webcam
    MediaStreamTrack.getSources( 
      function( srcInfo ) {
        videoSourceId = srcInfo
          .filter( function(s) { return s.kind == "video"; } );
        selectedSource = videoSourceId[0];
        if (typeof cbFun !== 'undefined') {
          cbFun(videoSourceId);
        }
      } 
    );
  }

  function setVideoInput(video, display) {
    var context = display.getContext("2d");

    navigator.webkitGetUserMedia(
      {video: { optional:[{sourceId : selectedSource}] }, audio:false}, 
      function (stream) {
        video.src = window.URL.createObjectURL(stream);
        draw( video, context);
      },
      function (err) {
        console.log("Unable to get media stream:" + err.Code );
      });
  }
  
  function draw(v,c) {
    // Draw from video v to canvas context c
    c.drawImage(v, 0, 0);
    setTimeout( draw, samplePeriod, v, c);
  }

  return {
    init : getVideoSources,
    getSourceIds : function(){ return videoSourceId; },
    setSource : function(srcId) { selectedSource = srcId;},
    setVideoInput: setVideoInput
  }
}

function make_image_source_view(image_source) {
  // DOM nodes
  var videoSelect;
  var video;
  var display;
  var src = image_source;
  
  function setVideoCb () {
    console.log("camera changed");
    src.setSource(videoSelect.value);
    src.setVideoInput(video, display);
  }
  
  function setVideoSelectList(videoSourceId) {
    videoSourceId.map( function(s, ind) { 
            // Set up list of cameras
            var option = document.createElement( "option" );
            option.text = "camera " + ind;
            option.value= s.id;
            videoSelect.appendChild( option );
            return s.id; } );
    src.setVideoInput(video, display);
    videoSelect.onchange = setVideoCb;
    videoSelect.hidden = false;
  }
  
  function getImageData( id ) {
    // Get image data from specified canvas
    var ctx = display.getContext( "2d" );
    var height = display.height;
    var width = display.width;
    var nBytes = height * width * 4; 
    var pixels = ctx.getImageData(0, 0, width, height);
    var imData = { width: width, height: height, 
      data: pixels.data.buffer };
    return imData;
  }
  
  function initControls() {
  // DOM Nodes for controls
    videoSelect = document.querySelector("select#camera");
    video = document.getElementById("live");
    display = document.getElementById("display");
    src.init(setVideoSelectList);
    src.setVideoInput(video, display);
  }

  return {
    init: initControls
  }

}

function pageDidLoad() {
  var image_source = make_image_source(true);
  var view = make_image_source_view(image_source);
  view.init();
}
