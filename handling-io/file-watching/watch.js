const fs = require("fs");
const file = "./file.txt";

// Log current time when file change
fs.watchFile(file, (current, previous) => {
  return console.log(`${file} updated ${(current.mtime)}`);
});