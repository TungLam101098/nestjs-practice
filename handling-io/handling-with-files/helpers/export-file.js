const fs = require('fs');
const getHeaderCsvFile = require('./csv-file-header');
const { bufferEncoding } = require('../constants');

/**
 * Export JSON file from csv file
 * @param {string} csvFilePath: csv file path
 * @param {function} filterResults: get result with condition sorting, filtering...
 * @param {string} jsonFilePath: JSON file path
 * @param {function} callback: callback function handle error or success
 * @returns {function} error or notification success
 */
const exportJsonFromCsv = ({ csvFilePath, filterResults, jsonFilePath, callback }) => {
  fs.readFile(csvFilePath, bufferEncoding, (err, data) => {
    if (err) {
      return callback(err);
    }

    const { rows, headerColumns } = getHeaderCsvFile(data);
    const results = [];
    let filteredResults = [];

    // Convert CSV file => array
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim().split(',');
      const rowData = {};

      for (let j = 0; j < headerColumns.length; j++) {
        rowData[headerColumns[j]] = row[j];
      }

      results.push(rowData);
    }

    if (filterResults) {
      const { getResults, key } = filterResults;

      if (headerColumns.includes(key)) {
        filteredResults = getResults({ results, key });
      } else {
        return callback('key is invalid');
      }

    } else {
      filteredResults = results;
    }

    const jsonData = JSON.stringify(filteredResults, null, 2);

    fs.writeFile(jsonFilePath, jsonData, bufferEncoding, (err) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null);
      }
    });
  });
}

module.exports = {
  exportJsonFromCsv,
}
