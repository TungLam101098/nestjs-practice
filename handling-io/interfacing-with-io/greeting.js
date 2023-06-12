/**
 * Handle input with STDIN, write output to STDOUT, and log errors to STDERR
 * @param {string} standard in
 * @returns {string} standard out success or error
 */

process.stdin.on("data", (data) => {
  const name = data.toString().trim().toUpperCase();
  if (name !== "") {
    process.stdout.write(`Hello ${name}!`);
  } else { process.stderr.write("Input was empty."); }
});
