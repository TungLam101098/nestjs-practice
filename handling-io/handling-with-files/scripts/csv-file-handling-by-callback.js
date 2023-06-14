const { expectedColumns } = require('../constants');
const { validateCsvFile, exportJsonFromCsv, sortingResults } = require('../helpers');

const csvFilePath = './source/data.csv';
const jsonFilePath = './source/data.json';

const exportJsonFileCallback = (error) => {
  if (error) {
    console.error(`Error: ${error}`);
  } else {
    console.log('CSV file converted to JSON successfully.');
  }
}

const validateCsvFileCallback = (error, filePath) => {
  if (error) {
    console.error(`Error: ${error}`);
  } else {
    exportJsonFromCsv({
      csvFilePath: filePath,
      filterResults: { getResults: sortingResults, key: 'quantity' },
      jsonFilePath,
      callback: exportJsonFileCallback,
    });
  }
}

validateCsvFile({ csvFilePath, expectedColumns, callback: validateCsvFileCallback });
