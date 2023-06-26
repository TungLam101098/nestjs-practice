const { expectedColumns } = require('../constants');
const { validateCsvFileByCallbackFunc, exportJsonFromCsvByCallbackFunc, sortingResults } = require('../helpers');

const csvFilePath = './source/data.csv';
const jsonFilePath = './source/data.json';

const exportJsonFileCallback = (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('CSV file converted to JSON successfully.');
  }
}

const validateCsvFileCallback = (error, filePath) => {
  if (error) {
    console.error(error);
  } else {
    exportJsonFromCsvByCallbackFunc({
      csvFilePath: filePath,
      filterResults: { getResults: sortingResults, key: 'quantity' },
      jsonFilePath,
      callback: exportJsonFileCallback,
    });
  }
}

validateCsvFileByCallbackFunc({
  csvFilePath,
  expectedColumns,
  callback: validateCsvFileCallback,
});
