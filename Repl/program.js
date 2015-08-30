function init() {
  console.log('Loaded');
  var cmdline = document.getElementById('cmdline');
  cmdline.oninput = readChar;
}

function readChar(evt) {
  var cmd = evt.target.value;
  var startInd = evt.target.selectionStart - 1;
  var endInd = evt.target.selectionEnd;
  var c = cmd.slice(startInd, endInd);
  console.log('Read a character: ' + c);
  // Example character dependent processing: ignore 'd'
  if (c === 'd') {
    evt.target.value = cmd.slice(0, startInd) + cmd.slice(endInd); 
    evt.target.selectionStart = startInd;
    evt.target.selectionEnd = startInd;
  }
}
