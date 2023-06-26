const fs = require('fs');
const getHeaderCsvFile = require('./csv-file-header');
const { bufferEncoding } = require('../constants');
const { errorType } = require('../constants');

/**
 * Get json data from csv file
 * @param {function} filterResults: get result with condition sorting, filtering...
 * @param {array} headerColumns: columns of CSV file
 * @param {results} results: json array data
 * @returns {object} error message and JSON data
 */
const filterResultsByKey = ({ filterResults, headerColumns, results }) => {
  if (filterResults) {
    const { getResults, key } = filterResults;
  
    if (!headerColumns.includes(key)) {
      return {
        errorMessage: `${errorType.invalidExportFile}: key is invalid`,
        jsonData: [],
      }
    }
    return {
      errorMessage: '',
      jsonData: getResults({ results, key }),
    }
  }

  return {
    errorMessage: '',
    jsonData: results,
  };
}

/**
 * Get json data from csv file
 * @param {string} csvFile: csv file data
 * @param {function} filterResults: get result with condition sorting, filtering...
 * @returns {object} error message and JSON data
 */
const getJsonData = ({ csvFile, filterResults }) => {
  const { rows, headerColumns } = getHeaderCsvFile(csvFile);
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

  const { errorMessage, jsonData } = filterResultsByKey({ filterResults, headerColumns, results });
  if (errorMessage) {
    return {
      errorMessage, jsonData
    }
  }
  filteredResults = jsonData;

  return {
    errorMessage: null,
    jsonData: JSON.stringify(filteredResults, null, 2),
  };
}

/**
 * Export JSON file from csv file using callback function
 * @param {string} csvFilePath: csv file path
 * @param {function} filterResults: get result with condition sorting, filtering...
 * @param {string} jsonFilePath: JSON file path
 * @param {function} callback: callback function handle error or success
 * @returns {object} error or notification success
 */
const exportJsonFromCsvByCallbackFunc = ({
  csvFilePath,
  filterResults,
  jsonFilePath,
  callback,
}) => {
  fs.readFile(csvFilePath, bufferEncoding, (err, data) => {
    if (err) {
      return callback(err);
    }

    const { errorMessage, jsonData } = getJsonData({ csvFile: data, filterResults });
    
    if (errorMessage) {
      return callback(errorMessage);
    }

    fs.writeFile(jsonFilePath, jsonData, bufferEncoding, (err) => {
      if (err) {
        return callback(err);
      }

      return callback(null);
    });
  });
};

/**
 * Export JSON file from csv file using promise
 * @param {string} csvFilePath: csv file path
 * @param {function} filterResults: get result with condition sorting, filtering...
 * @param {string} jsonFilePath: JSON file path
 * @returns {Promise} a promise handle error or success
 */
const exportJsonFromCsvByPromiseFunc = ({ csvFilePath, filterResults, jsonFilePath }) => {
  return new Promise((resolve, reject) => {
    fs.readFile(csvFilePath, bufferEncoding, (err, data) => {
      if (err) {
        return reject(err);
      }

      const { errorMessage, jsonData } = getJsonData({ csvFile: data, filterResults });

      if (errorMessage) {
        return reject(errorMessage);
      }

      fs.writeFile(jsonFilePath, jsonData, bufferEncoding, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve('CSV file converted to JSON successfully.');
      });
    });
  });
};

module.exports = {
  exportJsonFromCsvByCallbackFunc,
  exportJsonFromCsvByPromiseFunc,
}
