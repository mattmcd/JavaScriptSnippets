function init() {
  console.log('Loaded');
  var cmdline = document.getElementById('cmdline');
  cmdline.oninput = readChar;
}

function readChar(evt) {
  var cmd = evt.currentTarget.value;
  var c = cmd.slice(-1);
  console.log('Read a character: ' + c);
  // Example character dependent processing: ignore 'd'
  if (c === 'd') {
    evt.currentTarget.value = cmd.slice(0, -1); 
  }
}
