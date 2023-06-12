const fs = require("fs");
const path = require("path");
const filepath = path.join(process.cwd(), "hello.txt");

// Get contents inside hello.txt file
const contents = fs.readFileSync(filepath, "utf8");
console.log("File Contents:", contents);

// Update content to upperCase
const upperContents = contents.toUpperCase();
fs.writeFileSync(filepath, upperContents);

console.log("File updated.");