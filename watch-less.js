var fs = require('fs');
var spawnSync = require('child_process').spawnSync;
var watchedFiles = process.argv.slice(2);

// doesn't attempt to solve file renames
for (var i = 0; i < watchedFiles.length; ++i) {
  var fi = watchedFiles[i];
  console.log('Updating file ' + fi);
  spawnSync('lessc', [fi]);
  (function (f) {
    fs.watch(f, function(ev, file) {
      console.log('Updating file ' + f);
      spawnSync('lessc', [f]);
    });
  })(fi);
}
