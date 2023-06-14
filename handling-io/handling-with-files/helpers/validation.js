const fs = require('fs');
const getHeaderCsvFile = require('./csv-file-header');
const { bufferEncoding } = require('../constants');

/**
 * Csv file validate with conditions: enough columns, correct column names, enough data in csv file
 * @param {string} csvFilePath: csv file path
 * @param {array} expectedColumns: string array contain all columns
 * @param {function} callback: callback function handle error or success
 * @returns {function} error and csv file path
 */
const validateCsvFile = ({ csvFilePath, expectedColumns, callback }) => {
  fs.readFile(csvFilePath, bufferEncoding, (err, data) => {
    if (err) {
      return callback(err);
    }

    const { rows, headerColumns } = getHeaderCsvFile(data);
    const headerColumnsLength = headerColumns.length;

    // Check the header columns length match the expected columns length
    if (headerColumnsLength !== expectedColumns.length) {
      return callback(`CSV file has an incorrect number of columns. It should ${headerColumnsLength + 1} columns`);
    }

    // Check the header columns match the expected columns
    for (let i = 0; i < headerColumnsLength; i++) {
      if (headerColumns[i] !== expectedColumns[i]) {
        return callback(`Column ${i + 1} should be "${expectedColumns[i]}"`);
      }
    }

    // Check data inside csv file
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');

      for (let j = 0; j < headerColumnsLength; j++) {
        if (!row[j]) {
          return callback(`The ${i}th row is missing data`);
        }
      }
    }

    return callback(null, csvFilePath);
  });
}

module.exports = {
  validateCsvFile,
}
