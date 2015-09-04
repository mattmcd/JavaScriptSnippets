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

function getVideoSources() {
  // Populate list of video sources e.g. laptop camera and USB webcam
  var videoSelect = document.querySelector("select#camera");
  MediaStreamTrack.getSources( 
    function( srcInfo ) {
      videoSourceId = srcInfo
        .filter( function(s) { return s.kind == "video"; } )
        .map( function(s, ind) { 
          // Set up list of cameras
          var option = document.createElement( "option" );
          option.text = "camera " + ind;
          option.value= s.id;
          videoSelect.appendChild( option );
          return s.id; } );
      selectedSource = videoSourceId[0];
      setVideoInput();
    } 
  );
  videoSelect.onchange = setVideoCb;
}

function setVideoCb () {
  console.log("camera changed");
  var videoSelect = document.querySelector("select#camera");
  selectedSource = videoSelect.value;
  setVideoInput();
}

function setVideoInput() {
  var video = document.getElementById("live");
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

function pageDidLoad() {
  getVideoSources();
}

function draw(v,c) {
  c.drawImage(v, 0, 0);
  setTimeout( draw, samplePeriod, v, c);
}

function getImageData( id ) {
  // Get image data from specified canvas
  var display = document.getElementById(id);
  var ctx = display.getContext( "2d" );
  var height = display.height;
  var width = display.width;
  var nBytes = height * width * 4; 
  var pixels = ctx.getImageData(0, 0, width, height);
  var imData = { width: width, height: height, data: pixels.data.buffer };
  return imData;
}

function startSending() {
  isRunning = true;
  isReadyToReceive = true;
  var go = document.getElementById( "go" );
  go.disabled = true;
  var stop = document.getElementById( "stop" );
  stop.disabled = false;
  sendImage();
}

function stopSending() {
  isRunning = false;
  isReadyToReceive = false;
  var go = document.getElementById( "go" );
  go.disabled = false;
  var stop = document.getElementById( "stop" );
  stop.disabled = true;
}
