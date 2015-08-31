function make_repl(node) {
  var readChar = function(evt) {
    var cmd = node.value;
    var startInd = node.selectionStart - 1;
    var endInd = node.selectionEnd;
    var c = cmd.slice(startInd, endInd);
    console.log('Read a character: ' + c);
    // Example character dependent processing: ignore 'd'
    if (c === 'd') {
      node.value = cmd.slice(0, startInd) + cmd.slice(endInd); 
      node.selectionStart = startInd;
      node.selectionEnd = startInd;
    }
  }

  node.oninput = readChar;
  return {readChar: readChar};
}


function init() {
  console.log('Loaded');
  var cmdline = document.getElementById('cmdline');
  // cmdline.oninput = readChar;
  var repl = make_repl(cmdline);
}

