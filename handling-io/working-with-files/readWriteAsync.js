const fs = require("fs");
const path = require("path");
const filepath = path.join(process.cwd(), "hello.txt");

// Get contents inside hello.txt file
fs.readFile(filepath, "utf8", (err, contents) => {
  if (err) {
    return console.log(err);
  }
  console.log("File Contents:", contents);

  
  const upperContents = contents.toUpperCase();
  updateFile(filepath, upperContents);
});

/**
 * Update content in a file
 * @param {string} filepath file is update
 * @param {string} contents new content in this file
 * @returns {string} standard out success or error
 */
const updateFile = (filepath, contents) => {
  fs.writeFile(filepath, contents, (err) => {
    if (err) throw err;
    console.log("File updated.");
  });
}

