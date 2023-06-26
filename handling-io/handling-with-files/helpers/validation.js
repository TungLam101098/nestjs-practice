const fs = require('fs');
const getHeaderCsvFile = require('./csv-file-header');
const { bufferEncoding } = require('../constants');
const { errorType } = require('../constants');

/**
 * Get error message with conditions: enough columns, correct column names, enough data in csv file
 * @param {file} csvFile: csv data
 * @param {array} expectedColumns: string array contain all columns
 * @returns {string} error message
 */
const getErrorMessage = ({ csvFile, expectedColumns }) => {
  const { rows, headerColumns } = getHeaderCsvFile(csvFile);
  const headerColumnsLength = headerColumns.length;

  // Check the header columns length match the expected columns length
  if (headerColumnsLength !== expectedColumns.length) {
    return `CSV file has an incorrect number of columns. It should ${headerColumnsLength + 1} columns`;
  }

  // Check the header columns match the expected columns
  for (let i = 0; i < headerColumnsLength; i++) {
    if (headerColumns[i] !== expectedColumns[i]) {
      return `Column ${i + 1} should be "${expectedColumns[i]}"`;
    }
  }

  // Check data inside csv file
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(',');

    for (let j = 0; j < headerColumnsLength; j++) {
      if (!row[j]) {
        return `The ${i}th row is missing data`;
      }
    }
  }

  return null;
}

/**
 * Csv file validated
 * @param {string} csvFilePath: csv file path
 * @param {array} expectedColumns: string array contain all columns
 * @param {function} callback: callback function handle error or success
 * @returns {function} callback function handle error or success
 */
const validateCsvFileByCallbackFunc = ({ csvFilePath, expectedColumns, callback }) => {
  fs.readFile(csvFilePath, bufferEncoding, (err, data) => {
    if (err) {
      return callback(`${errorType.filePath}: ${err}`);
    }

    const errorMessage = getErrorMessage({ csvFile: data, expectedColumns });
    if (errorMessage) {
      return callback(`${errorType.invalidCsvFile}: ${errorMessage}`);
    }

    return callback(null, csvFilePath);
  });
}

/**
 * Csv file validated
 * @param {string} csvFilePath: csv file path
 * @param {array} expectedColumns: string array contain all columns
 * @returns {Promise} a promise handle error or success
 */
const validateCsvFileByPromiseFunc = ({ csvFilePath, expectedColumns }) => {
  return new Promise((resolve, reject) => {
    fs.readFile(csvFilePath, bufferEncoding, (err, data) => {
      if (err) {
        return reject(`${errorType.filePath}: ${err}`);
      }

      const errorMessage = getErrorMessage({ csvFile: data, expectedColumns });
      if (errorMessage) {
        return reject(`${errorType.invalidCsvFile}: ${errorMessage}`);
      }

      return resolve(csvFilePath);
    });
  });
}

module.exports = {
  validateCsvFileByCallbackFunc,
  validateCsvFileByPromiseFunc,
}
